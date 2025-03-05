import { useState } from "react";
import styled from "styled-components";
import { GoogleGenerativeAI } from "@google/generative-ai";
import generateFinancialAdvice from "@/pages/api/gemini_api";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const ChatContainer = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ChatBox = styled.div`
  height: 250px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 8px;
  margin-bottom: 8px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const Message = styled.div`
  padding: 8px;
  margin: 4px 0;
  border-radius: 8px;
  background: ${(props) => (props.role === "user" ? "#cce5ff" : "#d4edda")};
  text-align: ${(props) => (props.role === "user" ? "right" : "left")};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  background: ${(props) => (props.disabled ? "#ccc" : "#007bff")};
  color: white;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export default function FinanceChat({ financialData, currency }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
  
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
  
    try {
      const user = { name: "User" }; // You can replace this with actual user data from context if needed
  
      // Call `generateFinancialAdvice` with financial data
      const result = await generateFinancialAdvice(user, financialData, input);
  
      if (result) {
        const aiMessage = { role: "ai", content: result };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  
    setInput("");
    setLoading(false);
  };

  return (
    <ChatContainer>
      <Title>Financial Advice Chat</Title>
      <ChatBox>
  {messages.map((msg, index) => {
    // Ensure msg.content is a string or valid JSX
    const content = typeof msg.content === "function" ? msg.content() : msg.content;
    return (
      <Message key={index} role={msg.role}>
        {content || "No content"}
      </Message>
    );
  })}
</ChatBox>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a financial question..."
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </Button>
      </InputContainer>
    </ChatContainer>
  );
}
