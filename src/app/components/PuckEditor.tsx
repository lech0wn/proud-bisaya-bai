import { Puck } from "@measured/puck";
import type { Config, Data } from "@measured/puck";

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
    <div className="flex-1 overflow-hidden">
      <Puck
        config={config}
        data={data}
        onPublish={onPublish}
        onChange={onChange}
      />
    </div>
  );
}