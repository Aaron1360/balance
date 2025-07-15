import { useEffect, useState, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PurchasesContext } from "@/context/PurchasesContext";

export function SettingsScreen() {
  const ctx = useContext(PurchasesContext);
  if (!ctx) throw new Error("SettingsScreen must be used within PurchasesProvider");
  const {
    profile, profileLoading, profileError, saveProfile, deleteProfile, fetchProfile
  } = ctx;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarEditOpen, setAvatarEditOpen] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);

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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>
      <div className="text-muted-foreground mb-6">Aquí podrás editar tu perfil y preferencias de pago.</div>
      {profileLoading && <div className="mb-4 text-sm text-gray-500">Cargando...</div>}
      {profileError && <div className="mb-4 text-sm text-red-500">{profileError}</div>}
      {profile ? (
        <div className="flex items-center gap-4 mb-6">
          <Dialog open={avatarEditOpen} onOpenChange={setAvatarEditOpen}>
            <DialogTrigger asChild>
              {(profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border cursor-pointer hover:opacity-80"
                  title="Cambiar avatar"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 cursor-pointer hover:opacity-80" title="Agregar avatar">Sin avatar</div>
              ))}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cambiar avatar</DialogTitle>
                <DialogDescription>Selecciona una nueva imagen de avatar.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Input type="file" accept="image/*" onChange={handleAvatarChange} />
                {newAvatar && <img src={newAvatar} alt="preview" className="w-16 h-16 rounded-full mt-2 object-cover border" />}
                <Button onClick={handleSaveAvatar} disabled={!newAvatar || profileLoading}>{profileLoading ? "Guardando..." : "Guardar avatar"}</Button>
              </div>
            </DialogContent>
          </Dialog>
          <div>
            <div className="font-semibold text-lg">{profile.username || "Sin nombre"}</div>
            <div className="flex gap-2 mt-2">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>Editar nombre</Button>
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
                  <Button variant="destructive" size="sm">Eliminar perfil</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Eliminar perfil?</DialogTitle>
                    <DialogDescription>
                      Esta acción eliminará tu perfil permanentemente.
                    </DialogDescription>
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
                  {newAvatar && <img src={newAvatar} alt="preview" className="w-16 h-16 rounded-full mt-2 object-cover border" />}
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