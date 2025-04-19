import type React from "react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { SavingsProject } from "@/types/savings"

interface EditProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: SavingsProject
}

export function EditProjectDialog({ open, onOpenChange, project }: EditProjectDialogProps) {
  const [name, setName] = useState(project.name)
  const [targetAmount, setTargetAmount] = useState(project.targetAmount.toString())
  const [currentAmount, setCurrentAmount] = useState(project.currentAmount.toString())
  const [category, setCategory] = useState(project.category)
  const [deadline, setDeadline] = useState<Date | undefined>(project.deadline)
  const [note, setNote] = useState(project.note || "")

  // Update form when project changes
  useEffect(() => {
    setName(project.name)
    setTargetAmount(project.targetAmount.toString())
    setCurrentAmount(project.currentAmount.toString())
    setCategory(project.category)
    setDeadline(project.deadline)
    setNote(project.note || "")
  }, [project])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would update the project in your data
    console.log({
      id: project.id,
      name,
      targetAmount: Number.parseFloat(targetAmount),
      currentAmount: Number.parseFloat(currentAmount),
      category,
      deadline,
      note,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Proyecto de Ahorro</DialogTitle>
          <DialogDescription>Modifica los detalles de tu proyecto de ahorro.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-target" className="text-right">
                Meta
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="edit-target"
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="pl-7"
                  min="1"
                  step="100"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-current" className="text-right">
                Actual
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="edit-current"
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="pl-7"
                  min="0"
                  step="100"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Categoría
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="edit-category" className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viajes">Viajes</SelectItem>
                  <SelectItem value="Seguridad">Seguridad</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                  <SelectItem value="Desarrollo Personal">Desarrollo Personal</SelectItem>
                  <SelectItem value="Hogar">Hogar</SelectItem>
                  <SelectItem value="Tecnología">Tecnología</SelectItem>
                  <SelectItem value="Salud">Salud</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-deadline" className="text-right">
                Fecha Límite
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-deadline"
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !deadline && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    locale={es}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-note" className="text-right pt-2">
                Nota
              </Label>
              <Textarea
                id="edit-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="col-span-3"
                rows={3}
                placeholder="Añade una nota sobre este proyecto de ahorro"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
