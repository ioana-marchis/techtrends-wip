/**
 * CB Insights Debug Component
 * Helps troubleshoot API connection issues
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function CBInsightsDebug() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    envVars: boolean;
    clientId: string;
    clientSecret: string;
    authTest: { success: boolean; message: string } | null;
  }>({
    envVars: false,
    clientId: "",
    clientSecret: "",
    authTest: null,
  });

  const runDiagnostics = async () => {
    setTesting(true);

    const proxyUrl = import.meta.env.VITE_PROXY_URL || "http://localhost:3001";

    const newResults = {
      envVars: true, // Not needed for proxy mode
      clientId: "Using proxy server",
      clientSecret: "Using proxy server",
      authTest: null as { success: boolean; message: string } | null,
    };

    // Test proxy server connection
    try {
      console.log("[Debug] Testing proxy server at:", proxyUrl);
      
      // First check if proxy is running
      const healthResponse = await fetch(`${proxyUrl}/health`);
      
      if (!healthResponse.ok) {
        newResults.authTest = {
          success: false,
          message: `✗ Proxy server not responding (${healthResponse.status})`,
        };
      } else {
        // Try a simple test question
        const testResponse = await fetch(`${proxyUrl}/api/chatcbi`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "test",
          }),
        });

        if (testResponse.ok) {
          newResults.authTest = {
            success: true,
            message: `✓ Proxy server working! CB Insights API connected successfully.`,
          };
        } else {
          const errorText = await testResponse.text();
          newResults.authTest = {
            success: false,
            message: `✗ Proxy error (${testResponse.status}): ${errorText}`,
          };
        }
      }
    } catch (error) {
      newResults.authTest = {
        success: false,
        message: `✗ Cannot connect to proxy server at ${proxyUrl}. Make sure it's running: npm run proxy`,
      };
    }

    setResults(newResults);
    setTesting(false);
  };

  return (
    <Card className="border-2 border-yellow-500">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-yellow-600">
          🔧 CB Insights Debug Panel (Proxy Mode)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Using proxy server to avoid CORS issues
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostics} disabled={testing} className="w-full">
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            "Run Diagnostics"
          )}
        </Button>

        {results.envVars !== undefined && !testing && (
          <div className="space-y-3 text-sm">
            {/* Environment Variables Check */}
            <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded">
              {results.envVars ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">Proxy Server Status</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Server: {results.clientId}
                </p>
                <p className="text-xs text-muted-foreground">
                  Credentials: {results.clientSecret}
                </p>
                {!results.envVars && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ Proxy server not running!
                  </p>
                )}
              </div>
            </div>

            {/* Authentication Test */}
            {results.authTest && (
              <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded">
                {results.authTest.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">API Authentication</p>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
                    {results.authTest.message}
                  </p>
                </div>
              </div>
            )}

            {/* Instructions */}
            {!results.envVars && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded text-xs">
                <p className="font-semibold mb-2">How to start proxy server:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Open a new terminal</li>
                  <li>Run: <code className="bg-secondary px-1 rounded">npm run proxy</code></li>
                  <li>Keep it running while using CB Insights</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
