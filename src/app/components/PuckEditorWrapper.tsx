'use client';
import { Puck, type Config, type Data } from '@measured/puck';

export default function PuckEditorWrapper({
  config,
  data,
  onPublish,
}: {
  config: Config;
  data: Data;
  onPublish: (data: Data) => void;
}) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow border p-4">
        <Puck
          config={config}
          data={data}
          onPublish={onPublish}
        />
      </div>
    </div>
  );
}
