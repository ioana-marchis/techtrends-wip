/**
 * Compact CB Insights ChatCBI Component
 * Optimized for sidebar display
 */

import { useState } from "react";
import { useChatCBI } from "@/hooks/useChatCBI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Sparkles, ExternalLink, X } from "lucide-react";

export default function CBInsightsWidget() {
  const [question, setQuestion] = useState("");
  const { answer, citations, isLoading, error, askQuestion, reset } = useChatCBI();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      console.log("[CBInsightsWidget] Submitting question:", question);
      askQuestion(question);
      setIsExpanded(true);
    }
  };

  const handleQuickQuestion = (q: string) => {
    console.log("[CBInsightsWidget] Quick question:", q);
    setQuestion(q);
    askQuestion(q);
    setIsExpanded(true);
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-bold">CB Insights AI</CardTitle>
        </div>
        {answer && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset();
              setIsExpanded(false);
            }}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Question Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Ask about trends..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
            className="text-sm h-9"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !question.trim()}
            size="sm"
            className="h-9 w-9 p-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        {/* Quick Questions */}
        {!answer && !isLoading && !isExpanded && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Quick questions:</p>
            <div className="space-y-1">
              {[
                "AI trends 2025",
                "Top cybersecurity startups",
                "Cloud market leaders",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="ml-2 text-xs text-muted-foreground">
              Querying...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-xs text-destructive bg-destructive/10 rounded p-2">
            {error}
          </div>
        )}

        {/* Answer Display */}
        {answer && (
          <div className="space-y-3">
            <div className="bg-secondary/50 rounded-lg p-3 max-h-48 overflow-y-auto">
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
            </div>

            {/* Debug info - remove after testing */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-[10px] text-muted-foreground border border-dashed border-muted p-2 rounded">
                Answer length: {answer?.length || 0} | 
                Citations: {citations?.length || 0}
              </div>
            )}

            {/* Citations */}
            {citations && citations.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">Sources:</p>
                <div className="space-y-1">
                  {citations.slice(0, 3).map((citation, index) => (
                    <a
                      key={index}
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 p-2 border border-border rounded hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-primary truncate group-hover:text-primary/80">
                          {citation.title}
                        </p>
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
