import { readDatabase } from "../data/store.js";
import { hashText } from "../utils/hash.js";

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      const error = new Error("Email and password are required.");
      error.statusCode = 400;
      throw error;
    }

    const database = await readDatabase();
    const user = database.users.find((entry) => entry.email === email);

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
