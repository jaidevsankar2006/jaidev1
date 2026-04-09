function TransactionForm({
  title,
  products,
  suppliers,
  form,
  onChange,
  onSubmit,
  showSupplier,
  actionLabel
}) {
  return (
    <article className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
      </div>
      <form className="form-grid compact" onSubmit={onSubmit}>
        <select name="productId" value={form.productId} onChange={onChange} required>
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {showSupplier ? (
          <select name="supplierId" value={form.supplierId} onChange={onChange} required>
            <option value="">Select supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        ) : null}
        <input name="quantity" type="number" min="1" value={form.quantity} onChange={onChange} placeholder="Quantity" required />
        <input
          name={showSupplier ? "unitCost" : "unitPrice"}
          type="number"
          min="1"
          value={showSupplier ? form.unitCost : form.unitPrice}
          onChange={onChange}
          placeholder={showSupplier ? "Unit cost" : "Unit price"}
          required
        />
        <input name="date" type="date" value={form.date} onChange={onChange} required />
        <button className="primary-button" type="submit">
          {actionLabel}
        </button>
      </form>
    </article>
  );
}

export function TransactionsPanel({
  products,
  suppliers,
  purchaseForm,
  saleForm,
  onPurchaseChange,
  onSaleChange,
  onPurchaseSubmit,
  onSaleSubmit,
  purchases,
  sales
}) {
  return (
    <section className="panel-grid two-up">
      <TransactionForm
        title="Record Purchase"
        products={products}
        suppliers={suppliers}
        form={purchaseForm}
        onChange={onPurchaseChange}
        onSubmit={onPurchaseSubmit}
        showSupplier
        actionLabel="Save Purchase"
      />
      <TransactionForm
        title="Record Sale"
        products={products}
        suppliers={suppliers}
        form={saleForm}
        onChange={onSaleChange}
        onSubmit={onSaleSubmit}
        actionLabel="Save Sale"
      />
      <article className="panel">
        <div className="panel-header">
          <h2>Recent Purchases</h2>
          <span>{purchases.length}</span>
        </div>
        <div className="list-stack">
          {purchases.slice(0, 5).map((purchase) => (
            <div className="list-row" key={purchase.id}>
              <strong>{purchase.productId}</strong>
              <span>
                {purchase.quantity} units on {purchase.date}
              </span>
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
          {sales.slice(0, 5).map((sale) => (
            <div className="list-row" key={sale.id}>
              <strong>{sale.productId}</strong>
              <span>
                {sale.quantity} units on {sale.date}
              </span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
