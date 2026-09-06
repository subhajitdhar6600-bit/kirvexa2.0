import { useState } from "react";
import { Shield, LogIn, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useApp } from "@/context/AppContext.tsx";
import { toast } from "sonner";
import AdminDashboard from "./AdminDashboard.tsx";

export default function AdminPage() {
  const { isAdminLoggedIn, adminLogin } = useApp();
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = adminLogin(id, pass);
    if (!ok) toast.error("Invalid Admin ID or Password.");
    else toast.success("Welcome, Admin!");
  };

  if (isAdminLoggedIn) return <AdminDashboard />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            KRIV<span className="text-primary">E</span>XA Admin
          </h1>
          <p className="text-gray-400 text-sm">Authorized personnel only</p>
        </div>
        <form onSubmit={handleLogin} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <Label className="text-gray-300 text-sm mb-1.5 block">Admin ID</Label>
            <Input value={id} onChange={e => setId(e.target.value)} placeholder="Enter admin ID" className="bg-white/5 border-white/10 text-white" required />
          </div>
          <div>
            <Label className="text-gray-300 text-sm mb-1.5 block">Password</Label>
            <div className="relative">
              <Input type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter password" className="bg-white/5 border-white/10 text-white pr-10" required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary text-black font-bold">
            <LogIn className="h-4 w-4 mr-2" /> Login to Admin Panel
          </Button>
        </form>
      </div>
    </div>
  );
}
