import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

// Define the arguments type for the DatePicker component
interface DatePickerProps {
  id: string,
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

// DatePicker Component
export default function DatePicker({ id, date, setDate }: DatePickerProps) {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "col-span-3 justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            formatDate(date, "PPP") 
          ) : (
            <span>Selecciona una fecha</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          initialFocus
          selected={date}
          onSelect={setDate}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}
