function ProductForm({ categories, suppliers, form, onChange, onSubmit }) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <input name="name" value={form.name} onChange={onChange} placeholder="Product name" required />
      <input name="sku" value={form.sku} onChange={onChange} placeholder="SKU" required />
      <select name="categoryId" value={form.categoryId} onChange={onChange} required>
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <select name="supplierId" value={form.supplierId} onChange={onChange} required>
        <option value="">Select supplier</option>
        {suppliers.map((supplier) => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </option>
        ))}
      </select>
      <input name="price" type="number" min="1" value={form.price} onChange={onChange} placeholder="Price" required />
      <input name="quantity" type="number" min="0" value={form.quantity} onChange={onChange} placeholder="Opening stock" required />
      <input name="minStock" type="number" min="0" value={form.minStock} onChange={onChange} placeholder="Min stock" required />
      <input name="maxStock" type="number" min="0" value={form.maxStock} onChange={onChange} placeholder="Max stock" required />
      <button className="primary-button" type="submit">
        Add Product
      </button>
    </form>
  );
}

export function ProductsPanel({
  products,
  categories,
  suppliers,
  categoryMap,
  supplierMap,
  form,
  onChange,
  onSubmit
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Products</h2>
        <span>{products.length} records</span>
      </div>
      <ProductForm
        categories={categories}
        suppliers={suppliers}
        form={form}
        onChange={onChange}
        onSubmit={onSubmit}
      />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
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
                <td>{product.sku}</td>
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
