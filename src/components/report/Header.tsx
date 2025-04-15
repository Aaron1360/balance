import { Label } from "../ui/label";
import CurrentDate from "./current-date";
import { data } from "@/components/app-sidebar/AppSidebar"

function Header() {
  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <Label  className="text-md">Bienvenido {data.user.name}</Label>
        <Label className="text-xs">Invierte tu dinero sabiamente.</Label>
      </div>
      <CurrentDate></CurrentDate>
    </div>
  );
}

export default Header;
