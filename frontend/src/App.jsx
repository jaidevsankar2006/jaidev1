import { useEffect, useState } from "react";
import { createRecord, fetchBootstrapData, login } from "./api/client.js";
import { AlertsPanel } from "./components/AlertsPanel.jsx";
import { InsightsPanel } from "./components/InsightsPanel.jsx";
import { LoginScreen } from "./components/LoginScreen.jsx";
import { ProductsPanel } from "./components/ProductsPanel.jsx";
import { StatCards } from "./components/StatCards.jsx";
import { SuppliersPanel } from "./components/SuppliersPanel.jsx";
import { TransactionsPanel } from "./components/TransactionsPanel.jsx";
import "./styles/app.css";

const initialLoginForm = {
  email: "admin@retailflow.com",
  password: "Admin@123"
};

const emptyProductForm = {
  name: "",
  sku: "",
  categoryId: "",
  supplierId: "",
  price: "",
  quantity: "",
  minStock: "",
  maxStock: ""
};

const emptySupplierForm = {
  name: "",
  contactPerson: "",
  phone: "",
  email: "",
  location: ""
};

const emptyPurchaseForm = {
  productId: "",
  supplierId: "",
  quantity: "",
  unitCost: "",
  date: new Date().toISOString().slice(0, 10)
};

const emptySaleForm = {
  productId: "",
  quantity: "",
  unitPrice: "",
  date: new Date().toISOString().slice(0, 10)
};

function createMap(items) {
  return Object.fromEntries(items.map((item) => [item.id, item.name]));
}

export default function App() {
  const [authForm, setAuthForm] = useState(initialLoginForm);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bootstrap, setBootstrap] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [supplierForm, setSupplierForm] = useState(emptySupplierForm);
  const [purchaseForm, setPurchaseForm] = useState(emptyPurchaseForm);
  const [saleForm, setSaleForm] = useState(emptySaleForm);

  useEffect(() => {
    if (!user) {
      return;
    }

    void refreshData();
  }, [user]);

  async function refreshData() {
    try {
      const data = await fetchBootstrapData();
      setBootstrap(data);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleInputChange(setter) {
    return (event) => {
      const { name, value } = event.target;
      setter((current) => ({ ...current, [name]: value }));
    };
  }

  async function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(authForm);
      setUser(result.user);
      setLoginError("");
    } catch (requestError) {
      setLoginError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreate(path, payload, resetForm) {
    try {
      await createRecord(path, payload);
      await refreshData();
      resetForm();
      setFeedback(`${path.slice(0, -1)} saved successfully.`);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      setFeedback("");
    }
  }

  if (!user) {
    return (
      <LoginScreen
        form={authForm}
        error={loginError}
        isSubmitting={isSubmitting}
        onChange={handleInputChange(setAuthForm)}
        onSubmit={handleLogin}
      />
    );
  }

  if (!bootstrap) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  const categoryMap = createMap(bootstrap.categories);
  const supplierMap = createMap(bootstrap.suppliers);

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Optimized Retail Inventory Management System</p>
          <h1>Welcome back, {user.name}</h1>
          <p className="muted">
            Track stock movement, reduce shortages, and present live inventory
            insights for your final project demo.
          </p>
        </div>
        <button
          className="secondary-button"
          onClick={() => {
            setUser(null);
            setBootstrap(null);
          }}
          type="button"
        >
          Logout
        </button>
      </section>

      {feedback ? <p className="success-banner">{feedback}</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      <StatCards stats={bootstrap.dashboard.stats} />
      <AlertsPanel alerts={bootstrap.dashboard.alerts} />
      <InsightsPanel products={bootstrap.products} topSelling={bootstrap.dashboard.topSelling} />

      <ProductsPanel
        products={bootstrap.products}
        categories={bootstrap.categories}
        suppliers={bootstrap.suppliers}
        categoryMap={categoryMap}
        supplierMap={supplierMap}
        form={productForm}
        onChange={handleInputChange(setProductForm)}
        onSubmit={(event) => {
          event.preventDefault();
          void handleCreate("products", productForm, () => setProductForm(emptyProductForm));
        }}
      />

      <SuppliersPanel
        suppliers={bootstrap.suppliers}
        form={supplierForm}
        onChange={handleInputChange(setSupplierForm)}
        onSubmit={(event) => {
          event.preventDefault();
          void handleCreate("suppliers", supplierForm, () => setSupplierForm(emptySupplierForm));
        }}
      />

      <TransactionsPanel
        products={bootstrap.products}
        suppliers={bootstrap.suppliers}
        purchaseForm={purchaseForm}
        saleForm={saleForm}
        onPurchaseChange={handleInputChange(setPurchaseForm)}
        onSaleChange={handleInputChange(setSaleForm)}
        onPurchaseSubmit={(event) => {
          event.preventDefault();
          void handleCreate("purchases", purchaseForm, () => setPurchaseForm(emptyPurchaseForm));
        }}
        onSaleSubmit={(event) => {
          event.preventDefault();
          void handleCreate("sales", saleForm, () => setSaleForm(emptySaleForm));
        }}
        purchases={bootstrap.purchases}
        sales={bootstrap.sales}
      />
    </main>
  );
}
