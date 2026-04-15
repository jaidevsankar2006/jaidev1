function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export function ReportsPanel({ stats, reorderQueue, recentMovements }) {
  return (
    <section className="panel-grid two-up">
      <article className="panel">
        <div className="panel-header">
          <h2>Inventory Snapshot</h2>
        </div>
        <div className="metric-grid">
          <div className="metric-card">
            <span>Categories</span>
            <strong>{stats.totalCategories}</strong>
          </div>
          <div className="metric-card">
            <span>Low Stock Items</span>
            <strong>{stats.lowStockCount}</strong>
          </div>
          <div className="metric-card">
            <span>Overstock Items</span>
            <strong>{stats.overstockCount}</strong>
          </div>
          <div className="metric-card">
            <span>Stock Value</span>
            <strong>{formatCurrency(stats.totalStockValue)}</strong>
          </div>
        </div>
      </article>

      <article className="panel">
        <div className="panel-header">
          <h2>Priority Reorders</h2>
        </div>
        <div className="list-stack">
          {reorderQueue.length ? (
            reorderQueue.map((product) => (
              <div className="list-row" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <p className="muted">Current stock {product.quantity}</p>
                </div>
                <span>Order {product.suggestedReorderQty}</span>
              </div>
            ))
          ) : (
            <p className="muted">No priority reorders right now.</p>
          )}
        </div>
      </article>

      <article className="panel panel-span">
        <div className="panel-header">
          <h2>Recent Inventory Movement</h2>
          <span>{recentMovements.length} updates</span>
        </div>
        <div className="list-stack">
          {recentMovements.length ? (
            recentMovements.map((movement) => (
              <div className="list-row" key={movement.id}>
                <div>
                  <strong>{movement.productName}</strong>
                  <p className="muted">
                    {movement.type === "purchase"
                      ? `Purchased from ${movement.supplierName}`
                      : "Sale recorded"}
                  </p>
                </div>
                <span>
                  {movement.quantity} units on {movement.date}
                </span>
              </div>
            ))
          ) : (
            <p className="muted">No inventory movement available yet.</p>
          )}
        </div>
      </article>
    </section>
  );
}
