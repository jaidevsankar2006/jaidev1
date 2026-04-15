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

function QuantityEditor({ product, value, onChange, onSave, onCancel }) {
  return (
    <div className="quantity-editor">
      <input
        className="quantity-input"
        min="0"
        onChange={(event) => onChange(product.id, event.target.value)}
        type="number"
        value={value}
      />
      <div className="quantity-actions">
        <button className="mini-button" onClick={() => onSave(product)} type="button">
          Save
        </button>
        <button className="ghost-button" onClick={() => onCancel(product)} type="button">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function ProductsPanel({
  products,
  categories,
  suppliers,
  categoryMap,
  supplierMap,
  filters,
  form,
  onDelete,
  onQuantityChange,
  onQuantityReset,
  onQuantitySave,
  quantityDrafts,
  onChange,
  onFilterChange,
  onSubmit
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Products</h2>
        <span>{products.length} records</span>
      </div>
      <div className="filters-grid">
        <input
          name="search"
          value={filters.search}
          onChange={onFilterChange}
          placeholder="Search by name or SKU"
        />
        <select name="status" value={filters.status} onChange={onFilterChange}>
          <option value="">All statuses</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Healthy">Healthy</option>
          <option value="Overstock">Overstock</option>
        </select>
        <select name="categoryId" value={filters.categoryId} onChange={onFilterChange}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{categoryMap[product.categoryId] || "-"}</td>
                <td>{supplierMap[product.supplierId] || "-"}</td>
                <td>
                  <QuantityEditor
                    onCancel={onQuantityReset}
                    onChange={onQuantityChange}
                    onSave={onQuantitySave}
                    product={product}
                    value={quantityDrafts[product.id] ?? product.quantity}
                  />
                </td>
                <td>
                  <span className={`pill ${product.status.toLowerCase().replace(" ", "-")}`}>
                    {product.status}
                  </span>
                </td>
                <td>{product.suggestedReorderQty}</td>
                <td>
                  <button
                    className="danger-button"
                    onClick={() => onDelete(product)}
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
