const API_BASE = "cravecallcateringbk-hrgjcyd3aeaxc3dz.canadacentral-01.azurewebsites.net";

export type BrandingDTO = {
  app_name?: string;
  tagline?: string;
  logo_url?: string;
};

export type SettingsDTO = {
  restaurant_id?: string;
  restaurant_name?: string;
  business_phone?: string;
  business_email?: string;
  business_address?: string;
  notifications?: {
    email_new_orders?: boolean;
    sms_urgent_orders?: boolean;
    weekly_revenue_reports?: boolean;
    customer_feedback?: boolean;
  };
  billing?: {
    plan_name?: string;
    status?: string;
    price_monthly?: number;
  };
  branding?: BrandingDTO;
};

// ✅ If you don’t have auth yet, token will be "" and no header will be sent.
// If you DO have auth, store token in localStorage as "access_token" (or change key below).
function getToken() {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    ""
  );
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function getSettings(): Promise<SettingsDTO> {
  const res = await fetch(`${API_BASE}/settings`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(await res.text() || "Failed to fetch settings");
  return await res.json();
}

export async function updateSettings(payload: Partial<SettingsDTO>) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text() || "Failed to update settings");
  return await res.json();
}

/**
 * ✅ Upload brand logo file. Backend should return: { success: true, logo_url: "http://..." }
 */
export async function uploadBrandLogo(file: File): Promise<{ logo_url: string }> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}/settings/branding/logo`, {
    method: "POST",
    headers: { ...authHeaders() }, // IMPORTANT: no Content-Type here (browser sets boundary)
    body: fd,
  });

  if (!res.ok) throw new Error(await res.text() || "Logo upload failed");
  return await res.json();
}

