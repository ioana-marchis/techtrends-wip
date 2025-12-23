/**
 * CB Insights API Client (Proxy Mode)
 * Uses local proxy server to avoid CORS issues
 */

// Use local proxy server to avoid CORS
const PROXY_BASE = import.meta.env.VITE_PROXY_URL || "http://localhost:3001";
const IS_PRODUCTION = import.meta.env.PROD;
const PROXY_AVAILABLE = !IS_PRODUCTION || !!import.meta.env.VITE_PROXY_URL;

interface ChatCBIResponse {
  status: "success" | "error";
  message?: string;  // CB Insights uses 'message' not 'answer'
  answer?: string;   // Keep for compatibility
  sources?: Array<{  // CB Insights uses 'sources' not 'citations'
    title: string;
    url: string;
    snippet?: string;
  }>;
  citations?: Array<{  // Keep for compatibility
    title: string;
    url: string;
    snippet: string;
  }>;
  suggestions?: string[];
  relatedContent?: Array<{
    title: string;
    url: string;
    thumbnailUrl?: string;
    date?: string;
  }>;
  code?: number;
  msg?: string;
}

/**
 * Send a user question to ChatCBI and get an answer with citations
 * @param question - The question to ask ChatCBI
 * @returns Response object with status, answer, and citations
 */
export async function chatCBI(question: string): Promise<ChatCBIResponse> {
  console.log("[CBI] Sending question to proxy:", question);
  
  // Check if proxy is available
  if (!PROXY_AVAILABLE) {
    console.warn("[CBI] Proxy not available in production without VITE_PROXY_URL");
    return {
      status: "error",
      code: 503,
      msg: "CB Insights integration requires a proxy server. This feature is only available in local development or when deployed with a backend proxy.",
    };
  }
  
  try {
    const response = await fetch(`${PROXY_BASE}/api/chatcbi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: question,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[CBI] Proxy request failed:", response.status, errorText);
      return {
        status: "error",
        code: response.status,
        msg: `Request failed (${response.status}): ${errorText}`,
      };
    }

    const data = await response.json();
    console.log("[CBI] Response received from proxy ✓");
    console.log("[CBI] Response data:", data);
    
    // Normalize the response - CB Insights uses 'message' and 'sources'
    return {
      status: "success",
      answer: data.message || data.answer,  // Use 'message' field from CB Insights
      citations: data.sources || data.citations,  // Use 'sources' field from CB Insights
      suggestions: data.suggestions,
      relatedContent: data.relatedContent,
    };
  } catch (error) {
    console.error("[CBI] Proxy error:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        status: "error",
        code: 500,
        msg: "Cannot connect to proxy server. Make sure it's running on http://localhost:3001",
      };
    }
    
    return {
      status: "error",
      code: 500,
      msg: errorMsg,
    };
  }
}

/**
 * Example usage:
 * 
 * import { chatCBI } from "@/lib/cbinsights";
 * 
 * const response = await chatCBI("What are the latest AI trends in fintech?");
 * if (response.status === "success") {
 *   console.log(response.answer);
 *   console.log(response.citations);
 * }
 */
