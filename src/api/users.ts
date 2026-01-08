const API_BASE = "http://127.0.0.1:9002";

export type UserMeDTO = {
  user_id: string;
  name: string;
  email: string;
};

export async function getMe(): Promise<UserMeDTO> {
  const res = await fetch(`${API_BASE}/users/me`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return await res.json();
}

export async function updateMe(payload: Partial<UserMeDTO>) {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return await res.json();
}
