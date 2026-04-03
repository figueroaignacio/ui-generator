"use client";

import { logout } from "@/modules/auth/api/auth.api";

export function LogoutButton() {
  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return <button onClick={handleLogout}>Logout</button>;
}
