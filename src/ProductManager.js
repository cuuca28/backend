const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    addProduct(product) {
      const products = this.getProducts();
      if (!products) {
      products = [];}
      product.id = this.getNextId(products);
      products.push(product);  
      this.saveProducts(products);
    } 

    getProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            return [];
        }
    }

    getProductById(productId) {
        const products = this.getProducts();
        return products.find(product => product.id === productId);
    }

    updateProduct(productId, updatedProduct) {
        const products = this.getProducts();
        const index = products.findIndex(product => product.id === productId);
        if (index !== -1) {
            products[index] = updatedProduct;
            this.saveProducts(products);
            return true;
        }
        return false;
    }

    deleteProduct(productId) {
        const products = this.getProducts();
        const index = products.findIndex(product => product.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            this.saveProducts(products);
            return true;
        }
        return false;
    }

    saveProducts(products) {
        const data = JSON.stringify(products, null, 4);
        fs.writeFileSync(this.path, data, 'utf8');
    }

    getNextId(products) {
        if (products.length === 0) {
            return 1;
        }
        const maxId = Math.max(...products.map(product => product.id));
        return maxId + 1;
    }
}

const productManager = new ProductManager('./products.json');

const newProduct = {
    title: 'Hojillas',
    description: 'Hojillas para quemar el cigarrillo de forma controlada',
    price: 100,
    code: 'P1',
    stock: 100,
  };
productManager.addProduct(newProduct);

productManager.addProduct({
    title: 'Tabaco sabor miel 50g',
    description: 'Tabaco con el mejor saborizante a miel natural',
    price: 250,
    code: 'P2',
    stock: 50,
  });

  productManager.addProduct({
    title: 'Tabaco sabor menta 50g',
    description: 'Tabaco con el mejor saborizante a menta fresca',
    price: 250,
    code: 'P3',
    stock: 50,
  });

  productManager.addProduct({
    title: 'Tabaco sabor frutos rojos 50g',
    description: 'Tabaco con el mejor saborizante natural a frutos rojos',
    price: 250,
    code: 'P4',
    stock: 30,
  });

  productManager.addProduct({
    title: 'Tabaco sabor uva 50g',
    description: 'Tabaco con el mejor saborizante a uva merlot',
    price: 250,
    code: 'P5',
    stock: 50,
  });  

  productManager.addProduct({
    title: 'Tabaco sabor miel 100g',
    description: 'Tabaco con el mejor saborizante a miel natural',
    price: 500,
    code: 'P6',
    stock: 40,
  });

  productManager.addProduct({
    title: 'Tabaco sabor menta 100g',
    description: 'Tabaco con el mejor saborizante a menta fresca',
    price: 500,
    code: 'P7',
    stock: 40,
  });  

  productManager.addProduct({
    title: 'Tabaco sabor frutos rojos 100g',
    description: 'Tabaco con el mejor saborizante natural a frutos rojos',
    price: 500,
    code: 'P8',
    stock: 20,
  });

  productManager.addProduct({
    title: 'Tabaco sabor uva 100g',
    description: 'Tabaco con el mejor saborizante a uva merlot',
    price: 500,
    code: 'P9',
    stock: 40,
  });   

  productManager.addProduct({
    title: 'Hojillas XL',
    description: 'Hojillas tamaño XL con pegamento natural',
    price: 150,
    code: 'P10',
    stock: 70,
  }); 

const allProducts = productManager.getProducts();
console.log(allProducts);

const productId = 1;
const product = productManager.getProductById(productId);
console.log(product);

const updatedProduct = {
    id: productId,
    title: 'Producto Actualizado',
    description: 'Descripción actualizada',
    price: 12.99,
    code: 'XYZ789',
    stock: 50
};
productManager.updateProduct(productId, updatedProduct);

const productIdToDelete = 1;
productManager.deleteProduct(productIdToDelete);

module.exports = ProductManager;