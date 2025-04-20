import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  CreditCard,
  Filter,
  MoreVertical,
  Plus,
  Search,
  AlertCircle,
  Edit,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { differenceInDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { debtData, paymentData } from "@/data/debt-data"
import { servicesData, paymentsData } from "@/data/services-data";
// import type { DebtItem } from "@/types/debt"
import type { Service } from "@/types/service";
import { AddDebtDialog } from "../debts/AddDebtDialog";
import { DebtDetailsDialog } from "../debts/DebtDetailsDialog";
import { MakePaymentDialog } from "../debts/MakePaymentDialog";
import { DebtItem } from "@/types/debt";

// Add this helper function at the top of the component, before the useState declarations
const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};
// Calculate total monthly service cost
const totalMonthlyCost = servicesData
  .filter((service) => service.status !== "canceled")
  .reduce((total, service) => total + service.minimumPayment, 0);

const upcomingServices = servicesData
  .filter((service) => {
    if (service.status === "canceled") return false;
    if (!isValidDate(service.nextPaymentDate)) return false;
    const daysUntilDue = differenceInDays(service.nextPaymentDate, new Date());
    return daysUntilDue >= 0 && daysUntilDue <= 7;
  })
  .sort((a, b) => {
    if (!isValidDate(a.nextPaymentDate)) return 1;
    if (!isValidDate(b.nextPaymentDate)) return -1;
    return a.nextPaymentDate.getTime() - b.nextPaymentDate.getTime();
  });

