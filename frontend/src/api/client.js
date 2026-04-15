const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "/_/backend/api" : "/api");

async function parseResponse(response) {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

export async function login(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  return parseResponse(response);
}

export async function register(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function fetchBootstrapData() {
  const response = await fetch(`${API_BASE_URL}/inventory/bootstrap`);
  return parseResponse(response);
}

export async function createRecord(path, payload) {
  const response = await fetch(`${API_BASE_URL}/inventory/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function updateRecord(path, payload) {
  const response = await fetch(`${API_BASE_URL}/inventory/${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function deleteRecord(path) {
  const response = await fetch(`${API_BASE_URL}/inventory/${path}`, {
    method: "DELETE",
  });

  return parseResponse(response);
}
