"use client";
import React, { useState, useEffect } from "react";

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
    const checks: string[] = [];
    let score = 0;

  let combinedText = content.trim();
  if (!content.startsWith(metaDescription)) {
    combinedText = `${metaDescription} ${content}`.trim();
  }
  const wordCount = combinedText.split(/\s+/).filter(Boolean).length;


    const keyword = detectKeyword(content || "");
    if (!keyword) issues.push("No keyword found.");
    else { score += 5; checks.push(`Keyword detected: "${keyword}"`); }

    if (title.length >= 50 && title.length <= 60) {
      score += 10;
      checks.push(`Title length optimal (${title.length} chars).`);
    } else issues.push("Title length not optimal (50–60 chars).");

    if (metaDescription.length >= 120 && metaDescription.length <= 160) {
      score += 10;
      checks.push(`Meta description optimal (${metaDescription.length} chars).`);
    } else if (metaDescription.length > 0) {
      issues.push(`Meta description not optimal (${metaDescription.length} chars).`);
    } else {
      issues.push("Missing meta description.");
    }


    if (wordCount >= 300) {
      score += 15;
      checks.push(`Content length sufficient (${wordCount} words).`);
    } else issues.push(`Content too short (${wordCount} words, need 300+).`);

    const seoScore = Math.round((score / 40) * 100);
    const summary =
      seoScore >= 80
        ? "Excellent SEO ✅"
        : seoScore >= 60
        ? "Good SEO ⚠️"
        : "Needs Improvement ❌";

    setResult({ keyword, seoScore, summary, issues, checks, wordCount, metaDescription});
  };

  useEffect(() => {
    if (open) analyzeSEO();
  }, [open]);

  if (!open) return null;

  // Determine word count color
  const getWordCountColor = (count: number) => {
    if (count < 300) return "text-red-600";
    if (count < 600) return "text-yellow-600";
    return "text-green-600";
  };

  const getWordCountLabel = (count: number) => {
    if (count < 300) return "Too short";
    if (count < 600) return "Decent length";
    return "Well-optimized";
  };

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
            {/* Header with keyword and score */}
            <div className="justify-between items-right mb-3">
              <p
                className={`font-bold text-lg ${
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

            {/*  SEO score bar */}
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-3">
              <div
                className={`h-3 transition-all duration-500 ${
                  result.seoScore >= 80
                    ? "bg-green-500"
                    : result.seoScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${result.seoScore}%` }}
              ></div>
            </div>

            {/* Summary + Word Count Feedback */}
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-700">{result.summary}</p>
              <p
                className={`font-semibold ${getWordCountColor(
                  result.wordCount
                )}`}
              >
                {result.wordCount} words{" "}
                <span className="text-gray-500 text-sm ml-1">
                  ({getWordCountLabel(result.wordCount)})
                </span>
              </p>
            </div>

            {/* List of Checks */}
            <div className="border-t border-b border-gray-300 py-3 my-3">
              <h3 className="font-semibold mb-2 text-gray-800">Checks:</h3>
              <ul className="list-['✅'] list-inside text-emerald-400 text-sm space-y-1">
                {result.checks && result.checks.length > 0 ? (
                  result.checks.map((c: string, i: number) => <li key={i}>{c}</li>)
                ) : (
                  <li className="text-gray-500">No passed checks yet.</li>
                )}
              </ul>
                {result.metaDescription && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700 mb-1 font-semibold">
                    Meta Description Preview:
                  </p>
                  <p className="text-gray-600 text-sm italic">
                    {result.metaDescription}
                  </p>
                </div>
              )}
              </div>
            {/* List of issues */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-800">Issues:</h3>
            <ul className="list-['❌'] list-inside text-red-600 text-sm space-y-1 max-h-40 overflow-y-auto">
              {result.issues.map((issue: string, i: number) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
