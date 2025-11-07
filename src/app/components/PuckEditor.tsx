import { Puck } from "@measured/puck";
import type { Config, Data } from "@measured/puck";
import { title } from "process";
import React from "react";
import SEOAnalyzerModal from "./SEOAnalyzerModal";
import { useState, useEffect } from "react";

interface PuckEditorProps {
  config: Config;
  data: Data;
  metadata?: {
    title: string;
    author: string;
    category: string;
    subcategory?: string;
    thumbnail_url?: string;
  };
  onPublish: (data: Data) => void;
  onChange: (data: Data) => void;
}

export function PuckEditor({
  config,
  data,
  metadata: metadataProp,
  onPublish,
  onChange,
}: PuckEditorProps) {
  const [showSEO, setShowSEO] = useState(false);
  const [metadata, setMetadata] = useState(metadataProp);

    useEffect(() => {
    if (!metadataProp && typeof window !== "undefined") {
      const stored = sessionStorage.getItem("articleMetadata");
      if (stored) {
        try {
          setMetadata(JSON.parse(stored));
        } catch (err) {
          console.error("Failed to parse stored metadata:", err);
        }
      }
    }
  }, [metadataProp]);

  const extractReadableText = (data: any): string => {
  if (!data) return "";

  let text = "";

  const traverse = (node: any) => {
    if (!node) return;

    if (node.props) {
      const possibleText =
        node.props.content ||
        node.props.text ||
        node.props.children ||
        node.props.value ||
        "";

      if (typeof possibleText === "string") text += possibleText + " ";
    }

    if (Array.isArray(node.content)) node.content.forEach(traverse);
    if (Array.isArray(node.blocks)) node.blocks.forEach(traverse);
    if (Array.isArray(node.children)) node.children.forEach(traverse);
  };

  traverse(data);
  return text.trim();
};

const extractFirstParagraph = (text: string): string => {
  if (!text) return "";

  // Split into potential paragraphs — double newlines, or two spaces after punctuation.
  const paragraphs = text
    .split(/\n\s*\n|(?<=[.?!])\s{2,}/)
    .map((p) => p.trim())
    .filter(Boolean); // remove empty strings

  // Filter out headings, short intros, and metadata-like lines
  const meaningfulParagraphs = paragraphs.filter(
    (p) =>
      p.length > 40 && // skip short one-liners
      !/^#{1,6}\s/.test(p) && // skip markdown headings
      !/^by\s/i.test(p) && // skip author lines
      !/^(introduction|summary|about)\b/i.test(p) // skip common non-content headers
  );

  const first = meaningfulParagraphs[0] || paragraphs[0] || "";

  // Truncate if longer than 160 chars
  return first.length > 160 ? first.slice(0, 157).trim() + "..." : first;
};


  return (
    <div className="flex-1 overflow-y-hidden">
      <Puck
        config={config}
        data={data}
        onPublish={onPublish}
        onChange={onChange}
        overrides={{
          header: ({ actions, children, }) => (
            <>
              {children}
              <div></div>
            </>
          ),
          headerActions: () => (
            <>
            {/* TODO: Logic for SEO and Preview buttons */}
              <button
                onClick={() => setShowSEO(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                SEO
              </button>
              <button
                onClick={ console.log }
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Preview
              </button>
              <button
                onClick={() => onPublish(data)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Create
              </button>
            </>
          ),
        }}
      />

    <SEOAnalyzerModal
      open={showSEO}
      onClose={() => setShowSEO(false)}
      title={metadata?.title || ""}
      metaDescription={extractFirstParagraph(extractReadableText(data))}
      content={extractReadableText(data)} 
    />

    </div>
  );
}