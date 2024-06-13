const Product = require('../models/product.model')

const createNewProduct = (req, res) => {
    if(!req.body.pro_name || !req.body.img_url || !req.body.description || !req.body.price){
        res.status(400).send({message: "Content can not be empty."});
    }

    const ProductObj = new Product({
        pro_name: req.body.pro_name,
        img_url: req.body.img_url,
        description: req.body.description,
        price: req.body.price
    });

    Product.create(ProductObj, (err, data)=> {
        if(err){
            res.status(500).send({message: err.message || "Some error occured while creating"});
        }else res.status(201).send(data);
    })
}

const getAllProduct = (req, res) => {
    Product.getProduct((err,data) => {
        if(err){
            res.status(500).send({message: err.message || "Some error ocurred."});
        }else res.status(200).send(data);
    })
}

const updateProductCtrl = (req, res) => {
    if(!req.body.pro_name || !req.body.description || !req.body.price){
        res.status(400).send({message: "Content can not be empty."});
    }

    const data = {
        pro_name: req.body.pro_name,
        description: req.body.description,
        price: req.body.price
    };

    if(req.body.img_url){
        data.img_url = req.body.img_url;
    }

    Product.updateProduct(req.params.id, data, (err, result) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: "Not found product: " + req.params.id });
            } else {
                res.status(500).send({ message: "Error updating product: " + req.params.id });
            }
        } else {
            res.status(201).send(result);
        }
    })

}

const deleteProduct = (req, res)=> {
    Product.removeProduct(req.params.id, (err, result) => {
        if(err){
            if(err.kind == "not_found"){
                res.status(401).send(
                    {message: "Not found product: " + req.params.id}
                    );
            }
            else{
                res.status(500).send(
                    {message: "Error delete product: " + req.params.id}
                    );
            }
        }else{
            res.send(result);
        }
    })
}

const getPagination = (req, res) => {
    if(!req.body.page && !req.body.limit){
        res.status(400).send({message: "Content can not be empty."});
    }
    const data = {
        page: req.body.page,
        limit: req.body.limit
    }
    Product.pagination(data, (err, result) => {
        if(err){
            if(err.kind == "not_found"){
                res.status(404).send(
                    {message: "Not found pagination" }
                    );
            }
            else{
                res.status(500).send(
                    {message: "Error pagination product" }
                    );
            }
        }else{
            res.status(200).send(result);
        }
    })
}

module.exports = { 
    createNewProduct,
    getAllProduct, 
    updateProductCtrl,
    deleteProduct,
    getPagination
};