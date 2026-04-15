import { useEffect, useState } from "react";
import { createRecord, deleteRecord, fetchBootstrapData, login, register, updateRecord } from "./api/client.js";
import { AlertsPanel } from "./components/AlertsPanel.jsx";
import { CategoriesPanel } from "./components/CategoriesPanel.jsx";
import { InsightsPanel } from "./components/InsightsPanel.jsx";
import { LoginScreen } from "./components/LoginScreen.jsx";
import { ProductsPanel } from "./components/ProductsPanel.jsx";
import { RecentActivityPanel } from "./components/RecentActivityPanel.jsx";
import { ReportsPanel } from "./components/ReportsPanel.jsx";
import { StatCards } from "./components/StatCards.jsx";
import { SuppliersPanel } from "./components/SuppliersPanel.jsx";
import { TransactionsPanel } from "./components/TransactionsPanel.jsx";
import { UserInventoryPanel } from "./components/UserInventoryPanel.jsx";
import "./styles/app.css";

const initialLoginForm = {
  email: "",
  password: ""
};

const initialRegisterForm = {
  name: "",
  email: "",
  password: ""
};

const emptyCategoryForm = {
  name: ""
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

const createInitialPurchaseForm = () => ({
  productId: "",
  supplierId: "",
  quantity: "",
  unitCost: "",
  date: new Date().toISOString().slice(0, 10)
});

const createInitialSaleForm = () => ({
  productId: "",
  quantity: "",
  unitPrice: "",
  date: new Date().toISOString().slice(0, 10)
});

const initialFilters = {
  search: "",
  status: "",
  categoryId: ""
};

function createMap(items) {
  return Object.fromEntries(items.map((item) => [item.id, item.name]));
}

export default function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [bootstrap, setBootstrap] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [supplierForm, setSupplierForm] = useState(emptySupplierForm);
  const [purchaseForm, setPurchaseForm] = useState(createInitialPurchaseForm());
  const [saleForm, setSaleForm] = useState(createInitialSaleForm());
  const [quantityDrafts, setQuantityDrafts] = useState({});

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
    setIsLoggingIn(true);

    try {
      const result = await login(authForm);
      setUser(result.user);
      setLoginError("");
      setRegisterError("");
      setAuthNotice("");
    } catch (requestError) {
      setLoginError(requestError.message);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setIsRegistering(true);

    try {
      await register(registerForm);
      setRegisterForm(initialRegisterForm);
      setRegisterError("");
      setLoginError("");
      setAuthMode("login");
      setAuthNotice("Account created successfully. You can log in now.");
    } catch (requestError) {
      setRegisterError(requestError.message);
    } finally {
      setIsRegistering(false);
    }
  }

  async function handleCreate(path, payload, resetForm, successLabel) {
    try {
      await createRecord(path, payload);
      await refreshData();
      resetForm();
      setFeedback(`${successLabel} saved successfully.`);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      setFeedback("");
    }
  }

  async function handleDeleteProduct(product) {
    const confirmed = window.confirm(
      `Delete ${product.name}? Products with sales or purchase history cannot be deleted.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const result = await deleteRecord(`products/${product.id}`);
      await refreshData();
      setFeedback(result.message || `${product.name} deleted successfully.`);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      setFeedback("");
    }
  }

  function handleQuantityDraftChange(productId, value) {
    setQuantityDrafts((current) => ({
      ...current,
      [productId]: value,
    }));
  }

  function handleQuantityDraftReset(product) {
    setQuantityDrafts((current) => ({
      ...current,
      [product.id]: String(product.quantity),
    }));
  }

  async function handleQuantitySave(product) {
    const nextQuantity = quantityDrafts[product.id] ?? String(product.quantity);

    try {
      const result = await updateRecord(`products/${product.id}/quantity`, {
        quantity: Number(nextQuantity),
      });
      await refreshData();
      setFeedback(result.message || `${product.name} quantity updated successfully.`);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      setFeedback("");
    }
  }

  if (!user) {
    return (
      <LoginScreen
        authMode={authMode}
        loginForm={authForm}
        registerForm={registerForm}
        loginError={loginError}
        registerError={registerError}
        notice={authNotice}
        isLoggingIn={isLoggingIn}
        isRegistering={isRegistering}
        onModeChange={(mode) => {
          setAuthMode(mode);
          setLoginError("");
          setRegisterError("");
          setAuthNotice("");
        }}
        onLoginChange={handleInputChange(setAuthForm)}
        onRegisterChange={handleInputChange(setRegisterForm)}
        onLoginSubmit={handleLogin}
        onRegisterSubmit={handleRegister}
      />
    );
  }

  if (!bootstrap) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  const categoryMap = createMap(bootstrap.categories);
  const supplierMap = createMap(bootstrap.suppliers);
  const normalizedSearch = filters.search.trim().toLowerCase();
  const filteredProducts = bootstrap.products.filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.sku.toLowerCase().includes(normalizedSearch);
    const matchesStatus = !filters.status || product.status === filters.status;
    const matchesCategory = !filters.categoryId || product.categoryId === filters.categoryId;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Optimized Retail Inventory Management System</p>
          <h1>Welcome back, {user.name}</h1>
          <p className="muted">
            Manage products, suppliers, live stock movement, and reorder insights
            from one full-stack dashboard.
          </p>
          <div className="hero-meta">
            <span className="tag-chip">Role: {user.role}</span>
            <span className="tag-chip">Frontend + Backend ready</span>
          </div>
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
      <ReportsPanel
        stats={bootstrap.dashboard.stats}
        reorderQueue={bootstrap.dashboard.reorderQueue}
        recentMovements={bootstrap.recentMovements}
      />
      <AlertsPanel alerts={bootstrap.dashboard.alerts} />
      <InsightsPanel
        products={bootstrap.products}
        topSelling={bootstrap.dashboard.topSelling}
      />

      {user.role === "admin" ? (
        <>
          <section className="panel-grid two-up">
            <CategoriesPanel
              categories={bootstrap.categories}
              form={categoryForm}
              onChange={handleInputChange(setCategoryForm)}
              onSubmit={(event) => {
                event.preventDefault();
                void handleCreate("categories", categoryForm, () => setCategoryForm(emptyCategoryForm), "Category");
              }}
            />

            <SuppliersPanel
              suppliers={bootstrap.suppliers}
              form={supplierForm}
              onChange={handleInputChange(setSupplierForm)}
              onSubmit={(event) => {
                event.preventDefault();
                void handleCreate("suppliers", supplierForm, () => setSupplierForm(emptySupplierForm), "Supplier");
              }}
            />
          </section>

          <ProductsPanel
            products={filteredProducts}
            categories={bootstrap.categories}
            suppliers={bootstrap.suppliers}
            categoryMap={categoryMap}
            supplierMap={supplierMap}
        filters={filters}
        form={productForm}
        onDelete={(product) => {
          void handleDeleteProduct(product);
        }}
        onQuantityChange={handleQuantityDraftChange}
        onQuantityReset={handleQuantityDraftReset}
        onQuantitySave={(product) => {
          void handleQuantitySave(product);
        }}
        quantityDrafts={quantityDrafts}
        onChange={handleInputChange(setProductForm)}
        onFilterChange={handleInputChange(setFilters)}
        onSubmit={(event) => {
              event.preventDefault();
              void handleCreate("products", productForm, () => setProductForm(emptyProductForm), "Product");
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
              void handleCreate("purchases", purchaseForm, () => setPurchaseForm(createInitialPurchaseForm()), "Purchase");
            }}
            onSaleSubmit={(event) => {
              event.preventDefault();
              void handleCreate("sales", saleForm, () => setSaleForm(createInitialSaleForm()), "Sale");
            }}
            purchases={bootstrap.purchases}
            sales={bootstrap.sales}
          />
        </>
      ) : (
        <>
          <UserInventoryPanel
            products={filteredProducts}
            categoryMap={categoryMap}
            supplierMap={supplierMap}
          />
          <RecentActivityPanel
            purchases={bootstrap.purchases}
            sales={bootstrap.sales}
          />
        </>
      )}
    </main>
  );
}
