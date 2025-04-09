import { FillInTheBlankQuestion, OpenResponseQuestion } from "@/schemas/definitions";
import dotenv from "dotenv";
dotenv.config();

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

if (!API_ENDPOINT) {
  console.error("API_ENDPOINT is not defined. Check your .env file.");
}

export const fetchData = (pdfFile: File, selectedQuizzes: string[]) => {
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("quizzes", JSON.stringify(selectedQuizzes));
  
    return fetch(`${API_ENDPOINT}read-pdf`, {
      method: "POST",
      body: formData,
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // Re-throw the error for the calling function to handle
    });
};


export const checkOpenResponse = (quizElt: OpenResponseQuestion, student_res: string) => {
    const formData = new FormData();
    formData.append("question", JSON.stringify(quizElt));
    formData.append("student_response", student_res)

    return fetch(`${API_ENDPOINT}check-open-response`, {
        method: "POST",
        body: formData,
    }).then((res) => {
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        console.log(res)
        return res.json();
    }).then((data) => {
        console.log(data)
        return data
    }).catch((error) => {
        console.error("Error:", error)
        throw error;
    });
};