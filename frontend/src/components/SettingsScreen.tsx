import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SettingsScreen() {
  const [profile, setProfile] = useState({ name: "", avatar: "" });
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    fetch("/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile({ name: data.name || "", avatar: data.avatar || "" });
        setName(data.name || "");
        setAvatar(data.avatar || "");
      });
  }, []);

  const handleSave = async () => {
    await fetch("/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar }),
    });
    setProfile({ name, avatar });
    setEditOpen(false);
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
      <div className="flex items-center gap-4 mb-6">
        {profile.avatar ? (
          <img src={profile.avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover border" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">Sin avatar</div>
        )}
        <div>
          <div className="font-semibold text-lg">{profile.name || "Sin nombre"}</div>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Editar perfil</Button>
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
                <Button onClick={handleSave}>Guardar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Add credit card management and other settings here if needed */}
    </div>
  );
}