from ultralytics import YOLO

# Load YOLOv8 nano pretrained model
model = YOLO("yolov8n.pt")

# Train on your merged + expanded dataset
model.train(
    data="dataset/food_v2/data.yaml",
    epochs=30,
    imgsz=512,
    device="cpu",
    project="runs/food_detection",
    name="v2_13class"
)
print("Training complete")