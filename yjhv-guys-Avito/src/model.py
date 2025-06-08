import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

# Загружаем модель CLIP
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def is_car(image):
    prompts = ["A photo of a car", "A photo of not a car"]
    inputs = clip_processor(text=prompts, images=image, return_tensors="pt", padding=True)
    outputs = clip_model(**inputs)
    probs = outputs.logits_per_image.softmax(dim=1)[0]

    return {
        "car_prob": probs[0].item(),
        "not_car_prob": probs[1].item(),
        "is_car": probs[0].item() > probs[1].item()
    }


def clip_damage_descriptions(image_path):
    image = Image.open(image_path).convert("RGB")
    check = is_car(image)
    # Подсказки, описывающие повреждения и состояние авто
    prompts = [
        "Car with total loss: heavily damaged car, not drivable, only for parts",
        "Car with severely damaged: car not drivable, heavily damaged but repairable",
        "Car with moderate damage: car drivable, has damage, requires parts repair",
        "Car with minor damage: car with dents and scratches, minor damage",
        "Car with cosmetic defects: car with small cosmetic defects and scratches, no major damage",
    ]

    inputs = clip_processor(text=prompts, images=image, return_tensors="pt", padding=True)
    outputs = clip_model(**inputs)
    
    # Логиты сходства между изображением и текстом
    logits_per_image = outputs.logits_per_image
    probs = logits_per_image.softmax(dim=1)[0]

    # Объединим текст и вероятность, отсортируем по убыванию
    results = list(zip(prompts, probs.detach().cpu().numpy()))
    # отсортируем по убыванию
    # results.sort(key=lambda x: x[1], reverse=True)
    return results, check

if __name__ == "__main__":
    image_path = "./car_dataset/images/9401493188.jpg"  # укажи путь к своему изображению
    results = clip_damage_descriptions(image_path)
    print("Описания состояния машины:")
    for desc, prob in results:
        print(f"{desc} (вероятность: {prob:.2f})")
