from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import random
import uuid
from model import clip_damage_descriptions
import hashlib

# Замена uuid.uuid4().hex на хэш содержимого файла
def generate_filename_hash(file_content):
    hash_obj = hashlib.sha256(file_content)
    return hash_obj.hexdigest()  # уникальный хэш на основе содержимого файла

app = Flask(__name__, static_folder='../static')
CORS(app)

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_images(file_paths):
    """Анализ изображений с помощью модели clip_damage_descriptions"""
    combined_results = {}

    for file_path in file_paths:
        results, _ = clip_damage_descriptions(file_path)
        i = 0
        for desc, prob in results:
            i += 1
            # Суммируем вероятности по всем изображениям
            print(results)
            combined_results[desc] =combined_results.get(desc, 0) + prob

    combined_results = {k: float(v) for k, v in combined_results.items()}
    return combined_results



@app.route('/upload', methods=['POST'])
def upload_file():
    if 'files' not in request.files:
        return jsonify({'error': 'No files part'}), 400
    
    files = request.files.getlist('files')
    
    if len(files) == 0:
        return jsonify({'error': 'No selected files'}), 400
    
    saved_files = []
    
    # Сохраняем все файлы
    for file in files:
        if file.filename == '':
            continue
            
        if not (file and allowed_file(file.filename)):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Генерируем уникальное имя файла
        unique_filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        saved_files.append(file_path)
    
    # Анализируем все изображения вместе
    common_analysis = analyze_images(saved_files)
    
    # Формируем ответ с общим анализом и списком изображений
    images_data = []
    for file_path in saved_files:
        images_data.append({
            'processed_image': f"/{file_path}",
            'classification': 'Vehicle'
        })
    
    return jsonify({
        'common_analysis': common_analysis,
        'images': images_data
    })

@app.route('/get', methods=['GET'])
def get():
    return jsonify({'hello': 'hello'})

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8082)
