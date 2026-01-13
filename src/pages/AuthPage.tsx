import { useState } from "react";
import Login from "./Login";      // adjust path if different
import Register from "./Register"; // adjust path if different

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  if (mode === "login") {
    return <Login onToggleRegister={() => setMode("register")} />;
  }

  return <Register onToggleLogin={() => setMode("login")} />;
}
