import { pool } from "./db.js";

function normalizeRows(rows) {
  return rows.map((row) => ({ ...row }));
}

export async function readDatabase() {
  const [
    [users],
    [categories],
    [suppliers],
    [products],
    [purchases],
    [sales],
  ] = await Promise.all([
    pool.query(`
      SELECT id, name, email, password_hash AS passwordHash, role
      FROM users
      ORDER BY name ASC
    `),
    pool.query(`
      SELECT id, name
      FROM categories
      ORDER BY name ASC
    `),
    pool.query(`
      SELECT id, name, contact_person AS contactPerson, phone, email, location
      FROM suppliers
      ORDER BY name ASC
    `),
    pool.query(`
      SELECT
        id,
        name,
        sku,
        category_id AS categoryId,
        supplier_id AS supplierId,
        price,
        quantity,
        min_stock AS minStock,
        max_stock AS maxStock
      FROM products
      ORDER BY name ASC
    `),
    pool.query(`
      SELECT
        id,
        product_id AS productId,
        supplier_id AS supplierId,
        quantity,
        unit_cost AS unitCost,
        DATE_FORMAT(date, '%Y-%m-%d') AS date
      FROM purchases
      ORDER BY date DESC, created_at DESC
    `),
    pool.query(`
      SELECT
        id,
        product_id AS productId,
        quantity,
        unit_price AS unitPrice,
        DATE_FORMAT(date, '%Y-%m-%d') AS date
      FROM sales
      ORDER BY date DESC, created_at DESC
    `),
  ]);

  return {
    users: normalizeRows(users),
    categories: normalizeRows(categories),
    suppliers: normalizeRows(suppliers),
    products: normalizeRows(products),
    purchases: normalizeRows(purchases),
    sales: normalizeRows(sales),
  };
}

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `
      SELECT id, name, email, password_hash AS passwordHash, role
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email],
  );

  return rows[0] || null;
}

export async function createUserRecord(user) {
  await pool.query(
    `
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `,
    [user.id, user.name, user.email, user.passwordHash, user.role],
  );

  return user;
}

export async function createCategoryRecord(category) {
  await pool.query("INSERT INTO categories (id, name) VALUES (?, ?)", [
    category.id,
    category.name,
  ]);

  return category;
}

export async function createSupplierRecord(supplier) {
  await pool.query(
    `
      INSERT INTO suppliers (id, name, contact_person, phone, email, location)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      supplier.id,
      supplier.name,
      supplier.contactPerson,
      supplier.phone,
      supplier.email,
      supplier.location,
    ],
  );

  return supplier;
}

export async function createProductRecord(product) {
  await pool.query(
    `
      INSERT INTO products (
        id,
        name,
        sku,
        category_id,
        supplier_id,
        price,
        quantity,
        min_stock,
        max_stock
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      product.id,
      product.name,
      product.sku,
      product.categoryId,
      product.supplierId,
      product.price,
      product.quantity,
      product.minStock,
      product.maxStock,
    ],
  );

  return product;
}

export async function findCategoryById(id) {
  const [rows] = await pool.query(
    "SELECT id, name FROM categories WHERE id = ? LIMIT 1",
    [id],
  );

  return rows[0] || null;
}

export async function findCategoryByName(name) {
  const [rows] = await pool.query(
    "SELECT id, name FROM categories WHERE LOWER(name) = LOWER(?) LIMIT 1",
    [name],
  );

  return rows[0] || null;
}

export async function findSupplierById(id) {
  const [rows] = await pool.query(
    `
      SELECT id, name, contact_person AS contactPerson, phone, email, location
      FROM suppliers
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  return rows[0] || null;
}

export async function findSupplierByEmail(email) {
  const [rows] = await pool.query(
    `
      SELECT id, name, contact_person AS contactPerson, phone, email, location
      FROM suppliers
      WHERE LOWER(email) = LOWER(?)
      LIMIT 1
    `,
    [email],
  );

  return rows[0] || null;
}

export async function findProductById(id) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        name,
        sku,
        category_id AS categoryId,
        supplier_id AS supplierId,
        price,
        quantity,
        min_stock AS minStock,
        max_stock AS maxStock
      FROM products
      WHERE id = ?
      LIMIT 1
    `,
    [id],
  );

  return rows[0] || null;
}

export async function findProductBySku(sku) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        name,
        sku,
        category_id AS categoryId,
        supplier_id AS supplierId,
        price,
        quantity,
        min_stock AS minStock,
        max_stock AS maxStock
      FROM products
      WHERE LOWER(sku) = LOWER(?)
      LIMIT 1
    `,
    [sku],
  );

  return rows[0] || null;
}

export async function updateProductQuantityRecord(productId, quantity) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [productRows] = await connection.query(
      "SELECT id, name FROM products WHERE id = ? FOR UPDATE",
      [productId],
    );
    const product = productRows[0];

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    await connection.query(
      "UPDATE products SET quantity = ? WHERE id = ?",
      [quantity, productId],
    );

    await connection.commit();
    return {
      ...product,
      quantity,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteProductRecord(productId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [productRows] = await connection.query(
      "SELECT id, name FROM products WHERE id = ? FOR UPDATE",
      [productId],
    );
    const product = productRows[0];

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    const [[purchaseUsage]] = await connection.query(
      "SELECT COUNT(*) AS count FROM purchases WHERE product_id = ?",
      [productId],
    );
    const [[saleUsage]] = await connection.query(
      "SELECT COUNT(*) AS count FROM sales WHERE product_id = ?",
      [productId],
    );

    if (purchaseUsage.count > 0 || saleUsage.count > 0) {
      const error = new Error("Cannot delete a product with purchase or sales history.");
      error.statusCode = 400;
      throw error;
    }

    await connection.query("DELETE FROM products WHERE id = ?", [productId]);
    await connection.commit();

    return product;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function createPurchaseRecord(purchase) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [productRows] = await connection.query(
      "SELECT id, name, quantity FROM products WHERE id = ? FOR UPDATE",
      [purchase.productId],
    );
    const product = productRows[0];

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    const [supplierRows] = await connection.query(
      "SELECT id FROM suppliers WHERE id = ? LIMIT 1",
      [purchase.supplierId],
    );

    if (!supplierRows[0]) {
      const error = new Error("Supplier not found.");
      error.statusCode = 404;
      throw error;
    }

    await connection.query(
      `
        INSERT INTO purchases (id, product_id, supplier_id, quantity, unit_cost, date)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        purchase.id,
        purchase.productId,
        purchase.supplierId,
        purchase.quantity,
        purchase.unitCost,
        purchase.date,
      ],
    );
    await connection.query(
      "UPDATE products SET quantity = quantity + ? WHERE id = ?",
      [purchase.quantity, purchase.productId],
    );
    await connection.commit();
    return purchase;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function createSaleRecord(sale) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [productRows] = await connection.query(
      "SELECT id, name, quantity FROM products WHERE id = ? FOR UPDATE",
      [sale.productId],
    );
    const product = productRows[0];

    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    if (product.quantity < sale.quantity) {
      const error = new Error(`Insufficient stock for ${product.name}.`);
      error.statusCode = 400;
      throw error;
    }

    await connection.query(
      `
        INSERT INTO sales (id, product_id, quantity, unit_price, date)
        VALUES (?, ?, ?, ?, ?)
      `,
      [sale.id, sale.productId, sale.quantity, sale.unitPrice, sale.date],
    );
    await connection.query(
      "UPDATE products SET quantity = quantity - ? WHERE id = ?",
      [sale.quantity, sale.productId],
    );
    await connection.commit();
    return sale;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
