from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults
import os
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

model_gateway = Blueprint('model_gateway', __name__)

llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o-mini",
    temperature=0
)
os.environ["TAVILY_API_Key"] = os.getenv("TAVILY_API_KEY")

search = TavilySearchResults(max_results=2)
tools = [search]



def create_matching_games(text):
    
    
    systemMessage = '''
    
    You are an expert in generating matching flashcards in order to assist students in learning more effectively.
    Given the above text, create a matching game in which 3 questions are generated for each game along with 3 answers.
    The goal of the game is to match each questions with the corresponding correct answer.
    Ensure that each question is not repeated, and check that all the questions are conforming to the text.
    The game should include the following fields:
    
    questions: list[str] = Field(description="The list of questions to be answered")
    options: list[str] = Field(description="List of answer options")
    explanation: str = Field(description="Explanation for the answer")
    correct_match: dict[str, str] = Field(description="The correct matching pairs from the options, with question as key and answer as value")
    
    This output should be formatted in a JSON format. You will generate 10 of these instances or games so 30 question answer pairs in total.
    Return your output in a json format with the following fields:
    questions: list[str] = Field(description="The list of questions to be answered")
    options: list[str] = Field(description="List of answer options")
    explanation: str = Field(description="Explanation for the answer")
    correct_match: dict[str, str] = Field(description="The correct matching pairs from the options, with question as key and answer as value")

    '''
    prompt = ChatPromptTemplate.from_messages([
        ("system", systemMessage),
        ("user", "Create a matching game with the following text: {text}"),
        ("placeholder", "{agent_scratchpad}")
        
    ])
    try:
        agent = create_tool_calling_agent(llm, tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools)
        response = agent_executor.invoke({"text": text})
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_fill_in_the_blank(text):
    systemMessage = '''

    You are an expert in generating fill in the blank questions in order to assist students in learning more effectively.
    Given the above text, create 10 fill in the blank exercises, with each exercise consisting of a question and 4 corresponding 
    answer options. Only one option will be the correct answer. Ensure that each question is not repeated, 
    and check that all the questions are conforming to the text. Additionally, each question should have a plausible distractor, 
    which is a wrong answer that is still related to the text.
    
    The task should include the following fields:
    
    question: str = Field(description="The question with a blank to be filled")
    correct_answer: str = Field(description="The correct answer to fill in the blank")
    distractors: list[str] = Field(description="List of plausible distractors")
    explanation: str = Field(description="Explanation for the answer")
    
    This output should be formatted in a JSON format.
    '''
    prompt = ChatPromptTemplate.from_messages([
        ("system", systemMessage),
        ("user", "Create a set of fill in the blank exercises with the following text: {text}"),
        ("placeholder", "{agent_scratchpad}")
        
    ])
    try:
        agent = create_tool_calling_agent(llm, tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools)
        response = agent_executor.invoke({"text": text})
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_open_response(text):
    systemMessage = '''
    
    You are an expert in generating open ended responses in order to assist students in learning more effectively.
    Given the above text, create 10 open response exercises, with each exercise consisting of a question, 
    a sample correct answer, and an anticipated follow up question from the student. 
    Ensure that each question is not repeated, and check that all the questions 
    are conforming to the text. Additionally, each question should have a plausible distractor, 
    which is a potential response related to the text that the student may believe is the correct answer.
    
    The task should include the following fields:
    
    question: str = Field(description="The open-ended question to be answered")
    answer: str = Field(description="The answer to the open-ended question")
    followup_question: str = Field(description="A followup question the user could ask")
    
    This output should be formatted in a JSON format.
    '''
    prompt = ChatPromptTemplate.from_messages([
        ("system", systemMessage),
        ("user", "Create a set of open ended exercises with the following text: {text}"),
        ("placeholder", "{agent_scratchpad}")
        
    ])
    try:
        agent = create_tool_calling_agent(llm, tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools)
        response = agent_executor.invoke({"text": text})
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Should include randomized plausible distractors
def create_multiple_choice(text):
    systemMessage = '''
    
    You are an expert in generating multiple choice questions in order to assist students in learning more effectively.
    Given the above text, create 10 multiple choice questions, with each exercise consisting of a question, 4 answer options,
    and a correct answer. Each option should consist of at least one plausible distractor that is related to the text, and 
    each exercise should include an explanation for the correct answer and why the plausible distractors are incorrect. 
    Ensure that each question is not repeated, and check that all the questions are conforming to the text. 
    
    The task should include the following fields:
    
    question: str = Field(description="The question to be answered")
    options: list[str] = Field(description="List of answer options")
    explanation: str = Field(description="Explanation for the answer")
    correct_answer: str = Field(description="The correct answer from the options")
    distractors: list[str] = Field(description="List of plausible distractors")
    
    This output should be formatted in a JSON format.
    '''
    prompt = ChatPromptTemplate.from_messages([
        ("system", systemMessage),
        ("user", "Create a set of multiple choice exercises with the following text: {text}"),
        ("placeholder", "{agent_scratchpad}")
        
    ])
    try:
        agent = create_tool_calling_agent(llm, tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools)
        response = agent_executor.invoke({"text": text})
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        

