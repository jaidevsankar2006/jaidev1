import crypto from "node:crypto";
import {
  createUserRecord,
  createCategoryRecord,
  createProductRecord,
  createPurchaseRecord,
  createSupplierRecord,
  createSaleRecord,
  deleteProductRecord,
  findCategoryById,
  findCategoryByName,
  findProductById,
  findProductBySku,
  findSupplierByEmail,
  findSupplierById,
  readDatabase,
  updateProductQuantityRecord,
} from "../data/store.js";
import {
  buildDashboard,
  enrichTransactions,
  enrichProducts
} from "../utils/inventory.js";
import { hashText } from "../utils/hash.js";

function createId(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString("hex")}`;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function parseNumberField(value, label, { min = 0, integer = false } = {}) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    const error = new Error(`${label} must be a valid number.`);
    error.statusCode = 400;
    throw error;
  }

  if (integer && !Number.isInteger(parsed)) {
    const error = new Error(`${label} must be a whole number.`);
    error.statusCode = 400;
    throw error;
  }

  if (parsed < min) {
    const error = new Error(`${label} must be at least ${min}.`);
    error.statusCode = 400;
    throw error;
  }

  return parsed;
}

function requireField(value, label) {
  const normalized = normalizeText(value);

  if (!normalized) {
    const error = new Error(`${label} is required.`);
    error.statusCode = 400;
    throw error;
  }

  return normalized;
}

export async function getBootstrapData(_request, response, next) {
  try {
    const database = await readDatabase();
    const transactions = enrichTransactions(database);

    response.json({
      users: database.users.map(({ passwordHash, ...user }) => user),
      categories: database.categories,
      suppliers: database.suppliers,
      products: enrichProducts(database),
      purchases: transactions.purchases,
      sales: transactions.sales,
      recentMovements: transactions.recentMovements,
      dashboard: buildDashboard(database)
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(request, response, next) {
  try {
    const name = requireField(request.body.name, "User name");
    const email = requireField(request.body.email, "User email").toLowerCase();
    const password = requireField(request.body.password, "Password");
    const role = requireField(request.body.role, "Role").toLowerCase();
    const allowedRoles = new Set(["admin", "staff"]);

    if (!allowedRoles.has(role)) {
      const error = new Error("Role must be admin or staff.");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters.");
      error.statusCode = 400;
      throw error;
    }

    const duplicate = await findUserByEmail(email);

    if (duplicate) {
      const error = new Error("User email already exists.");
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
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(request, response, next) {
  try {
    const name = requireField(request.body.name, "Category name");
    const duplicate = await findCategoryByName(name);

    if (duplicate) {
      const error = new Error("Category already exists.");
      error.statusCode = 409;
      throw error;
    }

    const category = {
      id: createId("cat"),
      name,
    };

    await createCategoryRecord(category);
    response.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(request, response, next) {
  try {
    const name = requireField(request.body.name, "Product name");
    const sku = requireField(request.body.sku, "SKU");
    const categoryId = requireField(request.body.categoryId, "Category");
    const supplierId = requireField(request.body.supplierId, "Supplier");
    const duplicate = await findProductBySku(sku);

    if (duplicate) {
      const error = new Error("SKU must be unique.");
      error.statusCode = 409;
      throw error;
    }

    if (!(await findCategoryById(categoryId))) {
      const error = new Error("Category not found.");
      error.statusCode = 404;
      throw error;
    }

    if (!(await findSupplierById(supplierId))) {
      const error = new Error("Supplier not found.");
      error.statusCode = 404;
      throw error;
    }

    const minStock = parseNumberField(request.body.minStock, "Minimum stock", {
      min: 0,
      integer: true,
    });
    const maxStock = parseNumberField(request.body.maxStock, "Maximum stock", {
      min: 0,
      integer: true,
    });

    if (maxStock < minStock) {
      const error = new Error("Maximum stock must be greater than or equal to minimum stock.");
      error.statusCode = 400;
      throw error;
    }

    const product = {
      id: createId("prod"),
      name,
      sku,
      categoryId,
      supplierId,
      price: parseNumberField(request.body.price, "Price", { min: 0 }),
      quantity: parseNumberField(request.body.quantity, "Opening stock", {
        min: 0,
        integer: true,
      }),
      minStock,
      maxStock,
    };

    await createProductRecord(product);
    response.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function createSupplier(request, response, next) {
  try {
    const email = requireField(request.body.email, "Supplier email");
    const duplicate = await findSupplierByEmail(email);

    if (duplicate) {
      const error = new Error("Supplier email already exists.");
      error.statusCode = 409;
      throw error;
    }

    const supplier = {
      id: createId("sup"),
      name: requireField(request.body.name, "Supplier name"),
      contactPerson: requireField(request.body.contactPerson, "Contact person"),
      phone: requireField(request.body.phone, "Phone"),
      email,
      location: requireField(request.body.location, "Location"),
    };

    await createSupplierRecord(supplier);
    response.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(request, response, next) {
  try {
    const productId = requireField(request.params.id, "Product");

    if (!(await findProductById(productId))) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    const deletedProduct = await deleteProductRecord(productId);
    response.json({
      message: `${deletedProduct.name} deleted successfully.`,
      productId,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProductQuantity(request, response, next) {
  try {
    const productId = requireField(request.params.id, "Product");
    const quantity = parseNumberField(request.body.quantity, "Quantity", {
      min: 0,
      integer: true,
    });

    const updatedProduct = await updateProductQuantityRecord(productId, quantity);

    response.json({
      message: `${updatedProduct.name} quantity updated successfully.`,
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function recordPurchase(request, response, next) {
  try {
    const productId = requireField(request.body.productId, "Product");
    const supplierId = requireField(request.body.supplierId, "Supplier");
    const purchase = {
      id: createId("pur"),
      productId,
      supplierId,
      quantity: parseNumberField(request.body.quantity, "Quantity", {
        min: 1,
        integer: true,
      }),
      unitCost: parseNumberField(request.body.unitCost, "Unit cost", { min: 1 }),
      date: requireField(request.body.date, "Purchase date"),
    };

    await createPurchaseRecord(purchase);
    response.status(201).json(purchase);
  } catch (error) {
    next(error);
  }
}

export async function recordSale(request, response, next) {
  try {
    const productId = requireField(request.body.productId, "Product");
    const sale = {
      id: createId("sale"),
      productId,
      quantity: parseNumberField(request.body.quantity, "Quantity", {
        min: 1,
        integer: true,
      }),
      unitPrice: parseNumberField(request.body.unitPrice, "Unit price", { min: 1 }),
      date: requireField(request.body.date, "Sale date"),
    };

    await createSaleRecord(sale);
    response.status(201).json(sale);
  } catch (error) {
    next(error);
  }
}
