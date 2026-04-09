import { Router } from "express";
import {
  createProduct,
  createSupplier,
  getBootstrapData,
  recordPurchase,
  recordSale
} from "../controllers/inventoryController.js";

const router = Router();

router.get("/bootstrap", getBootstrapData);
router.post("/products", createProduct);
router.post("/suppliers", createSupplier);
router.post("/purchases", recordPurchase);
router.post("/sales", recordSale);

export default router;
