import { API_URL } from "@/shared/lib/config";

export async function fetchMe() {
  const res = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function loginWithGoogle() {
  const res = await fetch(`${API_URL}/auth/google`, {
    credentials: "include",
  });

  const data = await res.json();
  return data.url as string;
}

export async function loginWithGithub() {
  const res = await fetch(`${API_URL}/auth/github`, {
    credentials: "include",
  });

  const data = await res.json();
  return data.url as string;
}

export async function logout() {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
