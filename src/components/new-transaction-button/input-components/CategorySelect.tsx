import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  interface CategorySelectProps {
    id: string,
    value: string;
    onChange: (value: string) => void;
    categories: string[];
  }
  
  export default function CategorySelect({
    id,
    value,
    onChange,
    categories
  }: CategorySelectProps) {
    
    return (
      <div className="grid items-center gap-1.5">
        <Select value={value} onValueChange={(value) => onChange(value)}>
          <SelectTrigger id={id} className="w-[180px]">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories.map((category, index) => (
                <SelectItem key={index} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }
  