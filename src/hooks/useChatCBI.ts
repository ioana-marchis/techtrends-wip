/**
 * React Hook for CB Insights ChatCBI
 */

import { useState } from "react";
import { chatCBI } from "@/lib/cbinsights";

interface UseChatCBIResult {
  answer: string | null;
  citations: Array<{
    title: string;
    url: string;
    snippet: string;
  }> | null;
  isLoading: boolean;
  error: string | null;
  askQuestion: (question: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook to interact with CB Insights ChatCBI
 * 
 * @example
 * ```tsx
 * const { answer, citations, isLoading, error, askQuestion } = useChatCBI();
 * 
 * const handleSubmit = () => {
 *   askQuestion("What are emerging AI trends?");
 * };
 * ```
 */
export function useChatCBI(): UseChatCBIResult {
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<Array<{
    title: string;
    url: string;
    snippet: string;
  }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = async (question: string) => {
    if (!question.trim()) {
      setError("Question cannot be empty");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswer(null);
    setCitations(null);

    try {
      const response = await chatCBI(question);
      console.log("[useChatCBI] Response received:", response);

      if (response.status === "success") {
        console.log("[useChatCBI] Answer:", response.answer);
        console.log("[useChatCBI] Citations:", response.citations);
        setAnswer(response.answer || null);
        setCitations(response.citations || null);
      } else {
        console.error("[useChatCBI] Error response:", response);
        setError(response.msg || "Failed to get response from ChatCBI");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setAnswer(null);
    setCitations(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    answer,
    citations,
    isLoading,
    error,
    askQuestion,
    reset,
  };
}