def create_true_false(text):
    systemMessage = '''
    
    You are an expert in generating true false responses in order to assist students in learning more effectively.
    Given the above text, create 10 true false exercises, with each exercise consisting of a question, 
    the correct answer, and an explanation for the correct answer. Ensure that each question is not repeated, 
    and check that all the questions are conforming to the text. 
    
    The task should include the following fields:
    
    question: str = Field(description="The true/false question to be answered")
    correct_answer: bool = Field(description="True or False answer")
    explanation: str = Field(description="Explanation for the answer")
    
    This output should be formatted in a JSON format.
    '''
    prompt = ChatPromptTemplate.from_messages([
        ("system", systemMessage),
        ("user", "Create a set of true or false exercises with the following text: {text}"),
        ("placeholder", "{agent_scratchpad}")
        
    ])
    try:
        agent = create_tool_calling_agent(llm, tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools)
        response = agent_executor.invoke({"text": text})
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@model_gateway.route('/model', methods=['POST'])
def create_quizzes():
    data = request.get_json()

    if not data or 'text' not in data or 'quizzes' not in data:
        return jsonify({'error': 'No text or quiz specifications provided'}), 400

    text = data['text']
    quizzes = data['quizzes']
    
    generated_quizzes = {}
    
    try:
        for quiz in quizzes:
            if quiz == "Matching Game":
                generated_quizzes["matching_games"] = create_matching_games(text)
            elif quiz == "Fill In the Blank":
                generated_quizzes["fill_in_the_blank"] = create_fill_in_the_blank(text)
            elif quiz == "Open Response":
                generated_quizzes["open_response"] = create_open_response(text)
            elif quiz == "Multiple Choice":
                generated_quizzes["multiple_choice"] = create_multiple_choice(text)
            elif quiz == "True and False":
                generated_quizzes["true_and_false"] = create_true_false(text)  

        return jsonify(generated_quizzes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@model_gateway.route('/model-open-res', methods=['POST'])
def checkOpenRes():
    data = request.get_json()
    if not data or 'question' not in data or 'correct_answer' not in data or 'student_response' not in data:
        return jsonify({'error': 'No data or data specifications provided'}), 400
    
    question = data['question']
    correct_answer = data['correct_answer']
    student_response = data['student_response']
    
    inputs = f"Question: {question} \nCorrect Solution: {correct_answer}\n Student Answer: {student_response}"
    
    systemMessage = '''
    
    You are an expert in reviewing open ended responses in order to assist students in learning more effectively.
    Given the question, correct answer, and student response below, validate whether the student's response can
    be deemed a correct answer. If the response is considered to be incorrect, please provide an explanation as to
    why that response is incorrect. A correct response should have contain the fundamental concepts present in the
    sample answer rather than if the student response is phrased similarly to the answer. Partially correct answers
    should also receive justification for why it is partially correct.
    
    This output should be formatted in a JSON format with the following fields:
    
    decision: str = Field(description="Return either correct, incorrect, or partially correct")
    explanation: str = Field(description="Justification for decision")
    '''
    prompt = ChatPromptTemplate.from_messages([
        ("system", systemMessage),
        ("user", "Check whether the response below is a correct solution or not: \n{inputs}"),
        ("placeholder", "{agent_scratchpad}")
    
    ])
    
    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools)
    response = agent_executor.invoke({"inputs": inputs})
    return jsonify(response), 200

def main():
#     sample_text = """
# In Python, a function is a block of reusable code that performs a specific task. Functions are defined using the 'def' keyword, 
# followed by the function name and parentheses (). Parameters can be passed inside the parentheses.

# For example:
# def greet(name):
#     print(f"Hello, {name}!")

# To call a function, use its name followed by parentheses with any required arguments.
# You can return values using the 'return' statement.

# Functions improve code modularity and reusability. Python also supports lambda functions, 
# which are anonymous one-line functions often used for short operations.
# """
#     print("Generating Matching Games...")
#     matching = create_matching_games(sample_text)
#     print(matching)
    pass

if __name__ == "__main__":
    main()