require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const User = require('./models/User'); 
const { execFile } = require("child_process");
const multer = require("multer");
const path = require("path");
const nutritionData = require('./data/nutrition.json');



const app = express();

// Middleware - limit increased for profile pictures
app.use(cors());
app.use(express.json({ limit: '10mb' })); 

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connected to MongoDB: dietDB'))
  .catch(err => console.error(' MongoDB Connection error:', err));

// --- ROUTES ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 1. TEST ROUTE
app.get('/', (req, res) => {
  res.send('NutriSnap Backend is running...');
});

// 2. SIGN UP ROUTE
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, age, height, weight, goal, allergies, conditions } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      age,
      height,
      weight,
      goal,
      allergies: allergies ? (typeof allergies === 'string' ? allergies.split(',').map(s => s.trim()) : allergies) : [],
      conditions: conditions ? (typeof conditions === 'string' ? conditions.split(',').map(s => s.trim()) : conditions) : []
    });

    await newUser.save();
    console.log(`👤 New user created: ${normalizedEmail}`);
    res.status(201).json({ message: "User registered successfully!", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. LOGIN ROUTE (Added debug logs)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    console.log(`Attempting login for: ${normalizedEmail}`);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        console.log(" Login failed: Email not found");
        return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log(" Login failed: Password mismatch");
        return res.status(400).json({ message: "Invalid Email or Password" });
    }

    console.log(" Login successful");
    const { password: _, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET USER PROFILE
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. UPDATE USER PROFILE
app.put('/api/user/:id', async (req, res) => {
  try {
    const { name, age, height, weight, goal, allergies, conditions, avatar } = req.body;

    const updatedAllergies = typeof allergies === 'string' ? allergies.split(',').map(s => s.trim()) : allergies;
    const updatedConditions = typeof conditions === 'string' ? conditions.split(',').map(s => s.trim()) : conditions;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, age, height, weight, goal, avatar, allergies: updatedAllergies, conditions: updatedConditions },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. DUMMY ROUTES (To prevent "Unexpected character: <" errors)
// These routes stop the app from crashing until we build real Diary/Summary features
app.get('/api/todaySummary', (req, res) => {
    res.json({ calories: 0, protein: 0, carbs: 0, fats: 0 });
});

app.get('/api/diary', (req, res) => {
    res.json([]);
});

app.post("/api/detect-food", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;

  const pythonCmd = "py";
  const inferPath = path.join(__dirname, "..", "nutrisnap-ai", "infer.py");

  const args = [
    "-3.10",
    inferPath,
    imagePath
  ];

  execFile(pythonCmd, args, (error, stdout, stderr) => {
    if (error) {
      console.error("Python error:", stderr);
      return res.status(500).json({ error: "Detection failed" });
    }

    try {
     const detections = JSON.parse(stdout);

// 🔥 enrich detections with nutrition
const enrichedDetections = detections.map(d => ({
  label: d.label,
  confidence: d.confidence,
  nutrition: nutritionData[d.label] || null
}));

res.json({ detections: enrichedDetections });

    } catch (e) {
      console.error("Invalid Python output:", stdout);
      res.status(500).json({ error: "Invalid model output" });
    }
  });
});





// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(` Server is running on port ${PORT}`);
});