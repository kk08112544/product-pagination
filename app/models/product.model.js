const pool = require('./db');
const fs = require("fs");

const Product = function(product) {
    this.pro_name = product.pro_name;
    this.img_url = product.img_url;
    this.description = product.description;
    this.price = product.price;
};

Product.getProduct = (result) => {
    pool.query(`SELECT * FROM product`, (err, res) => {
        if (err) {
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        result(null, res.rows);
    });
};

Product.create = (ProductObj, result) => {
    pool.query("INSERT INTO product (pro_name, img_url, description, price) VALUES ($1, $2, $3, $4) RETURNING id", 
    [ProductObj.pro_name, ProductObj.img_url, ProductObj.description, ProductObj.price], (err, res) => {
            if (err) {
                console.log("Query error: " + err);
                result(err, null);
                return;
            }
            result(null,{ id : res.rows[0].id, ...ProductObj});
            console.log("Created Product:", { id : res.rows[0].id, ...ProductObj});
        });
};


const removeOldImage = (id, result) => {
    pool.query("SELECT * FROM product WHERE id = $1", [id], (err, res) => {
        if (err) {
            console.log("Error: " + err);
            result(err, null);
            return;
        }
        if (res.rows.length) {
            let filePath = __basedir + "/assets/" + res.rows[0].img_url;
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlink(filePath, (e) => {
                        if (e) {
                            console.log("Error: " + e);
                            return;
                        } else {
                            console.log("File: " + res.rows[0].img_url + " was removed");
                            return;
                        }
                    });
                } else {
                    console.log("File: " + res.rows[0].img_url + " not found.");
                    return;
                }
            } catch (error) {
                console.log(error);
                return;
            }
        }
    });
};


Product.updateProduct = (id, data, result) => {
    if (data.img_url) {
        removeOldImage(id);
    }

    const updateFields = ['pro_name', 'description','price'];
    const updateValues = [data.pro_name, data.description, data.price];

    if (data.img_url) {
        updateFields.push('img_url');
        updateValues.push(data.img_url);
    }

    const setClause = updateFields.map((field, index) => `${field} = $${index + 1}`).join(", ");

    pool.query(
        `UPDATE product SET ${setClause} WHERE id = $${updateFields.length + 1}`,
        [...updateValues, id],
        (err, res) => {
            if (err) {
                console.log("Error: " + err);
                result(err, null);
                return;
            }
            if (res.rowCount == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Update Product: " + { id: id, ...data });
            result(null, { id: id, ...data });
        }
    );
};

Product.removeProduct = (id, result) => {
    pool.query("DELETE FROM product WHERE id = $1 RETURNING id", [id], (err, res) => {
        if (err) {
            console.log("Query error: " + err);
            result(err, null);
            return;
        }
        if (res.rowCount === 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Deleted Product id:", res.rows[0].id);
        result(null, { id: res.rows[0].id });
    });
};

Product.pagination = (data, result)=> {
    const offset = (data.page - 1)*data.limit;
    pool.query(`SELECT * FROM product LIMIT $1 OFFSET $2`,[data.limit,offset], (err,res) => {
        if(err){
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.rowCount === 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res.rows);
    })
}

Product.getProductId = (id, result) => {
    pool.query("SELECT * FROM product WHERE id = $1", [id], (err, res) => {
        if(err){
            console.log("Error: ", err);
            result(err, null);
            return;
        }
        if (res.rowCount === 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res.rows[0]);
    })
}


module.exports = Product;