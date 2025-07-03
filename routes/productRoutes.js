const express = require("express");
const { auth } = require("../middleware/auth");
const {
  addProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { Roles } = require("../utility/constant");

const router = express.Router();

router.post("/addProduct", auth(Roles.ADMIN), addProduct);
router.post("/list", listProducts);
router.get("/:id", getProductById);
router.put("/edit/:id", auth(Roles.ADMIN), updateProduct);
router.delete("/delete/:id", auth(Roles.ADMIN), deleteProduct);

module.exports = router;
