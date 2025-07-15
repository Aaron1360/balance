import { useEffect, useState, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PurchasesContext, API_URL } from "@/context/PurchasesContext";
import { Card as ShadCard, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // shadcn utility for className merging, if available
import { Plus } from "lucide-react";

export function SettingsScreen() {
  const ctx = useContext(PurchasesContext);
  if (!ctx) throw new Error("SettingsScreen must be used within PurchasesProvider");
  const {
    profile, profileLoading, profileError, saveProfile, deleteProfile, fetchProfile, refreshCards, cards: contextCards,
    categories, categoriesLoading, refreshCategories, addCategory, editCategory: updateCategory, deleteCategory
  } = ctx;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarEditOpen, setAvatarEditOpen] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [newCardBrand, setNewCardBrand] = useState("");
  const [newCardPaymentDate, setNewCardPaymentDate] = useState(1);
  const [addCardError, setAddCardError] = useState<string | null>(null);

  // Edit card dialog state
  const [editCardOpen, setEditCardOpen] = useState(false);
  const [editCard, setEditCard] = useState<CardType | null>(null);
  const [editCardBrand, setEditCardBrand] = useState("");
  const [editCardPaymentDate, setEditCardPaymentDate] = useState(1);
  const [editCardError, setEditCardError] = useState<string | null>(null);
  const [editCardLoading, setEditCardLoading] = useState(false);
  const [deleteCardConfirmOpen, setDeleteCardConfirmOpen] = useState(false);

  // --- Custom Categories State ---
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [addCategoryError, setAddCategoryError] = useState<string | null>(null);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<string | null>(null);
  const [editCategoryValue, setEditCategoryValue] = useState("");
  const [editCategoryError, setEditCategoryError] = useState<string | null>(null);
  const [deleteCategoryConfirmOpen, setDeleteCategoryConfirmOpen] = useState(false);

  // Card type for TypeScript
  interface CardType {
    id: number;
    brand: string;
    payment_date: number;
  }

  // Sync local state with context profile
  useEffect(() => {
    setUsername(profile?.username || "");
  }, [profile]);

  // Save profile (create or edit)
  const handleSave = async () => {
    await saveProfile(username, profile?.avatar || "", true);
    await fetchProfile(); // refresh profile from backend after save
    setEditOpen(false);
  };

  // Save only username
  const handleSaveUsername = async () => {
    await saveProfile(username, profile?.avatar || "", true);
    await fetchProfile();
    setEditOpen(false);
  };

  // Save only avatar
  const handleSaveAvatar = async () => {
    if (newAvatar) {
      await saveProfile(profile?.username || "", newAvatar, true);
      await fetchProfile();
    }
    setAvatarEditOpen(false);
    setNewAvatar(null);
  };

  // Delete profile
  const handleDelete = async () => {
    await deleteProfile();
    await fetchProfile(); // refresh profile from backend after delete
    setDeleteOpen(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Add card handler
  const handleAddCard = async () => {
    setAddCardError(null);
    if (!newCardBrand.trim() || !newCardPaymentDate) {
      setAddCardError("Marca y fecha de pago requeridas");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: newCardBrand, payment_date: newCardPaymentDate }),
      });
      if (!res.ok) throw new Error("Error al agregar tarjeta");
      setNewCardBrand("");
      setNewCardPaymentDate(1);
      setAddCardOpen(false);
      await refreshCards(); // Refresh global cards state
    } catch (err) {
      setAddCardError(err instanceof Error ? err.message : "Error al agregar tarjeta");
    }
  };

  // Open edit card dialog
  const openEditCardDialog = (card: CardType) => {
    setEditCard(card);
    setEditCardBrand(card.brand);
    setEditCardPaymentDate(card.payment_date);
    setEditCardError(null);
    setEditCardOpen(true);
  };

  // Edit card handler
  const handleEditCard = async () => {
    if (!editCard) return;
    setEditCardError(null);
    if (!editCardBrand.trim() || !editCardPaymentDate || editCardPaymentDate < 1 || editCardPaymentDate > 31) {
      setEditCardError("Marca y fecha de pago requeridas");
      return;
    }
    setEditCardLoading(true);
    try {
      const res = await fetch(`${API_URL}/cards/${editCard.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: editCardBrand, payment_date: editCardPaymentDate }),
      });
      if (!res.ok) throw new Error("Error al editar tarjeta");
      await refreshCards(); // Refresh global cards state
      setEditCardOpen(false);
    } catch (err) {
      setEditCardError(err instanceof Error ? err.message : "Error al editar tarjeta");
    } finally {
      setEditCardLoading(false);
    }
  };

  // Delete card handler with confirmation
  const handleDeleteCard = async () => {
    if (!editCard) return;
    setEditCardLoading(true);
    try {
      const res = await fetch(`${API_URL}/cards/${editCard.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar tarjeta");
      await refreshCards(); // Refresh global cards state
      setEditCardOpen(false);
      setDeleteCardConfirmOpen(false);
    } catch (err) {
      setEditCardError(err instanceof Error ? err.message : "Error al eliminar tarjeta");
    } finally {
      setEditCardLoading(false);
    }
  };

  // --- Custom Categories CRUD ---
  const handleAddCategory = async () => {
    setAddCategoryError(null);
    if (!newCategory.trim()) {
      setAddCategoryError("Nombre de categoría requerido");
      return;
    }
    try {
      await addCategory(newCategory.trim());
      setNewCategory("");
      setAddCategoryOpen(false);
      await refreshCategories();
    } catch (err) {
      setAddCategoryError(err instanceof Error ? err.message : "Error al agregar categoría");
    }
  };

  const openEditCategoryDialog = (category: string) => {
    setEditCategory(category);
    setEditCategoryValue(category);
    setEditCategoryError(null);
    setEditCategoryOpen(true);
  };

  const handleEditCategory = async () => {
    if (!editCategory) return;
    setEditCategoryError(null);
    if (!editCategoryValue.trim()) {
      setEditCategoryError("Nombre de categoría requerido");
      return;
    }
    try {
      await updateCategory(editCategory, editCategoryValue.trim());
      setEditCategoryOpen(false);
      await refreshCategories();
    } catch (err) {
      setEditCategoryError(err instanceof Error ? err.message : "Error al editar categoría");
    }
  };

  const handleDeleteCategory = async () => {
    if (!editCategory) return;
    try {
      await deleteCategory(editCategory);
      setEditCategoryOpen(false);
      setDeleteCategoryConfirmOpen(false);
      await refreshCategories();
    } catch (err) {
      setEditCategoryError(err instanceof Error ? err.message : "Error al eliminar categoría");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mb-10">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>
      <div className="text-muted-foreground mb-6">Aquí podrás editar tu perfil y preferencias de pago.</div>
      {profileLoading && <div className="mb-4 text-sm text-gray-500">Cargando...</div>}
      {profileError && <div className="mb-4 text-sm text-red-500">{profileError}</div>}
      {profile ? (
        <>
          <ShadCard className="mb-6">
            <CardContent
              className="flex flex-col sm:flex-row items-center gap-4 p-4 overflow-x-auto cursor-pointer hover:opacity-80"
              onClick={() => setShowButtons((prev) => !prev)}
              tabIndex={0}
              role="button"
              aria-pressed={showButtons}
            >
              <Dialog open={avatarEditOpen} onOpenChange={setAvatarEditOpen}>
                <DialogTrigger asChild>
                  {(profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="avatar"
                      className="w-20 h-20 rounded-full object-cover border cursor-pointer"
                      title="Cambiar avatar"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 cursor-pointer hover:opacity-80 flex-shrink-0 text-center text-sm leading-tight"
                      title="Agregar avatar"
                    >
                      <span className="w-full">Sin avatar</span>
                    </div>
                  ))}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cambiar avatar</DialogTitle>
                    <DialogDescription>Selecciona una nueva imagen de avatar.</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    <Input type="file" accept="image/*" onChange={handleAvatarChange} />
                    {newAvatar && <img src={newAvatar} alt="preview" className="w-20 h-20 rounded-full mt-2 object-cover border" />}
                    <Button onClick={handleSaveAvatar} disabled={!newAvatar || profileLoading}>{profileLoading ? "Guardando..." : "Guardar avatar"}</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex-1 w-full min-w-0">
                <div className="font-semibold text-lg break-words text-center sm:text-left">{profile.username || "Sin nombre"}</div>
                <div
                  className={cn(
                    "flex flex-col sm:flex-row gap-2 mt-2 justify-center sm:justify-start transition-all duration-300 overflow-hidden",
                    showButtons ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  )}
                  aria-hidden={!showButtons}
                >
                  <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="hover:bg-secondary-foreground/80" onClick={e => { e.stopPropagation(); setEditOpen(true); }}>Editar nombre</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar nombre de usuario</DialogTitle>
                        <DialogDescription>Cambia tu nombre de usuario aquí.</DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <label className="font-medium">Nombre de usuario
                          <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Tu nombre de usuario" />
                        </label>
                        <Button onClick={handleSaveUsername} disabled={profileLoading}>{profileLoading ? "Guardando..." : "Guardar"}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={e => { e.stopPropagation(); setDeleteOpen(true); }}>Eliminar perfil</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>¿Eliminar perfil?</DialogTitle>
                        <DialogDescription>Esta acción eliminará tu perfil permanentemente.</DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <div>¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.</div>
                        <Button onClick={handleDelete} variant="destructive" disabled={profileLoading}>{profileLoading ? "Eliminando..." : "Eliminar"}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </ShadCard>
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Tus tarjetas</h2>
            {contextCards.length === 0 ? (
              <div className="text-gray-400 text-sm">No tienes tarjetas registradas.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {contextCards.map(card => (
                  <ShadCard
                    key={card.id}
                    className="w-[320px] h-[200px] rounded-xl shadow-md bg-gradient-to-br from-blue-400 to-blue-700 text-white flex flex-col justify-between p-6 mx-auto cursor-pointer transition hover:scale-[1.02]"
                    onClick={() => openEditCardDialog(card)}
                  >
                    <div className="font-semibold text-lg tracking-wider">{card.brand}</div>
                    <div className="flex items-end justify-between w-full">
                      <div className="text-xs uppercase tracking-widest">Pago: día</div>
                      <div className="text-2xl font-bold">{card.payment_date}</div>
                    </div>
                  </ShadCard>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center mb-6">
            <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
              <DialogTrigger asChild>
                <ShadCard
                  className="w-[320px] h-[200px] rounded-xl shadow-md border-dashed border-2 border-secondary-foreground flex flex-col items-center justify-center text-secondary-foreground cursor-pointer transition hover:scale-[1.02] mx-auto"
                  tabIndex={0}
                  role="button"
                  aria-label="Agregar tarjeta"
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="font-semibold text-lg">Agregar tarjeta</span>
                </ShadCard>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar tarjeta</DialogTitle>
                  <DialogDescription>Registra una nueva tarjeta de crédito.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <label className="font-medium">Marca
                    <Input value={newCardBrand} onChange={e => setNewCardBrand(e.target.value)} placeholder="Ej: BBVA, Santander" />
                  </label>
                  <label className="font-medium">Fecha de pago (día del mes)
                    <Input type="number" min={1} max={31} value={newCardPaymentDate} onChange={e => setNewCardPaymentDate(Number(e.target.value))} />
                  </label>
                  {addCardError && <div className="text-red-500 text-sm">{addCardError}</div>}
                  <Button
                    onClick={handleAddCard}
                    disabled={
                      !newCardBrand.trim() ||
                      !newCardPaymentDate ||
                      newCardPaymentDate < 1 ||
                      newCardPaymentDate > 31
                    }
                  >
                    {profileLoading ? "Guardando..." : "Agregar"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {/* Custom Categories Section */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Tus categorías personalizadas</h2>
            {categoriesLoading ? (
              <div className="text-gray-400 text-sm">Cargando categorías...</div>
            ) : categories.length === 0 ? (
              <div className="text-gray-400 text-sm">No tienes categorías registradas.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {categories.map(category => (
                  <ShadCard
                    key={category}
                    className="w-[320px] rounded-xl shadow bg-gradient-to-br from-green-400 to-green-700 text-white flex flex-row justify-between items-center p-4 mx-auto cursor-pointer transition hover:scale-[1.02]"
                    onClick={() => openEditCategoryDialog(category)}
                  >
                    <div className="font-semibold text-lg tracking-wider">{category}</div>
                  </ShadCard>
                ))}
              </div>
            )}
            <div className="flex justify-center mt-4">
              <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
                <DialogTrigger asChild>
                  <ShadCard
                    className="w-[320px] rounded-xl shadow-md border-dashed border-2 border-secondary-foreground flex flex-col items-center justify-center text-secondary-foreground cursor-pointer transition hover:scale-[1.02] mx-auto"
                    tabIndex={0}
                    role="button"
                    aria-label="Agregar categoría"
                  >
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="font-semibold text-lg">Agregar categoría</span>
                  </ShadCard>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar categoría</DialogTitle>
                    <DialogDescription>Registra una nueva categoría personalizada.</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    <label className="font-medium">Nombre
                      <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Ej: Viajes, Inversiones" />
                    </label>
                    {addCategoryError && <div className="text-red-500 text-sm">{addCategoryError}</div>}
                    <Button onClick={handleAddCategory} disabled={!newCategory.trim() || categoriesLoading}>
                      {categoriesLoading ? "Guardando..." : "Agregar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* Edit Card Dialog */}
          <Dialog open={editCardOpen} onOpenChange={setEditCardOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar tarjeta</DialogTitle>
                <DialogDescription>Edita o elimina esta tarjeta de crédito.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <label className="font-medium">Marca
                  <Input value={editCardBrand} onChange={e => setEditCardBrand(e.target.value)} placeholder="Ej: BBVA, Santander" />
                </label>
                <label className="font-medium">Fecha de pago (día del mes)
                  <Input type="number" min={1} max={31} value={editCardPaymentDate} onChange={e => setEditCardPaymentDate(Number(e.target.value))} />
                </label>
                {editCardError && <div className="text-red-500 text-sm">{editCardError}</div>}
                <div className="flex gap-2">
                  <Button onClick={handleEditCard} disabled={editCardLoading || !editCardBrand.trim() || !editCardPaymentDate || editCardPaymentDate < 1 || editCardPaymentDate > 31}>
                    {editCardLoading ? "Guardando..." : "Guardar cambios"}
                  </Button>
                  <Dialog open={deleteCardConfirmOpen} onOpenChange={setDeleteCardConfirmOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" disabled={editCardLoading}>
                        {editCardLoading ? "Eliminando..." : "Eliminar"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>¿Eliminar tarjeta?</DialogTitle>
                        <DialogDescription>Esta acción eliminará la tarjeta permanentemente.</DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <div>¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no se puede deshacer.</div>
                        <Button onClick={handleDeleteCard} variant="destructive" disabled={editCardLoading}>
                          {editCardLoading ? "Eliminando..." : "Confirmar eliminación"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* Edit Category Dialog */}
          <Dialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar categoría</DialogTitle>
                <DialogDescription>Edita o elimina esta categoría personalizada.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <label className="font-medium">Nombre
                  <Input value={editCategoryValue} onChange={e => setEditCategoryValue(e.target.value)} placeholder="Ej: Viajes, Inversiones" />
                </label>
                {editCategoryError && <div className="text-red-500 text-sm">{editCategoryError}</div>}
                <div className="flex gap-2">
                  <Button onClick={handleEditCategory} disabled={!editCategoryValue.trim() || categoriesLoading}>
                    {categoriesLoading ? "Guardando..." : "Guardar cambios"}
                  </Button>
                  <Dialog open={deleteCategoryConfirmOpen} onOpenChange={setDeleteCategoryConfirmOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" disabled={categoriesLoading}>
                        Eliminar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>¿Eliminar categoría?</DialogTitle>
                        <DialogDescription>Esta acción eliminará la categoría permanentemente.</DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <div>¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.</div>
                        <Button onClick={handleDeleteCategory} variant="destructive" disabled={categoriesLoading}>
                          {categoriesLoading ? "Eliminando..." : "Confirmar eliminación"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="mb-6">
          <div className="mb-2 text-gray-500">No tienes perfil creado.</div>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditOpen(true)}>Crear perfil</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear perfil</DialogTitle>
                <DialogDescription>
                  Crea tu perfil con un nombre de usuario y avatar.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <label className="font-medium">Nombre de usuario
                  <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Tu nombre de usuario" />
                </label>
                <label className="font-medium">Avatar
                  <Input type="file" accept="image/*" onChange={handleAvatarChange} />
                  {newAvatar && <img src={newAvatar} alt="preview" className="w-20 h-20 rounded-full mt-2 object-cover border" />}
                </label>
                <Button onClick={async () => {
                  await saveProfile(username, newAvatar || "", false);
                  await fetchProfile();
                  setEditOpen(false);
                  setNewAvatar(null);
                }} disabled={profileLoading}>{profileLoading ? "Guardando..." : "Crear"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {/* Add credit card management and other settings here if needed */}
    </div>
  );
}