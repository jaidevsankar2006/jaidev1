export function LoginScreen({ form, error, isSubmitting, onChange, onSubmit }) {
  return (
    <div className="login-shell">
      <div className="login-card">
        <div>
          <p className="eyebrow">Final Year Project</p>
          <h1>RetailFlow Inventory</h1>
          <p className="muted">
            Manage stock, track sales, record purchases, and generate smarter
            reorder decisions from one dashboard.
          </p>
        </div>

        <form className="stack" onSubmit={onSubmit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="admin@retailflow.com"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Enter password"
              required
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="demo-panel">
          <strong>Demo Accounts</strong>
          <span>Admin: admin@retailflow.com / Admin@123</span>
          <span>Staff: staff@retailflow.com / Staff@123</span>
        </div>
      </div>
    </div>
  );
}
