from flask import Flask
from flask_cors import CORS
from controllers.pdf_controller import pdf_controller
from controllers.response_controller import response_controller
from orchestrator.api_orchestrator import api_orchestrator
from gateway.model import model_gateway

app = Flask(__name__)
app.register_blueprint(pdf_controller)
app.register_blueprint(api_orchestrator)
app.register_blueprint(model_gateway)
app.register_blueprint(response_controller)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def hello():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True)
