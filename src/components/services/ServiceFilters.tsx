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

interface ServiceFiltersProps {
  categories: string[]
  statuses: string[]
  onFilterChange: (filters: {
    search: string
    categories: string[]
    statuses: string[]
    sortBy: string
    sortDirection: "asc" | "desc"
  }) => void
  totalCount: number
  filteredCount: number
}

export function ServiceFilters({
  categories,
  statuses,
  onFilterChange,
  totalCount,
  filteredCount,
}: ServiceFiltersProps) {
  const [searchValue, setSearchValue] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("nextPaymentDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleSearchSubmit = () => {
    updateFilters()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
    updateFilters({
      categories: selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category],
    })
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
    updateFilters({
      statuses: selectedStatuses.includes(status)
        ? selectedStatuses.filter((s) => s !== status)
        : [...selectedStatuses, status],
    })
  }

  const handleSortByChange = (value: string) => {
    setSortBy(value)
    updateFilters({ sortBy: value })
  }

  const toggleSortDirection = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc"
    setSortDirection(newDirection)
    updateFilters({ sortDirection: newDirection })
  }

  const resetFilters = () => {
    setSearchValue("")
    setSelectedCategories([])
    setSelectedStatuses([])
    setSortBy("nextPaymentDate")
    setSortDirection("asc")
    onFilterChange({
      search: "",
      categories: [],
      statuses: [],
      sortBy: "nextPaymentDate",
      sortDirection: "asc",
    })
  }

  const updateFilters = (
    overrides: Partial<{
      search: string
      categories: string[]
      statuses: string[]
      sortBy: string
      sortDirection: "asc" | "desc"
    }> = {},
  ) => {
    onFilterChange({
      search: overrides.search !== undefined ? overrides.search : searchValue,
      categories: overrides.categories !== undefined ? overrides.categories : selectedCategories,
      statuses: overrides.statuses !== undefined ? overrides.statuses : selectedStatuses,
      sortBy: overrides.sortBy !== undefined ? overrides.sortBy : sortBy,
      sortDirection: overrides.sortDirection !== undefined ? overrides.sortDirection : sortDirection,
    })
  }

  const getActiveFiltersCount = () => {
    return selectedCategories.length + selectedStatuses.length + (searchValue ? 1 : 0)
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar servicios..."
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
              updateFilters({ search: "" })
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleSearchSubmit}>
          Buscar
        </Button>

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
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">Estado</DropdownMenuLabel>
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                >
                  {status === "active" ? "Activo" : status === "paused" ? "Pausado" : "Cancelado"}
                </DropdownMenuCheckboxItem>
              ))}
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
              {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              Ordenar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSortByChange("name")}>
              {sortBy === "name" && <Check className="mr-2 h-4 w-4" />}
              Nombre
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortByChange("cost")}>
              {sortBy === "cost" && <Check className="mr-2 h-4 w-4" />}
              Costo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortByChange("nextPaymentDate")}>
              {sortBy === "nextPaymentDate" && <Check className="mr-2 h-4 w-4" />}
              Fecha de pago
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortByChange("category")}>
              {sortBy === "category" && <Check className="mr-2 h-4 w-4" />}
              Categoría
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleSortDirection}>
              {sortDirection === "asc" ? (
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
          Mostrando {filteredCount} de {totalCount} servicios
        </Badge>
      )}
    </div>
  )
}
