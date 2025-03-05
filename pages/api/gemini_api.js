const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateFinancialAdvice(user, financialData, userPrompt) {
  try {
    if (!user || !financialData || !userPrompt) {
      console.log("Missing user data, financial data, or prompt.");
      return;
    }

    const prompt = `
    User Profile:
    - Name: ${user.name || "Unknown"}
    - Expenses, Salary, and Debt: ${financialData || "N/A"}}
    
    User's Question:
    "${userPrompt}"
    
    Provide a **short, actionable** financial recommendation (max 3-4 sentences). 
    Prioritize **budgeting, debt repayment, and savings growth**. Use **concise bullet points** if necessary.
    `;
    
    const result = await model.generateContent(prompt);
    
    // Log the entire result object to check its structure
    console.log(result);

    // If the result contains the response text, log it
    if (result?.response?.text) {
      console.log(result.response.text);
    } else {
      console.log("No response text found in the result.");
    }

    return result?.response?.text;  // Returning the result for use elsewhere
  } catch (error) {
    console.error("Error fetching response:", error);
  }
}

export default generateFinancialAdvice;