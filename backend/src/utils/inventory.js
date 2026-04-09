function average(numbers) {
  if (!numbers.length) {
    return 0;
  }

  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

export function enrichProducts(database) {
  return database.products.map((product) => {
    const sales = database.sales.filter((sale) => sale.productId === product.id);
    const purchases = database.purchases.filter(
      (purchase) => purchase.productId === product.id,
    );
    const monthlySales = average(sales.map((sale) => sale.quantity));
    const reorderPoint = Math.max(product.minStock, Math.ceil(monthlySales * 1.2));
    const suggestedReorderQty = Math.max(
      0,
      Math.ceil(reorderPoint + product.minStock - product.quantity),
    );

    return {
      ...product,
      stockValue: product.quantity * product.price,
      status:
        product.quantity <= product.minStock
          ? "Low Stock"
          : product.quantity >= product.maxStock
            ? "Overstock"
            : "Healthy",
      salesCount: sales.length,
      purchaseCount: purchases.length,
      reorderPoint,
      suggestedReorderQty,
      monthlySales: Number(monthlySales.toFixed(2)),
    };
  });
}

export function buildDashboard(database) {
  const products = enrichProducts(database);
  const totalStockValue = products.reduce((sum, product) => sum + product.stockValue, 0);
  const totalUnits = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStock = products.filter((product) => product.status === "Low Stock");
  const overstock = products.filter((product) => product.status === "Overstock");
  const totalSalesRevenue = database.sales.reduce(
    (sum, sale) => sum + sale.quantity * sale.unitPrice,
    0,
  );
  const totalPurchaseSpend = database.purchases.reduce(
    (sum, purchase) => sum + purchase.quantity * purchase.unitCost,
    0,
  );

  const topSelling = [...products]
    .sort((left, right) => right.monthlySales - left.monthlySales)
    .slice(0, 5);

  return {
    stats: {
      totalProducts: products.length,
      totalUnits,
      totalSuppliers: database.suppliers.length,
      totalSalesRevenue,
      totalPurchaseSpend,
      totalStockValue: Number(totalStockValue.toFixed(2)),
      lowStockCount: lowStock.length,
      overstockCount: overstock.length,
    },
    alerts: {
      lowStock,
      overstock,
    },
    topSelling,
  };
}

export function validateStockAvailability(product, quantity) {
  if (product.quantity < quantity) {
    const error = new Error(`Insufficient stock for ${product.name}.`);
    error.statusCode = 400;
    throw error;
  }
}
