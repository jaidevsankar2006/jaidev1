export function StatCards({ stats }) {
  function formatCurrency(value) {
    return `Rs ${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2
    })}`;
  }

  const items = [
    { label: "Products", value: stats.totalProducts },
    { label: "Units in Stock", value: stats.totalUnits },
    { label: "Suppliers", value: stats.totalSuppliers },
    { label: "Sales Revenue", value: formatCurrency(stats.totalSalesRevenue) },
    { label: "Purchase Spend", value: formatCurrency(stats.totalPurchaseSpend) },
    { label: "Stock Value", value: formatCurrency(stats.totalStockValue) }
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
