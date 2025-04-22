import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagIcon } from "lucide-react";
import React from "react";

interface TagsProps {
  value: string;
  onChange: (value: React.SetStateAction<string>) => void;
  newTag: () => void;
}
export default function AddTags({ value, onChange, newTag }: TagsProps) {
  return (
    <div className="col-span-7 flex items-center gap-2">
      <Input
        id="etiquetas"
        placeholder="Añadir etiqueta"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            newTag();
          }
        }}
      />
      <Button type="button" size="sm" onClick={newTag}>
        <TagIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
