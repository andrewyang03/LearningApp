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