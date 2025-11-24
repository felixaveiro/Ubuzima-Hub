/**
 * Simple test page for NISR AI Chat
 * Navigate to /test-ai to use this page
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAIPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const exampleQueries = [
    "What is the stunting rate in Rwanda?",
    "Show me anemia prevalence data",
    "What surveys has NISR conducted about nutrition?",
    "Breastfeeding practices in Rwanda",
    "Wasting prevalence among children"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/nisr-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() })
      });

      const data = await res.json();
      setResponse(data);
    } catch (error: any) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>NISR AI Chatbot - Test Interface</CardTitle>
          <CardDescription>
            Ask questions about Rwanda's nutrition and health data from NISR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Question
              </label>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., What is the stunting rate in Rwanda?"
                rows={3}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={loading || !query.trim()}>
                {loading ? "Processing..." : "Ask Question"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => { setQuery(""); setResponse(null); }}
              >
                Clear
              </Button>
            </div>
          </form>

          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Example questions:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, idx) => (
                <Button
                  key={idx}
                  variant="secondary"
                  size="sm"
                  onClick={() => setQuery(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {response.error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800 font-semibold">Error:</p>
                <p className="text-red-700">{response.error}</p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Answer:</p>
                  <p className="text-blue-800 whitespace-pre-wrap">{response.answer}</p>
                </div>

                {response.sources && response.sources.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm font-semibold text-green-900 mb-2">Sources:</p>
                    <ul className="list-disc list-inside text-green-800">
                      {response.sources.map((source: any, idx: number) => (
                        <li key={idx}>
                          {source.name} ({source.type})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  <p>Data Used: {response.dataUsed ? "✓ Yes" : "✗ No"}</p>
                  <p>Relevant: {response.isRelevant ? "✓ Yes" : "✗ No"}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
