import { Filter, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLayoutContext } from "@/context/LayoutContext";

interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedPaymentMethods: string[];
  setSelectedPaymentMethods: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPaymentType: string | null;
  setSelectedPaymentType: (type: string | null) => void;
  categories: string[];
  paymentMethods: string[];
  filteredCount: number;
  resetFilters: () => void;
}

export function FilterPanel({
  isOpen,
  onToggle,
  searchTerm,
  setSearchTerm,
  selectedCategories,
  setSelectedCategories,
  selectedPaymentMethods,
  setSelectedPaymentMethods,
  selectedTypes,
  setSelectedTypes,
  selectedPaymentType,
  setSelectedPaymentType,
  categories,
  paymentMethods,
  filteredCount,
  resetFilters,
}: FilterPanelProps) {
  const { periods, selectedPeriod, setSelectedPeriod } = useLayoutContext();

  // Function to handle changes in selected categories
  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([value]);
    }
  };

  // Function to handle changes in selected payment methods
  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  return (
    <div
      className={`${
        isOpen ? "w-full md:w-64" : "w-auto"
      } flex-shrink-0 transition-all duration-300 ease-in-out`}
    >
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
              {/* Search */}
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

              {/* Period */}
              <div className="space-y-2">
                <Label>Periodo</Label>
                <Select
                  onValueChange={(value) => setSelectedPeriod(value)}
                  value={selectedPeriod || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transaction type */}
              <div className="space-y-2">
                <Label>Tipo</Label>
                <RadioGroup
                  value={selectedTypes[0] || "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setSelectedTypes([]);
                    } else {
                      setSelectedTypes([value]);
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="type-all" />
                    <Label htmlFor="type-all" className="font-normal">
                      Todos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="income" id="type-income" />
                    <Label htmlFor="type-income" className="font-normal">
                      Ingresos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expense" id="type-expense" />
                    <Label htmlFor="type-expense" className="font-normal">
                      Gastos
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label>Categorías</Label>
                <Select
                  onValueChange={handleCategoryChange}
                  value={
                    selectedCategories.length > 0
                      ? selectedCategories[0]
                      : "all"
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category || "unknown"}>
                        {category || "Sin categoría"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment type */}
              <div className="space-y-2">
                <Label>Tipo de pago</Label>
                <RadioGroup
                  value={selectedPaymentType || ""}
                  onValueChange={(value) =>
                    setSelectedPaymentType(value === "" ? null : value)
                  }
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
                    <RadioGroupItem
                      value="diferido"
                      id="payment-type-diferido"
                    />
                    <Label
                      htmlFor="payment-type-diferido"
                      className="font-normal"
                    >
                      Pago diferido
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment methods */}
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {paymentMethods.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={`method-${method}`}
                        checked={selectedPaymentMethods.includes(method)}
                        onCheckedChange={() =>
                          handlePaymentMethodChange(method)
                        }
                      />
                      <Label
                        htmlFor={`method-${method}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" onClick={resetFilters}>
                  Limpiar filtros
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={onToggle}
              title="Mostrar filtros"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Badge variant="outline">{filteredCount} resultados</Badge>
          </div>
        )}
      </Card>
    </div>
  );
}
