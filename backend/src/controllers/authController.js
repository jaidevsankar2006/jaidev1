import crypto from "node:crypto";
import { createUserRecord, findUserByEmail } from "../data/store.js";
import { hashText } from "../utils/hash.js";

function createId(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString("hex")}`;
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      const error = new Error("Email and password are required.");
      error.statusCode = 400;
      throw error;
    }

    const user = await findUserByEmail(email);

    if (!user || user.passwordHash !== hashText(password)) {
      const error = new Error("Invalid credentials.");
      error.statusCode = 401;
      throw error;
    }

    response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: `demo-token-${user.role}`
    });
  } catch (error) {
    next(error);
  }
}

export async function register(request, response, next) {
  try {
    const name = String(request.body.name || "").trim();
    const email = String(request.body.email || "").trim().toLowerCase();
    const password = String(request.body.password || "");
    const role = "staff";

    if (!name || !email || !password) {
      const error = new Error("Name, email, and password are required.");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters.");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      const error = new Error("An account with this email already exists.");
      error.statusCode = 409;
      throw error;
    }

    const user = {
      id: createId("user"),
      name,
      email,
      role,
      passwordHash: hashText(password),
    };

    await createUserRecord(user);

    response.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: `demo-token-${user.role}`,
    });
  } catch (error) {
    next(error);
  }
}
