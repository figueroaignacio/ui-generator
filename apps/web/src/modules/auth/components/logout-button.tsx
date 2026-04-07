"use client";

import { logout } from "@/modules/auth/api/auth.api";
import { Button } from "@repo/ui/components/button";

export function LogoutButton() {
  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <Button onClick={handleLogout} variant="destructive">
      Logout
    </Button>
  );
}
