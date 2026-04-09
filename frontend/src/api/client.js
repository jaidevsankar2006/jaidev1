const API_BASE_URL = "http://localhost:5000/api";

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
