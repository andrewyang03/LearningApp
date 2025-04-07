from pydantic import BaseModel, Field
class ResponseFormatter(BaseModel):
    """Always use this tool to structure your response to the user."""
    answer: str = Field(description="The answer to the user's question")
    followup_question: str = Field(description="A followup question the user could ask")

class MatchingGame(BaseModel):
    questions: list[str] = Field(description="The list of questions to be answered")
    options: list[str] = Field(description="List of answer options")
    explanation: str = Field(description="Explanation for the answer")
    correct_match: dict[str, str] = Field(description="The correct matching pairs from the options, with question as key and answer as value")
 
class MultipleChoiceQuestion(BaseModel):
    question: str = Field(description="The question to be answered")
    options: list[str] = Field(description="List of answer options")
    explanation: str = Field(description="Explanation for the answer")
    correct_answer: str = Field(description="The correct answer from the options")
    distractors: list[str] = Field(description="List of plausible distractors")

class FillInTheBlankQuestion(BaseModel):
    question: str = Field(description="The question with a blank to be filled")
    correct_answer: str = Field(description="The correct answer to fill in the blank")
    distractors: list[str] = Field(description="List of plausible distractors")
    explanation: str = Field(description="Explanation for the answer")

class OpenResponseQuestion(BaseModel):
    question: str = Field(description="The open-ended question to be answered")
    answer: str = Field(description="The answer to the open-ended question")
    followup_question: str = Field(description="A followup question the user could ask")
    
class TrueFalseQuestion(BaseModel):
    question: str = Field(description="The true/false question to be answered")
    correct_answer: bool = Field(description="True or False answer")
    explanation: str = Field(description="Explanation for the answer")

