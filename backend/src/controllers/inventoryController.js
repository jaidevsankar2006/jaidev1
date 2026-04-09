import crypto from "node:crypto";
import { readDatabase, writeDatabase } from "../data/store.js";
import {
  buildDashboard,
  enrichProducts,
  validateStockAvailability
} from "../utils/inventory.js";

function createId(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString("hex")}`;
}

export async function getBootstrapData(_request, response, next) {
  try {
    const database = await readDatabase();
    response.json({
      categories: database.categories,
      suppliers: database.suppliers,
      products: enrichProducts(database),
      purchases: database.purchases,
      sales: database.sales,
      dashboard: buildDashboard(database)
    });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(request, response, next) {
  try {
    const database = await readDatabase();
    const product = {
      id: createId("prod"),
      name: request.body.name,
      sku: request.body.sku,
      categoryId: request.body.categoryId,
      supplierId: request.body.supplierId,
      price: Number(request.body.price),
      quantity: Number(request.body.quantity),
      minStock: Number(request.body.minStock),
      maxStock: Number(request.body.maxStock)
    };

    database.products.push(product);
    await writeDatabase(database);
    response.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function createSupplier(request, response, next) {
  try {
    const database = await readDatabase();
    const supplier = {
      id: createId("sup"),
      name: request.body.name,
      contactPerson: request.body.contactPerson,
      phone: request.body.phone,
      email: request.body.email,
      location: request.body.location
    };

    database.suppliers.push(supplier);
    await writeDatabase(database);
    response.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
}

export async function recordPurchase(request, response, next) {
  try {
    const database = await readDatabase();
    const purchase = {
      id: createId("pur"),
      productId: request.body.productId,
      supplierId: request.body.supplierId,
      quantity: Number(request.body.quantity),
      unitCost: Number(request.body.unitCost),
      date: request.body.date
    };

    const product = database.products.find((item) => item.id === purchase.productId);

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    product.quantity += purchase.quantity;
    database.purchases.unshift(purchase);
    await writeDatabase(database);
    response.status(201).json(purchase);
  } catch (error) {
    next(error);
  }
}

export async function recordSale(request, response, next) {
  try {
    const database = await readDatabase();
    const sale = {
      id: createId("sale"),
      productId: request.body.productId,
      quantity: Number(request.body.quantity),
      unitPrice: Number(request.body.unitPrice),
      date: request.body.date
    };

    const product = database.products.find((item) => item.id === sale.productId);

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    validateStockAvailability(product, sale.quantity);
    product.quantity -= sale.quantity;
    database.sales.unshift(sale);
    await writeDatabase(database);
    response.status(201).json(sale);
  } catch (error) {
    next(error);
  }
}
