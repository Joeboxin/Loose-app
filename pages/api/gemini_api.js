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
    - Income: ${financialData.income || "Not provided"} ${financialData.currency || "USD"}
    - Savings: ${financialData.savings || 0} ${financialData.currency || "USD"}
    - Debt: ${financialData.debt || 0} ${financialData.currency || "USD"}
    - Key Expenses: Rent ${financialData.expenses?.rent || "N/A"}, Groceries ${financialData.expenses?.groceries || "N/A"}
    
    User's Question:
    "${userPrompt}"
    
    Provide a **short, actionable** financial recommendation (max 3-4 sentences). 
    Prioritize **budgeting, debt repayment, and savings growth**. Use **concise bullet points** if necessary.
    `;
    

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error fetching response:", error);
  }
}

// Example user data
const user = { name: "John Doe", uid: "user123" };
const financialData = {
  income: 5000,
  expenses: { rent: 1200, groceries: 500, entertainment: 200 },
  savings: 10000,
  debt: 2000,
  currency: "USD"
};

// Example user prompt
const userPrompt = "How can I save more money while paying off my debt?";

// Call the function
generateFinancialAdvice(user, financialData, userPrompt);
