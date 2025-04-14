import { Label } from "./ui/label"

function Header() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      {/* <div className="outline-2 px-6 py-1 rounded-md outline-black"> */}
        <Label className="text-2xl">Balance</Label>
      {/* </div> */}
    </div>
  )
}

export default Header
