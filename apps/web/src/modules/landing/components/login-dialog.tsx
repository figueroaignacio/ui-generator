"use client";

import { loginWithGithub, loginWithGoogle } from "@/modules/auth/api/auth.api";
import { Logo } from "@/shared/components/logo";
import { GitHubIcon, GoogleIcon } from "@/shared/components/tech-icons";
import { Button } from "@repo/ui/components/button";
import { Dialog } from "@repo/ui/components/dialog";
import { Separator } from "@repo/ui/components/separator";
import Link from "next/link";

interface LoginDialogProps {
  children: React.ReactNode;
}

export function LoginDialog({ children }: LoginDialogProps) {
  async function handleGoogle() {
    const url = await loginWithGoogle();
    window.location.href = url;
  }

  async function handleGithub() {
    const url = await loginWithGithub();
    window.location.href = url;
  }

  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content className="w-md">
        <Dialog.Header className="space-y-5">
          <Dialog.Title>
            <Logo />
          </Dialog.Title>
          <Dialog.Description>
            Start building the future of the user interface
          </Dialog.Description>
        </Dialog.Header>
        <div className="flex flex-col gap-y-3 mt-5">
          <Button
            onClick={handleGithub}
            variant="outline"
            leftIcon={<GitHubIcon />}>
            Continue with GitHub
          </Button>
          <Button
            onClick={handleGoogle}
            variant="outline"
            leftIcon={<GoogleIcon />}>
            Continue with Google
          </Button>
        </div>
        <Separator className="my-4" />
        <p className="text-xs text-muted-foreground text-center">
          To continue you accept our <Link href="/terms">Terms of Service</Link>{" "}
          and Privacy Policy
        </p>
      </Dialog.Content>
    </Dialog>
  );
}
