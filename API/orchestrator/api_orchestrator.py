from flask import Blueprint, request, jsonify
import nltk, os
from dotenv import load_dotenv
from urllib.parse import urljoin
import requests
import json

load_dotenv()
api_orchestrator = Blueprint('api_orchestrator', __name__)


# def download_punkt():
#     nltk_data_dir = os.path.abspath(os.path.join(os.getcwd(), 'nltk_data'))
#     if not os.path.exists(nltk_data_dir):
#         os.makedirs(nltk_data_dir)

#     nltk.data.path.append(nltk_data_dir)
#     nltk.download('punkt_tab', download_dir=nltk_data_dir)

@api_orchestrator.route('/format', methods=['POST'])
def format_text():
    data = request.get_json()
    
    if not data or 'text' not in data or 'quizzes' not in data:
        return jsonify({'error': 'No text or quiz specifications provided'}), 400
    
    text = data['text']
    quizzes = data['quizzes']
    
    try:
        # Pass it off to create quizzes
        api_endpoint = os.getenv("API_ENDPOINT")
        url = urljoin(api_endpoint, "model")
        
        try:
            res = requests.post(url, json={'text': text, 'quizzes': quizzes})
            output = res.json()
            
            cleaned_quizzes = {}
            
            for type, data in output.items():
                # Change from string to json object
                try:
                    cleaned_quiz = data["output"].strip("```").replace("json", "", 1).strip()
                    cleaned_quizzes[type] = json.loads(cleaned_quiz)
                except (KeyError, json.JSONDecodeError) as e:
                    return jsonify({'error': f'Failed to parse {type} data', 'details': str(e)}), 500
            
            
            return jsonify(cleaned_quizzes), res.status_code

        except KeyError as e:
                return jsonify({'error': str(e)}), 500
        
        except requests.exceptions.RequestException as e:
            return jsonify({'error': 'Error connecting to the model service', 'details': str(e)}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500