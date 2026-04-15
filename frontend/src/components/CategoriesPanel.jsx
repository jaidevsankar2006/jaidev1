export function CategoriesPanel({ categories, form, onChange, onSubmit }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Categories</h2>
        <span>{categories.length} groups</span>
      </div>

      <form className="inline-form" onSubmit={onSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Add a new category"
          required
        />
        <button className="primary-button" type="submit">
          Add Category
        </button>
      </form>

      <div className="tag-list">
        {categories.map((category) => (
          <span className="tag-chip" key={category.id}>
            {category.name}
          </span>
        ))}
      </div>
    </section>
  );
}
