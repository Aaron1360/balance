import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Filter, Search, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FilterPanelProps {
  isOpen: boolean
  onToggle: () => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  startDate: Date | undefined
  setStartDate: (date: Date | undefined) => void
  endDate: Date | undefined
  setEndDate: (date: Date | undefined) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  selectedPaymentMethods: string[]
  setSelectedPaymentMethods: React.Dispatch<React.SetStateAction<string[]>>//(methods: string[]) => void
  selectedTypes: string[]
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>//(types: string[]) => void
  selectedPaymentType: string | null
  setSelectedPaymentType: (type: string | null) => void
  showPaymentTypeFilter: boolean
  categories: string[]
  paymentMethods: string[]
  filteredCount: number
  resetFilters: () => void
}

export function FilterPanel({
  isOpen,
  onToggle,
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedCategories,
  setSelectedCategories,
  selectedPaymentMethods,
  setSelectedPaymentMethods,
  selectedTypes,
  setSelectedTypes,
  selectedPaymentType,
  setSelectedPaymentType,
  showPaymentTypeFilter,
  categories,
  paymentMethods,
  filteredCount,
  resetFilters,
}: FilterPanelProps) {
  // Función para manejar el cambio en las categorías seleccionadas
  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setSelectedCategories([])
    } else {
      setSelectedCategories([value])
    }
  }

  // Función para manejar el cambio en los métodos de pago seleccionados
  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethods((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]))
  }

  // Función para manejar el cambio en los tipos seleccionados
  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  return (
    <div className={`${isOpen ? "w-full md:w-64" : "w-auto"} flex-shrink-0 transition-all duration-300 ease-in-out`}>
      <Card className={`${!isOpen && "border-0 bg-transparent shadow-none"}`}>
        {isOpen ? (
          <>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle>Filtros</CardTitle>
              <Button variant="ghost" size="icon" onClick={onToggle}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Búsqueda */}
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="search"
                    placeholder="Buscar transacciones..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Rango de fechas */}
              <div className="space-y-2">
                <Label>Rango de fechas</Label>
                <div className="flex flex-col gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Fecha inicial"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus locale={es} />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy") : "Fecha final"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus locale={es} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Tipo de transacción */}
              <div className="space-y-2">
                <Label>Tipo</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type-income"
                      checked={selectedTypes.includes("income")}
                      onCheckedChange={() => handleTypeChange("income")}
                    />
                    <label
                      htmlFor="type-income"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ingresos
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type-expense"
                      checked={selectedTypes.includes("expense")}
                      onCheckedChange={() => handleTypeChange("expense")}
                    />
                    <label
                      htmlFor="type-expense"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Gastos
                    </label>
                  </div>
                </div>
              </div>

              {/* Categorías */}
              <div className="space-y-2">
                <Label>Categorías</Label>
                <Select
                  onValueChange={handleCategoryChange}
                  value={selectedCategories.length > 0 ? selectedCategories[0] : "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de pago (condicional) */}
              {showPaymentTypeFilter && (
                <div className="space-y-2">
                  <Label>Tipo de pago</Label>
                  <RadioGroup
                    value={selectedPaymentType || ""}
                    onValueChange={(value) => setSelectedPaymentType(value === "" ? null : value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="payment-type-all" />
                      <Label htmlFor="payment-type-all" className="font-normal">
                        Todos
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unica" id="payment-type-unica" />
                      <Label htmlFor="payment-type-unica" className="font-normal">
                        Única exhibición
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="diferido" id="payment-type-diferido" />
                      <Label htmlFor="payment-type-diferido" className="font-normal">
                        Pago diferido
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Métodos de pago */}
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {paymentMethods.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={`method-${method}`}
                        checked={selectedPaymentMethods.includes(method)}
                        onCheckedChange={() => handlePaymentMethodChange(method)}
                      />
                      <label
                        htmlFor={`method-${method}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {method}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" onClick={resetFilters}>
                  Limpiar filtros
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={onToggle} title="Mostrar filtros">
              <Filter className="h-4 w-4" />
            </Button>
            <Badge variant="outline">{filteredCount} resultados</Badge>
          </div>
        )}
      </Card>
    </div>
  )
}
