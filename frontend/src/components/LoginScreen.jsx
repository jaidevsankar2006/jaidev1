export function LoginScreen({
  authMode,
  loginForm,
  registerForm,
  loginError,
  registerError,
  notice,
  isLoggingIn,
  isRegistering,
  onModeChange,
  onLoginChange,
  onRegisterChange,
  onLoginSubmit,
  onRegisterSubmit,
}) {
  return (
    <div className="login-shell">
      <div className="auth-shell">
        <div className="role-switch">
          <button
            className={authMode === "login" ? "role-button active" : "role-button"}
            onClick={() => onModeChange("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={authMode === "register" ? "role-button active" : "role-button"}
            onClick={() => onModeChange("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <div className="auth-grid single">
          <div className="login-card">
            <div>
              <p className="eyebrow">Secure Access</p>
              <h1>Retail Inventory Control</h1>
              <p className="muted">
                {authMode === "login"
                  ? "Sign in with your account to open the correct dashboard automatically."
                  : "Create a new account, then log in to access the inventory system."}
              </p>
            </div>

            {authMode === "login" ? (
              <form className="stack" onSubmit={onLoginSubmit}>
                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    value={loginForm.email}
                    onChange={onLoginChange}
                    placeholder="Enter your email"
                    required
                  />
                </label>

                <label>
                  Password
                  <input
                    name="password"
                    type="password"
                    value={loginForm.password}
                    onChange={onLoginChange}
                    placeholder="Enter your password"
                    required
                  />
                </label>

                {loginError ? <p className="error-text">{loginError}</p> : null}

                <button className="primary-button" disabled={isLoggingIn} type="submit">
                  {isLoggingIn ? "Signing in..." : "Login"}
                </button>
              </form>
            ) : (
              <form className="stack" onSubmit={onRegisterSubmit}>
                <label>
                  Full Name
                  <input
                    name="name"
                    value={registerForm.name}
                    onChange={onRegisterChange}
                    placeholder="Enter your full name"
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    value={registerForm.email}
                    onChange={onRegisterChange}
                    placeholder="Enter your email"
                    required
                  />
                </label>

                <label>
                  Password
                  <input
                    name="password"
                    type="password"
                    value={registerForm.password}
                    onChange={onRegisterChange}
                    placeholder="Create your password"
                    required
                  />
                </label>

                {registerError ? <p className="error-text">{registerError}</p> : null}

                <button className="primary-button" disabled={isRegistering} type="submit">
                  {isRegistering ? "Creating..." : "Register"}
                </button>
              </form>
            )}

            {notice ? <p className="success-banner">{notice}</p> : null}

            <div className="demo-panel">
              <strong>
                {authMode === "login" ? "Login Access" : "Register Access"}
              </strong>
              <span>
                {authMode === "login"
                  ? "`admin@retailflow.com` / `Admin@123`"
                  : "New registrations create normal user accounts."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
