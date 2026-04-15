export function RecentActivityPanel({ purchases, sales }) {
  return (
    <section className="panel-grid two-up">
      <article className="panel">
        <div className="panel-header">
          <h2>Recent Purchases</h2>
          <span>{purchases.length}</span>
        </div>
        <div className="list-stack">
          {purchases.slice(0, 6).map((purchase) => (
            <div className="list-row" key={purchase.id}>
              <div>
                <strong>{purchase.productName}</strong>
                <p className="muted">{purchase.supplierName}</p>
              </div>
              <span>{purchase.quantity} units on {purchase.date}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="panel">
        <div className="panel-header">
          <h2>Recent Sales</h2>
          <span>{sales.length}</span>
        </div>
        <div className="list-stack">
          {sales.slice(0, 6).map((sale) => (
            <div className="list-row" key={sale.id}>
              <div>
                <strong>{sale.productName}</strong>
                <p className="muted">Revenue Rs {sale.totalRevenue}</p>
              </div>
              <span>{sale.quantity} units on {sale.date}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
