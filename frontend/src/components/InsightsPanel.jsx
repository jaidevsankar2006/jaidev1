export function InsightsPanel({ products, topSelling }) {
  const reorderList = products
    .filter((product) => product.suggestedReorderQty > 0)
    .sort((left, right) => right.suggestedReorderQty - left.suggestedReorderQty);

  return (
    <section className="panel-grid two-up">
      <article className="panel">
        <div className="panel-header">
          <h2>Reorder Suggestions</h2>
        </div>
        <div className="list-stack">
          {reorderList.length ? (
            reorderList.map((product) => (
              <div className="list-row" key={product.id}>
                <strong>{product.name}</strong>
                <span>
                  Reorder {product.suggestedReorderQty} units, monthly sales {product.monthlySales}
                </span>
              </div>
            ))
          ) : (
            <p className="muted">No reorder suggestions at the moment.</p>
          )}
        </div>
      </article>

      <article className="panel">
        <div className="panel-header">
          <h2>Top Selling Products</h2>
        </div>
        <div className="list-stack">
          {topSelling.map((product) => (
            <div className="list-row" key={product.id}>
              <strong>{product.name}</strong>
              <span>{product.monthlySales} average units sold</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
