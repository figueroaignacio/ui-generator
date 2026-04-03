"use client";

import { loginWithGithub, loginWithGoogle } from "@/modules/auth/api/auth.api";
import { useAuth } from "@/modules/auth/hooks/use-auth";
import { useRouter } from "next/navigation";

export function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  async function handleGoogle() {
    const url = await loginWithGoogle();
    window.location.href = url;
  }

  async function handleGithub() {
    const url = await loginWithGithub();
    window.location.href = url;
  }

  if (isLoading) return <div>Cargando...</div>;
  if (user) return router.push("/dashboard");

  return (
    <div>
      <h1>NachAI</h1>
      <button onClick={handleGoogle}>Login con Google</button>
      <button onClick={handleGithub}>Login con GitHub</button>
    </div>
  );
}
