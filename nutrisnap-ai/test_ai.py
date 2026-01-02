from ultralytics import YOLO

model = YOLO("runs/food_detection/v2_13class/weights/best.pt")

model(
    source="test_images",
    conf=0.15, 
    save=True
)


