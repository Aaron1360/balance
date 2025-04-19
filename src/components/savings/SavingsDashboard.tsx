import type React from "react"
import { useState } from "react"
import { differenceInDays, format } from "date-fns"
import { es } from "date-fns/locale"
import { Plus, Edit, Trash2, ArrowRight, PiggyBank, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { SavingsProject } from "@/types/savings"
import {
  projectsData,
  categoriesData,
  monthlyData,
  calculateTotalSavings,
  getRecentTransactions,
  getProjectTransactions,
} from "@/data/savings-data"
import { SavingsPieChart } from "./SavingsPieChart"
import { SavingsLineChart } from "./SavingsLineChart"
import { AddProjectDialog } from "./AddProjectDialog"
import { EditProjectDialog } from "./EditProjectDialog"
import { ProjectDetailsDialog } from "./ProjectDetailsDialog"

export default function SavingsDashboard() {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<SavingsProject | null>(null)

  const totalSavings = calculateTotalSavings()
  const recentTransactions = getRecentTransactions(5)

  const handleEditProject = (project: SavingsProject) => {
    setSelectedProject(project)
    setIsEditProjectOpen(true)
  }

  const handleDeleteProject = (project: SavingsProject) => {
    setSelectedProject(project)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteProject = () => {
    // Here you would delete the project from your data
    console.log("Deleting project:", selectedProject?.id)
    setIsDeleteDialogOpen(false)
  }

  const handleViewProjectDetails = (project: SavingsProject) => {
    setSelectedProject(project)
    setIsProjectDetailsOpen(true)
  }

  const calculateDaysRemaining = (deadline: Date): number => {
    return Math.max(0, differenceInDays(deadline, new Date()))
  }

  const calculateCompletionPercentage = (current: number, target: number): number => {
    return Math.min(100, Math.round((current / target) * 100))
  }

  const estimateCompletionDate = (project: SavingsProject): string => {
    const { currentAmount, targetAmount, deadline } = project
    const percentComplete = currentAmount / targetAmount

    if (percentComplete >= 1) return "¡Completado!"

    // If no progress, return the deadline
    if (percentComplete === 0) return format(deadline, "dd MMM yyyy", { locale: es })

    // Calculate estimated completion based on current progress
    const daysRemaining = calculateDaysRemaining(deadline)
    const daysNeeded = daysRemaining / percentComplete

    if (daysNeeded <= daysRemaining) {
      const estimatedDate = new Date()
      estimatedDate.setDate(estimatedDate.getDate() + daysNeeded)
      return format(estimatedDate, "dd MMM yyyy", { locale: es })
    } else {
      // Will not complete by deadline
      return "Después de la fecha límite"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 md:p-6">
      {/* Ahorros Totales Section */}
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <PiggyBank className="h-12 w-12 text-green-600 mr-4" />
                <div>
                  <h2 className="text-xl font-medium text-muted-foreground">Ahorros Totales</h2>
                  <p className="text-4xl font-bold">
                    {totalSavings.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsAddProjectOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Proyecto
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de Ahorros Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Análisis de Ahorros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Distribución de ahorros */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Ahorros</CardTitle>
              <CardDescription>Por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <SavingsPieChart data={categoriesData} />
              </div>
            </CardContent>
          </Card>

          {/* Patrones de ahorro */}
          <Card>
            <CardHeader>
              <CardTitle>Patrones de Ahorro</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <SavingsLineChart data={monthlyData} />
              </div>
            </CardContent>
          </Card>

          {/* Resumen de progreso */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Progreso</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="byCategory">Por Categoría</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="pt-4 space-y-4 max-h-[180px] overflow-y-auto">
                  {projectsData.map((project) => {
                    const percentage = calculateCompletionPercentage(project.currentAmount, project.targetAmount)

                    return (
                      <div key={project.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{project.name}</span>
                          <span className="text-muted-foreground">
                            {project.currentAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} /
                            {project.targetAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2"
                          style={
                            {
                              "--progress-indicator-color": project.color,
                            } as React.CSSProperties
                          }
                        />
                      </div>
                    )
                  })}
                </TabsContent>
                <TabsContent value="byCategory" className="pt-4 space-y-4 max-h-[180px] overflow-y-auto">
                  {categoriesData.map((category, index) => {
                    const categoryProjects = projectsData.filter((p) => p.category === category.name)
                    const totalTarget = categoryProjects.reduce((sum, p) => sum + p.targetAmount, 0)
                    const totalCurrent = categoryProjects.reduce((sum, p) => sum + p.currentAmount, 0)
                    const percentage = calculateCompletionPercentage(totalCurrent, totalTarget)

                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{category.name}</span>
                          <span className="text-muted-foreground">
                            {totalCurrent.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} /
                            {totalTarget.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2"
                          style={
                            {
                              "--progress-indicator-color": category.color,
                            } as React.CSSProperties
                          }
                        />
                      </div>
                    )
                  })}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actividad Reciente Section - In a row with specified order */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Actividad Reciente</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Resumen de Actividad */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Actividad</CardTitle>
              <CardDescription>Últimos 30 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Depósitos</p>
                    <p className="text-xl font-bold text-green-600">+$8,250.00</p>
                    <p className="text-xs text-muted-foreground mt-1">5 transacciones</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Retiros</p>
                    <p className="text-xl font-bold text-red-600">-$700.00</p>
                    <p className="text-xs text-muted-foreground mt-1">2 transacciones</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Crecimiento neto</p>
                  <p className="text-lg font-bold text-green-600">+$7,550.00</p>
                  <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Últimas Transacciones - Spans 2 columns */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Últimas Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => {
                  const project = projectsData.find((p) => p.id === transaction.projectId)
                  const isDeposit = transaction.type === "deposit"

                  return (
                    <div key={transaction.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-4">
                        <Avatar className={isDeposit ? "bg-green-100" : "bg-red-100"}>
                          <AvatarFallback className={isDeposit ? "text-green-700" : "text-red-700"}>
                            {isDeposit ? "+" : "-"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(transaction.date, "dd MMM yyyy", { locale: es })} • {project?.name}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${isDeposit ? "text-green-600" : "text-red-600"}`}>
                        {isDeposit ? "+" : ""}
                        {Math.abs(transaction.amount).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todas las transacciones
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Proyectos de Ahorro Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Proyectos de Ahorro</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {projectsData.map((project) => {
            const percentage = calculateCompletionPercentage(project.currentAmount, project.targetAmount)
            const daysRemaining = calculateDaysRemaining(project.deadline)
            const estimatedDate = estimateCompletionDate(project)

            return (
              <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className="font-normal"
                      style={{ borderColor: project.color, color: project.color }}
                    >
                      {project.category}
                    </Badge>
                  </div>
                  <CardDescription>
                    Meta: {project.targetAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>
                        Actual: {project.currentAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                      </span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-2"
                      style={
                        {
                          "--progress-indicator-color": project.color,
                        } as React.CSSProperties
                      }
                    />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Días Restantes</p>
                        <p className="font-medium">{daysRemaining}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fecha Estimada</p>
                        <p className="font-medium">{estimatedDate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => handleEditProject(project)}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-destructive border-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteProject(project)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleViewProjectDetails(project)}
                  >
                    Detalles
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Dialogs */}
      <AddProjectDialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen} />

      {selectedProject && (
        <>
          <EditProjectDialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen} project={selectedProject} />

          <ProjectDetailsDialog
            open={isProjectDetailsOpen}
            onOpenChange={setIsProjectDetailsOpen}
            project={selectedProject}
            transactions={getProjectTransactions(selectedProject.id)}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará el proyecto "{selectedProject.name}" y no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeleteProject}
                  className="bg-destructive text-destructive-foreground"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  )
}
