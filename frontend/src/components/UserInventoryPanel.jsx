export function UserInventoryPanel({ products, categoryMap, supplierMap }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Inventory Overview</h2>
        <span>{products.length} products</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Reorder</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{categoryMap[product.categoryId] || "-"}</td>
                <td>{supplierMap[product.supplierId] || "-"}</td>
                <td>{product.quantity}</td>
                <td>
                  <span className={`pill ${product.status.toLowerCase().replace(" ", "-")}`}>
                    {product.status}
                  </span>
                </td>
                <td>{product.suggestedReorderQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
