export function UsersPanel({ users, form, onChange, onSubmit }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Users</h2>
        <span>{users.length} accounts</span>
      </div>

      <form className="form-grid compact" onSubmit={onSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Full name"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email address"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Password"
          required
        />
        <select name="role" value={form.role} onChange={onChange} required>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button className="primary-button" type="submit">
          Add User
        </button>
      </form>

      <div className="list-stack">
        {users.map((user) => (
          <div className="list-row" key={user.id}>
            <div>
              <strong>{user.name}</strong>
              <p className="muted">{user.email}</p>
            </div>
            <span className="tag-chip">{user.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
