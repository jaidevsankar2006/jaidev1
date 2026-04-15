import { Router } from "express";
import {
  createCategory,
  createProduct,
  createSupplier,
  deleteProduct,
  getBootstrapData,
  recordPurchase,
  recordSale,
  updateProductQuantity
} from "../controllers/inventoryController.js";

const router = Router();

router.get("/bootstrap", getBootstrapData);
router.post("/categories", createCategory);
router.post("/products", createProduct);
router.patch("/products/:id/quantity", updateProductQuantity);
router.delete("/products/:id", deleteProduct);
router.post("/suppliers", createSupplier);
router.post("/purchases", recordPurchase);
router.post("/sales", recordSale);

export default router;
