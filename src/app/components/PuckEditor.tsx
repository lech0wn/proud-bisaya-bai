import { Puck } from "@measured/puck";
import type { Config, Data } from "@measured/puck";
import React from "react";

interface PuckEditorProps {
  config: Config;
  data: Data;
  onPublish: (data: Data) => void;
  onChange: (data: Data) => void;
}

export function PuckEditor({
  config,
  data,
  onPublish,
  onChange,
}: PuckEditorProps) {
  return (
    <div className="flex-1 overflow-y-hidden">
      <Puck
        config={config}
        data={data}
        onPublish={onPublish}
        onChange={onChange}
        overrides={{
          header: ({ actions, children }) => (
            <>
              {children}
              <div></div>
            </>
          ),
          headerActions: () => (
            <>
            {/* TODO: Logic for SEO and Preview buttons */}
              <button
                onClick={ console.log }
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
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
    </div>
  );
}