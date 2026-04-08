"use client";

import { useState } from "react";
import { logout } from "@/modules/auth/api/auth.api";
import { Button } from "@repo/ui/components/button";
import { Dialog } from "@repo/ui/components/dialog";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button variant="destructive">Logout</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to logout?
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline" disabled={isLoading}>Cancel</Button>
          </Dialog.Close>
          <Button onClick={handleLogout} variant="destructive" loading={isLoading} disabled={isLoading}>
            Logout
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
