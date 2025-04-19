"use client"

import type React from "react"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowDown, ArrowUp, CalendarIcon, PiggyBank, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { SavingsProject, SavingsTransaction } from "@/types/savings"

interface ProjectDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: SavingsProject
  transactions: SavingsTransaction[]
}

export function ProjectDetailsDialog({ open, onOpenChange, project, transactions }: ProjectDetailsDialogProps) {
  const percentage = Math.min(100, Math.round((project.currentAmount / project.targetAmount) * 100))

  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>{project.name}</span>
            <Badge
              variant="outline"
              className="font-normal"
              style={{ borderColor: project.color, color: project.color }}
            >
              {project.category}
            </Badge>
          </DialogTitle>
          <DialogDescription>Detalles y transacciones del proyecto</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <PiggyBank className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Meta</p>
                      <p className="font-semibold">
                        {project.targetAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PiggyBank className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ahorrado</p>
                      <p className="font-semibold">
                        {project.currentAmount.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha Límite</p>
                      <p className="font-medium">
                        {format(project.deadline, "dd 'de' MMMM 'de' yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Restante</p>
                    <p className="font-medium">
                      {(project.targetAmount - project.currentAmount).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      })}
                    </p>
                  </div>
                </div>

                {project.note && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Nota</p>
                    <p className="text-sm">{project.note}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Transactions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Historial de Transacciones</h3>

            {sortedTransactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay transacciones para este proyecto.</p>
            ) : (
              <div className="space-y-4">
                {sortedTransactions.map((transaction) => {
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
                            {format(transaction.date, "dd MMM yyyy", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isDeposit ? "outline" : "secondary"} className="text-xs">
                          {isDeposit ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                          {isDeposit ? "Depósito" : "Retiro"}
                        </Badge>
                        <span className={`text-sm font-medium ${isDeposit ? "text-green-600" : "text-red-600"}`}>
                          {isDeposit ? "+" : ""}
                          {Math.abs(transaction.amount).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
