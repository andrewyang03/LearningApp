import { MultipleChoiceQuestion, TrueFalseQuestion, OpenResponseQuestion, MatchingGame, FillInTheBlankQuestion, QuizAPIResponse } from "@/schemas/definitions";

type quizData = MatchingGame[] |MultipleChoiceQuestion[] | TrueFalseQuestion[] | OpenResponseQuestion[] | FillInTheBlankQuestion[]

export const exportAsHTML = (score: number, quizData: quizData, mapping: Record<string, keyof QuizAPIResponse>, type: string) => {
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quiz Results</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .question { margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .correct { background-color: #d4edda; }
        .incorrect { background-color: #f8d7da; }
        h1, h2 { color: #333; }
        .score { font-size: 20px; font-weight: bold; margin: 20px 0; }
      </style>
    </head>
    <body>
      <h1>Quiz Results</h1>
      <div class="score">Your score: ${score} out of ${quizData.length}</div>
    `;
  
    // Add each question and its details
    quizData.forEach((question, index) => {
        htmlContent += `<div class="question">
        <h2>Question ${index + 1}</h2>`;
        
        // Format based on question type
        if (mapping[type] === "multiple_choice") {
        const q = question as MultipleChoiceQuestion;
        htmlContent += `
            <p><strong>Question:</strong> ${q.question}</p>
            <p><strong>Options:</strong> ${q.options.join(", ")}</p>
            <p><strong>Correct Answer:</strong> ${q.correct_answer}</p>
            <p><strong>Explanation:</strong> ${q.explanation}</p>
        `;
        } else if (mapping[type] === "true_and_false") {
        const q = question as TrueFalseQuestion;
        htmlContent += `
            <p><strong>Question:</strong> ${q.question}</p>
            <p><strong>Correct Answer:</strong> ${q.correct_answer ? "True" : "False"}</p>
            <p><strong>Explanation:</strong> ${q.explanation}</p>
        `;
        } else if (mapping[type] === "fill_in_the_blank") {
        const q = question as FillInTheBlankQuestion;
        htmlContent += `
        <p><strong>Question:</strong> ${q.question}</p>
        <p><strong>Correct Answer:</strong> ${q.correct_answer}</p>
        <p><strong>Explanation:</strong> ${q.explanation}</p>
        `;
        } else if (mapping[type] === "matching_games") {
        const q = question as MatchingGame;
        htmlContent += `
            <p><strong>Questions:</strong></p>
            <ul>
            ${q.questions.map(qi => `<li>${qi}</li>`).join('')}
            </ul>
            <p><strong>Options:</strong></p>
            <ul>
            ${q.options.map(opt => `<li>${opt}</li>`).join('')}
            </ul>
            <p><strong>Correct Matches:</strong></p>
            <ul>
            ${Object.entries(q.correct_match).map(([question, answer]) => 
                `<li>${question} → ${answer}</li>`).join('')}
            </ul>
            <p><strong>Explanation:</strong> ${q.explanation}</p>
        `;
        } else if (mapping[type] === "open_response") {
        const q = question as OpenResponseQuestion;
        htmlContent += `
            <p><strong>Question:</strong> ${q.question}</p>
            <p><strong>Sample Answer:</strong> ${q.answer}</p>
            <p><strong>Follow-up Question:</strong> ${q.follow_up_question}</p>
        `;
        }
        htmlContent += `</div>`;
    });
  
    htmlContent += `
      </body>
      </html>
    `;
  
    // Create a downloadable link
    const element = document.createElement('a');
    const file = new Blob([htmlContent], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `quiz-results-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export const exportAsPDF = (score: number, quizData: quizData, mapping: Record<string, keyof QuizAPIResponse>, type: string) => {
    // Create a printable version of the quiz
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
        // Create HTML content with quiz questions and answers - similar to HTML export
        let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Quiz Results</title>
            <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .question { margin-bottom: 30px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            h1, h2 { color: #333; }
            .score { font-size: 20px; font-weight: bold; margin: 20px 0; }
            @media print {
                .no-print { display: none; }
            }
            </style>
        </head>
        <body>
            <h1>Quiz Results</h1>
            <div class="score">Your score: ${score} out of ${quizData.length}</div>
            <div class="no-print">
            <p>To save as PDF, use your browser's print function and select "Save as PDF".</p>
            <button onclick="window.print()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 30px;">
                Print / Save as PDF
            </button>
            </div>
        `;

        // Add each question (similar to HTML export content)
        quizData.forEach((question, index) => {
            htmlContent += `<div class="question">
                <h2>Question ${index + 1}</h2>`;
            
            // Format based on question type (same as in exportAsHTML)
            if (mapping[type] === "multiple_choice") {
                const q = question as MultipleChoiceQuestion;
                htmlContent += `
                <p><strong>Question:</strong> ${q.question}</p>
                <p><strong>Options:</strong> ${q.options.join(", ")}</p>
                <p><strong>Correct Answer:</strong> ${q.correct_answer}</p>
                <p><strong>Explanation:</strong> ${q.explanation}</p>
                `;
            } else if (mapping[type] === "true_and_false") {
                const q = question as TrueFalseQuestion;
                htmlContent += `
                    <p><strong>Question:</strong> ${q.question}</p>
                    <p><strong>Correct Answer:</strong> ${q.correct_answer ? "True" : "False"}</p>
                    <p><strong>Explanation:</strong> ${q.explanation}</p>
                `;
            } else if (mapping[type] === "fill_in_the_blank") {
                const q = question as FillInTheBlankQuestion;
                htmlContent += `
                <p><strong>Question:</strong> ${q.question}</p>
                <p><strong>Correct Answer:</strong> ${q.correct_answer}</p>
                <p><strong>Explanation:</strong> ${q.explanation}</p>
                `;
            } else if (mapping[type] === "matching_games") {
                const q = question as MatchingGame;
                htmlContent += `
                    <p><strong>Questions:</strong></p>
                    <ul>
                    ${q.questions.map(qi => `<li>${qi}</li>`).join('')}
                    </ul>
                    <p><strong>Options:</strong></p>
                    <ul>
                    ${q.options.map(opt => `<li>${opt}</li>`).join('')}
                    </ul>
                    <p><strong>Correct Matches:</strong></p>
                    <ul>
                    ${Object.entries(q.correct_match).map(([question, answer]) => 
                        `<li>${question} → ${answer}</li>`).join('')}
                    </ul>
                    <p><strong>Explanation:</strong> ${q.explanation}</p>
                `;
            } else if (mapping[type] === "open_response") {
                const q = question as OpenResponseQuestion;
                htmlContent += `
                    <p><strong>Question:</strong> ${q.question}</p>
                    <p><strong>Sample Answer:</strong> ${q.answer}</p>
                    <p><strong>Follow-up Question:</strong> ${q.follow_up_question}</p>
                `;
            }
            htmlContent += `</div>`;
        });
        htmlContent += `
        </body>
        </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }
};