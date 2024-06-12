module.exports = (app)=>{
    const product_controller = require("../controllers/product.controller");
    var router = require("express").Router();
    router.get("/", product_controller.getAllProduct);
    router.post("/addProduct",product_controller.createNewProduct);
    router.put("/updateProduct/:id",product_controller.updateProductCtrl);
    router.delete("/deleteProduct/:id",product_controller.deleteProduct);
    router.get("/pagination",product_controller.getPagination);
    app.use("/api/product", router);
};