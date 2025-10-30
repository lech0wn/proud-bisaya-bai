import { Puck } from "@measured/puck";
import type { Config, Data } from "@measured/puck";
import { title } from "process";
import React from "react";
import SEOAnalyzerModal from "./SEOAnalyzerModal";
import { useState } from "react";

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
  metadata,
  onPublish,
  onChange,
}: PuckEditorProps) {
  const [showSEO, setShowSEO] = useState(false);

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
      metaDescription={metadata?.category || ""}
      content={extractReadableText(data)} 
    />

    </div>
  );
}