export function SuppliersPanel({ suppliers, form, onChange, onSubmit }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Suppliers</h2>
        <span>{suppliers.length} partners</span>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <input name="name" value={form.name} onChange={onChange} placeholder="Supplier name" required />
        <input
          name="contactPerson"
          value={form.contactPerson}
          onChange={onChange}
          placeholder="Contact person"
          required
        />
        <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" required />
        <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" required />
        <input name="location" value={form.location} onChange={onChange} placeholder="Location" required />
        <button className="primary-button" type="submit">
          Add Supplier
        </button>
      </form>

      <div className="list-stack">
        {suppliers.map((supplier) => (
          <div className="list-row" key={supplier.id}>
            <div>
              <strong>{supplier.name}</strong>
              <p>{supplier.contactPerson}</p>
            </div>
            <div className="aligned-end">
              <span>{supplier.phone}</span>
              <span>{supplier.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
