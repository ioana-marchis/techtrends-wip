/**
 * CB Insights ChatCBI Component Example
 * Demonstrates how to use the CB Insights API integration
 */

import { useState } from "react";
import { useChatCBI } from "@/hooks/useChatCBI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CBInsightsChat() {
  const [question, setQuestion] = useState("");
  const { answer, citations, isLoading, error, askQuestion, reset } = useChatCBI();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      askQuestion(question);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            CB Insights Market Intelligence
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ask questions about market trends, companies, and technology sectors
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g., What are the latest AI trends in fintech?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !question.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Querying CB Insights...
              </span>
            </div>
          )}

          {/* Answer Display */}
          {answer && (
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Answer:</h3>
                <p className="text-foreground whitespace-pre-wrap">{answer}</p>
              </div>

              {/* Citations */}
              {citations && citations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Sources:</h3>
                  <div className="space-y-2">
                    {citations.map((citation, index) => (
                      <a
                        key={index}
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-primary">
                              {citation.title}
                            </h4>
                            {citation.snippet && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {citation.snippet}
                              </p>
                            )}
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="outline" onClick={reset} className="w-full">
                Ask Another Question
              </Button>
            </div>
          )}

          {/* Example Questions */}
          {!answer && !isLoading && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Try asking about:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Latest trends in generative AI",
                  "Top cybersecurity startups 2025",
                  "Cloud infrastructure market leaders",
                  "Web3 investment trends",
                ].map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuestion(example);
                      askQuestion(example);
                    }}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
