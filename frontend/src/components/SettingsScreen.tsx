import { useEffect, useState, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PurchasesContext } from "@/context/PurchasesContext";

export function SettingsScreen() {
  const ctx = useContext(PurchasesContext);
  if (!ctx) throw new Error("SettingsScreen must be used within PurchasesProvider");
  const {
    profile, profileLoading, profileError, fetchProfile, saveProfile, deleteProfile
  } = ctx;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  // Sync local state with context profile
  useEffect(() => {
    setName(profile?.name || "");
    setAvatar(profile?.avatar || "");
  }, [profile]);

  // Open dialog for create/edit
  const handleEditOpen = () => {
    setEditOpen(true);
  };

  // Save profile (create or edit)
  const handleSave = async () => {
    await saveProfile(name, avatar, !!profile);
    setEditOpen(false);
  };

  // Delete profile
  const handleDelete = async () => {
    await deleteProfile();
    setDeleteOpen(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>
      <div className="text-muted-foreground mb-6">Aquí podrás editar tu perfil y preferencias de pago.</div>
      {profileLoading && <div className="mb-4 text-sm text-gray-500">Cargando...</div>}
      {profileError && <div className="mb-4 text-sm text-red-500">{profileError}</div>}
      {profile ? (
        <div className="flex items-center gap-4 mb-6">
          {profile.avatar ? (
            <img src={profile.avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover border" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">Sin avatar</div>
          )}
          <div>
            <div className="font-semibold text-lg">{profile.name || "Sin nombre"}</div>
            <div className="flex gap-2 mt-2">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleEditOpen}>Editar perfil</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar perfil</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    <label className="font-medium">Nombre
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
                    </label>
                    <label className="font-medium">Avatar
                      <Input type="file" accept="image/*" onChange={handleAvatarChange} />
                      {avatar && <img src={avatar} alt="preview" className="w-16 h-16 rounded-full mt-2 object-cover border" />}
                    </label>
                    <Button onClick={handleSave} disabled={profileLoading}>{profileLoading ? "Guardando..." : "Guardar"}</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">Eliminar perfil</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Eliminar perfil?</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    <div>¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.</div>
                    <Button onClick={handleDelete} variant="destructive" disabled={profileLoading}>{profileLoading ? "Eliminando..." : "Eliminar"}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="mb-2 text-gray-500">No tienes perfil creado.</div>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleEditOpen}>Crear perfil</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear perfil</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <label className="font-medium">Nombre
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
                </label>
                <label className="font-medium">Avatar
                  <Input type="file" accept="image/*" onChange={handleAvatarChange} />
                  {avatar && <img src={avatar} alt="preview" className="w-16 h-16 rounded-full mt-2 object-cover border" />}
                </label>
                <Button onClick={handleSave} disabled={profileLoading}>{profileLoading ? "Guardando..." : "Crear"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {/* Add credit card management and other settings here if needed */}
    </div>
  );
}