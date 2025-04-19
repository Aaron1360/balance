import type React from "react"
import { useState } from "react"
import { Search, Filter, X, Check, SortAsc, SortDesc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { DebtFilter } from "@/types/debt"

interface DebtFiltersProps {
  filter: DebtFilter
  onFilterChange: (filter: DebtFilter) => void
  totalCount: number
  filteredCount: number
}

export function DebtFilters({ filter, onFilterChange, totalCount, filteredCount }: DebtFiltersProps) {
  const [searchValue, setSearchValue] = useState(filter.search)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleSearchSubmit = () => {
    onFilterChange({ ...filter, search: searchValue })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  const toggleCategory = (category: string) => {
    const newCategories = filter.categories.includes(category)
      ? filter.categories.filter((c) => c !== category)
      : [...filter.categories, category]

    onFilterChange({ ...filter, categories: newCategories })
  }

  const toggleType = (type: string) => {
    const newTypes = filter.types.includes(type) ? filter.types.filter((t) => t !== type) : [...filter.types, type]

    onFilterChange({ ...filter, types: newTypes })
  }

  const toggleStatus = (status: string) => {
    const newStatus = filter.status.includes(status)
      ? filter.status.filter((s) => s !== status)
      : [...filter.status, status]

    onFilterChange({ ...filter, status: newStatus })
  }

  const setSortBy = (sortBy: string) => {
    onFilterChange({ ...filter, sortBy })
  }

  const toggleSortDirection = () => {
    const newDirection = filter.sortDirection === "asc" ? "desc" : "asc"
    onFilterChange({ ...filter, sortDirection: newDirection })
  }

  const resetFilters = () => {
    onFilterChange({
      categories: [],
      types: [],
      status: [],
      search: "",
      sortBy: "paymentDueDay",
      sortDirection: "asc",
    })
    setSearchValue("")
  }

  const getActiveFiltersCount = () => {
    return filter.categories.length + filter.types.length + filter.status.length + (filter.search ? 1 : 0)
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar deudas..."
          className="pl-8 pr-10"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => {
              setSearchValue("")
              if (filter.search) {
                onFilterChange({ ...filter, search: "" })
              }
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              Filtrar
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtros</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">Categoría</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filter.categories.includes("Préstamos")}
                onCheckedChange={() => toggleCategory("Préstamos")}
              >
                Préstamos
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.categories.includes("Tarjetas de Crédito")}
                onCheckedChange={() => toggleCategory("Tarjetas de Crédito")}
              >
                Tarjetas de Crédito
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.categories.includes("Servicios")}
                onCheckedChange={() => toggleCategory("Servicios")}
              >
                Servicios
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">Tipo</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filter.types.includes("préstamo")}
                onCheckedChange={() => toggleType("préstamo")}
              >
                Préstamos
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.types.includes("tarjeta")}
                onCheckedChange={() => toggleType("tarjeta")}
              >
                Tarjetas
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.types.includes("servicio")}
                onCheckedChange={() => toggleType("servicio")}
              >
                Servicios
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.types.includes("otro")}
                onCheckedChange={() => toggleType("otro")}
              >
                Otros
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">Estado</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filter.status.includes("pagado")}
                onCheckedChange={() => toggleStatus("pagado")}
              >
                Pagado
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.status.includes("próximo")}
                onCheckedChange={() => toggleStatus("próximo")}
              >
                Próximo
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.status.includes("pendiente")}
                onCheckedChange={() => toggleStatus("pendiente")}
              >
                Pendiente
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.status.includes("vencido")}
                onCheckedChange={() => toggleStatus("vencido")}
              >
                Vencido
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {activeFiltersCount > 0 && (
              <DropdownMenuItem onClick={resetFilters}>
                <X className="mr-2 h-4 w-4" />
                <span>Limpiar filtros</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              {filter.sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              Ordenar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("paymentDueDay")}>
              {filter.sortBy === "paymentDueDay" && <Check className="mr-2 h-4 w-4" />}
              Fecha de vencimiento
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("remainingAmount")}>
              {filter.sortBy === "remainingAmount" && <Check className="mr-2 h-4 w-4" />}
              Monto pendiente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("interestRate")}>
              {filter.sortBy === "interestRate" && <Check className="mr-2 h-4 w-4" />}
              Tasa de interés
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name")}>
              {filter.sortBy === "name" && <Check className="mr-2 h-4 w-4" />}
              Nombre
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleSortDirection}>
              {filter.sortDirection === "asc" ? (
                <>
                  <SortAsc className="mr-2 h-4 w-4" />
                  Ascendente
                </>
              ) : (
                <>
                  <SortDesc className="mr-2 h-4 w-4" />
                  Descendente
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredCount < totalCount && (
        <Badge variant="secondary" className="ml-auto self-center">
          Mostrando {filteredCount} de {totalCount} deudas
        </Badge>
      )}
    </div>
  )
}
