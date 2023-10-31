const express = require('express');
const ProductManager = require('./src/ProductManager');

const app = express();
const port = 8080; 
const bodyParser = require('body-parser')
app.use(express.json());

const productManager = new ProductManager(); 

app.get('/products', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('products', async (req, res) => {
  try {
  const product = await productManager.getProducts();
  const limited = req.query.limit;
  if (limited) {
  const limitedProducts = product.slice (0,limited);
  res.json(limitedProducts);
  } else {
  res.json(product);
  }
  } catch (error) {
  res.status(500).send('Error al leer archivo');
  }
  });

app.listen(port, () => {
  console.log(`Servidor Express en ejecución en el puerto ${port}`);
});

const productsRouter = express.Router();
app.use('/api/products', productsRouter);

productsRouter.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'))
  res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  const product = products.find(p => p.id == productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

productsRouter.post('/', (req, res) => {
  const newProduct = req.body;
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  newProduct.id = generateUniqueId(products);
  products.push(newProduct);
  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

productsRouter.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  const productIndex = products.findIndex(p => p.id == productId);
  if (productIndex !== -1) {
    updatedProduct.id = productId;
    products[productIndex] = updatedProduct;
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

productsRouter.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  const productIndex = products.findIndex(p => p.id == productId);
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

const cartsRouter = express.Router();
app.use('/api/carts', cartsRouter);

cartsRouter.post('/', (req, res) => {
  const newCart = req.body;
  newCart.id = generateUniqueIdForCarts();
  newCart.products = [];
  fs.writeFileSync('carrito.json', JSON.stringify(newCart, null, 2));
  res.status(201).json(newCart);
});

cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = JSON.parse(fs.readFileSync('carrito.json', 'utf8'));
  res.json(cart.products);
});

cartsRouter.post('/:cid/products/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const productInfo = req.body;
  const cart = JSON.parse(fs.readFileSync('carrito.json', 'utf8'));

  const existingProduct = cart.products.find(item => item.product === productId);

  if (existingProduct) {
    existingProduct.quantity += productInfo.quantity;
  } else {
    cart.products.push({
      product: productId,
      quantity: productInfo.quantity,
    });
  }

  fs.writeFileSync('carrito.json', JSON.stringify(cart, null, 2));
  res.status(201).json(cart);
});
