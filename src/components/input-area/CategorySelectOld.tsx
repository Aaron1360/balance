import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}

// const categories = [
//   "Food",
//   "Services",
//   "Bills",
//   "Transportation",
//   "Entretainment",
//   "Shopping",
//   "Healt & Wellness",
//   "Debt Repayment",
//   "Savings",
//   "Miscellaneous",
// ];



export default function CategorySelect({
  value,
  onChange,
  categories
}: CategorySelectProps) {
  
  return (
    <div className="grid items-center gap-1.5">
      <Select value={value} onValueChange={(value) => onChange(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a category" />
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
