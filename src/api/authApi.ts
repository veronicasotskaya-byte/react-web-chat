export async function login(email: string, password: string) {
  const response = await fetch("/api/Auth/agent", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch("/api/Auth/me", {
    credentials: "include",
  });

  return response.json();
}

export async function logout() {
  await fetch("/api/Auth/agent/signout", {
    method: "POST",
    credentials: "include",
  });
}

export async function signUp(
  companyName: string,
  name: string,
  email: string,
  password: string
) {
  const response = await fetch("/api/Tenant/sign-up", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tenant: {
        tenantId: crypto.randomUUID(),
        name: companyName,
      },
      admin: {
        username: email,
        name,
        email,
        avatarUrl: "",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userId: 0,
        externalUserId: "",
        type: "TempClient",
        password,
        roles: ["Agent"],
      },
    }),
  });

   if (!response.ok) {
    throw new Error("Unable to create account.");
  }

  
  return response.json();
}
