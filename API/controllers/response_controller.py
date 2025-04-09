from flask import Blueprint, request, jsonify
from urllib.parse import urljoin
import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()

response_controller = Blueprint('response_controller', __name__)
@response_controller.route('/check-open-response', methods=["POST"])
def validate_response():
    if "question" not in request.form:
        return jsonify({'error': 'No question part in the request'}), 400
    
    if 'student_response' not in request.form:
        return jsonify({'error': 'No response part in the request'}), 400
    
    try:
        question_instance = json.loads(request.form.get("question"))
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid question format'}), 400
    
    question = question_instance.get("question")
    correct_answer = question_instance.get("answer")
    student_response = request.form.get("student_response")
    
    if not question or not correct_answer:
        return jsonify({'error': 'Invalid question data'}), 400
    
    try:
        api_endpoint = os.getenv("API_ENDPOINT")
        url = urljoin(api_endpoint, "model-open-res")
        res = requests.post(url, json={
            'question': question, 
            'correct_answer': correct_answer, 
            'student_response': student_response,
        })
        
        return res.json(), res.status_code
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    