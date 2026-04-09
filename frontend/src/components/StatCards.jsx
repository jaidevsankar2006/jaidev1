export function StatCards({ stats }) {
  const items = [
    { label: "Products", value: stats.totalProducts },
    { label: "Units in Stock", value: stats.totalUnits },
    { label: "Suppliers", value: stats.totalSuppliers },
    { label: "Sales Revenue", value: `Rs ${stats.totalSalesRevenue}` },
    { label: "Purchase Spend", value: `Rs ${stats.totalPurchaseSpend}` },
    { label: "Stock Value", value: `Rs ${stats.totalStockValue}` }
  ];

  return (
    <section className="stats-grid">
      {items.map((item) => (
        <article className="stat-card" key={item.label}>
          <p>{item.label}</p>
          <h3>{item.value}</h3>
        </article>
      ))}
    </section>
  );
}
