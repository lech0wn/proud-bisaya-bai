import React, { useState } from "react";

interface SEOAnalyzerModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  metaDescription?: string;
  content?: string;
}

export default function SEOAnalyzerModal({
  open,
  onClose,
  title = "",
  metaDescription = "",
  content = "",
}: SEOAnalyzerModalProps) {
  const [result, setResult] = useState<any>(null);

  const detectKeyword = (text: string) => {
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g);
    if (!words) return null;
    const freq: Record<string, number> = {};
    words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || null;
  };

  const analyzeSEO = () => {
    const issues: string[] = [];
    let score = 0;

    const keyword = detectKeyword(content || "");
    if (!keyword) issues.push("No keyword found.");
    else score += 5;

    if (title.length >= 50 && title.length <= 60) score += 10;
    else issues.push("Title length not optimal (50–60 chars).");

    if (metaDescription.length >= 120 && metaDescription.length <= 160)
      score += 10;
    else issues.push("Meta description length not optimal (120–160 chars).");

    if (content.length > 300) score += 15;
    else issues.push("Content too short (<300 words).");

    const seoScore = Math.round((score / 40) * 100);
    const summary =
      seoScore >= 80
        ? "Excellent SEO ✅"
        : seoScore >= 60
        ? "Good SEO ⚠️"
        : "Needs Improvement ❌";

    setResult({ keyword, seoScore, summary, issues });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">SEO Analysis</h2>

        {!result ? (
          <button
            onClick={analyzeSEO}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Run Analysis
          </button>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-gray-700">
                Keyword:{" "}
                <span className="font-semibold text-blue-600">
                  {result.keyword || "N/A"}
                </span>
              </p>
              <p
                className={`font-bold ${
                  result.seoScore >= 80
                    ? "text-green-600"
                    : result.seoScore >= 60
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {result.seoScore}%
              </p>
            </div>
            <p className="mb-2">{result.summary}</p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 max-h-40 overflow-y-auto">
              {result.issues.map((issue: string, i: number) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
