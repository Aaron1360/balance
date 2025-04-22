import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface DisplayTagsProps {
    value: string[];
    onChange: (value: string) => void
}

export default function DisplayTags({ value, onChange }: DisplayTagsProps) {
  return (
    <>
      {value.length > 0 && (
        <div className="grid grid-cols-8 items-start gap-2">
          <div className="col-span-1"></div>
          <div className="col-span-7 flex flex-wrap gap-2">
            {value.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onChange(tag)}
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

