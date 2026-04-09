export function AlertsPanel({ alerts }) {
  return (
    <section className="panel-grid two-up">
      <article className="panel">
        <div className="panel-header">
          <h2>Low Stock Alerts</h2>
          <span>{alerts.lowStock.length} items</span>
        </div>
        <div className="list-stack">
          {alerts.lowStock.length ? (
            alerts.lowStock.map((product) => (
              <div className="list-row" key={product.id}>
                <strong>{product.name}</strong>
                <span>
                  {product.quantity} left / min {product.minStock}
                </span>
              </div>
            ))
          ) : (
            <p className="muted">No low-stock products right now.</p>
          )}
        </div>
      </article>

      <article className="panel">
        <div className="panel-header">
          <h2>Overstock Alerts</h2>
          <span>{alerts.overstock.length} items</span>
        </div>
        <div className="list-stack">
          {alerts.overstock.length ? (
            alerts.overstock.map((product) => (
              <div className="list-row" key={product.id}>
                <strong>{product.name}</strong>
                <span>
                  {product.quantity} in stock / max {product.maxStock}
                </span>
              </div>
            ))
          ) : (
            <p className="muted">No overstock products right now.</p>
          )}
        </div>
      </article>
    </section>
  );
}