// Get recent payments for services
const servicePayments = [...paymentsData].sort((a, b) => {
  const aTime = a.date instanceof Date ? a.date.getTime() : -Infinity
  const bTime = b.date instanceof Date ? b.date.getTime() : -Infinity
  return isNaN(bTime) || isNaN(aTime) ? 0 : bTime - aTime
})

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("todos");

  const handleAddService = () => {
    setIsAddDialogOpen(true);
  };

  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsDialogOpen(true);
  };

  const handleMakePayment = (service: Service) => {
    setSelectedService(service);
    setIsPaymentDialogOpen(true);
  };

  const handleDeleteService = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteService = () => {
    // In a real app, you would delete the service here
    console.log("Deleting service:", selectedService?.id);
    setIsDeleteDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pagado":
        return <Badge className="bg-green-100 text-green-800">Pagado</Badge>;
      case "próximo":
        return <Badge className="bg-blue-100 text-blue-800">Próximo</Badge>;
      case "vencido":
        return <Badge className="bg-red-100 text-red-800">Vencido</Badge>;
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 md:p-6">
      {/* Header with summary */}
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <CreditCard className="h-12 w-12 text-blue-600 mr-4" />
                <div>
                  <h2 className="text-xl font-medium text-muted-foreground">
                    Gasto Mensual en Servicios
                  </h2>
                  <p className="text-4xl font-bold">
                    {totalMonthlyCost.toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {upcomingServices.length > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {upcomingServices.length}{" "}
                      {upcomingServices.length === 1 ? "servicio" : "servicios"}{" "}
                      por pagar esta semana
                    </span>
                  </Badge>
                )}

                <Button onClick={handleAddService} className="mt-2">
                  Añadir Servicio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar servicios..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Estado del pago</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveFilter("todos")}>
                {activeFilter === "todos" && (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("pagado")}>
                {activeFilter === "pagado" && (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Pagados
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("próximo")}>
                {activeFilter === "próximo" && (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Próximos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("pendiente")}>
                {activeFilter === "pendiente" && (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Pendientes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("vencido")}>
                {activeFilter === "vencido" && (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Vencidos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services List - Left side (wider) */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Mis Servicios</h2>
            <Button onClick={handleAddService} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Servicio
            </Button>
          </div>

          {servicesData.length === 0 ? (
            <div className="text-center py-10 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">
                No se encontraron servicios
              </p>
              {searchQuery && (
                <Button
                  variant="link"
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesData.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(service)}
                          >
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleMakePayment(service)}
                          >
                            Registrar pago
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteService(service)}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="capitalize">
                          {service.category}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {service.minimumPayment.toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Mensual
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Próximo pago:</span>
                        </div>
                        <div>{getStatusBadge(service.paymentStatus)}</div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Fecha de vencimiento:
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          {isValidDate(service.nextPaymentDate)
                            ? format(service.nextPaymentDate, "dd MMM", {
                                locale: es,
                              })
                            : "Fecha no disponible"}
                        </span>
                      </div>

                      {service.creditor && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            Proveedor:
                          </span>
                          <span>{service.creditor}</span>
                        </div>
                      )}

                      {service.notes && (
                        <p className="text-xs text-muted-foreground">
                          {service.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleViewDetails(service)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleMakePayment(service)}
                      >
                        Pagar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Analysis and Activity - Right side (narrower) */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Análisis y Actividad</h2>

          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Próximos</TabsTrigger>
              <TabsTrigger value="activity">Actividad</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Pagos</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingServices.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No hay pagos próximos esta semana
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between py-2 border-b border-border"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: service.color }}
                            ></div>
                            <div>
                              <p className="text-sm font-medium">
                                {service.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {isValidDate(service.nextPaymentDate)
                                  ? format(
                                      service.nextPaymentDate,
                                      "dd 'de' MMMM",
                                      { locale: es }
                                    )
                                  : "Fecha no disponible"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {service.minimumPayment.toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN",
                              })}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleMakePayment(service)}
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  {servicePayments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No hay actividad reciente
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {servicePayments.slice(0, 5).map((payment) => {
                        const service = servicesData.find(
                          (s) => s.id === payment.serviceId
                        );

                        return (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between py-2 border-b border-border"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <div>
                                <p className="text-sm font-medium">
                                  {service?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {isValidDate(payment.date)
                                    ? format(payment.date, "dd 'de' MMMM", {
                                        locale: es,
                                      })
                                    : "Fecha no disponible"}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-medium">
                              {payment.amount.toLocaleString("es-MX", {
                                style: "currency",
                                currency: "MXN",
                              })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Distribución por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              {servicesData.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No hay servicios para mostrar
                </p>
              ) : (
                <div className="space-y-4">
                  {Array.from(
                    new Set(servicesData.map((s) => "otro"))
                  ).map((category) => {
                    const categoryServices = servicesData.filter(
                      (s) => ("otro") === category
                    );
                    const totalCost = categoryServices.reduce(
                      (sum, s) => sum + s.minimumPayment,
                      0
                    );

                    return (
                      <div
                        key={category}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                categoryServices[0]?.color || "#cbd5e1",
                            }}
                          ></div>
                          <span className="capitalize">{category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {totalCost.toLocaleString("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {categoryServices.length} servicios
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}


      // {/* Dialogs */}
      // <AddDebtDialog
      //   open={isAddDialogOpen}
      //   onOpenChange={setIsAddDialogOpen}
      // />

      // {selectedService && (
      //   <>
      //     <DebtDetailsDialog
      //       debt={selectedService}
      //       open={isDetailsDialogOpen}
      //       onOpenChange={setIsDetailsDialogOpen}
      //     />

      //     <MakePaymentDialog
      //       debt={selectedService}
      //       open={isPaymentDialogOpen}
      //       onOpenChange={setIsPaymentDialogOpen}
      //     />

      //     <AlertDialog
      //       open={isDeleteDialogOpen}
      //       onOpenChange={setIsDeleteDialogOpen}
      //     >
      //       <AlertDialogContent>
      //         <AlertDialogHeader>
      //           <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
      //           <AlertDialogDescription>
      //             Esta acción eliminará el servicio "{selectedService.name}" y
      //             no se puede deshacer.
      //           </AlertDialogDescription>
      //         </AlertDialogHeader>
      //         <AlertDialogFooter>
      //           <AlertDialogCancel>Cancelar</AlertDialogCancel>
      //           <AlertDialogAction
      //             onClick={confirmDeleteService}
      //             className="bg-destructive text-destructive-foreground"
      //           >
      //             <AlertCircle className="h-4 w-4 mr-2" />
      //             Eliminar
      //           </AlertDialogAction>
      //         </AlertDialogFooter>
      //       </AlertDialogContent>
      //     </AlertDialog>
      //   </>
      // )}