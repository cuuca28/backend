function generateUniqueId(existingIds) {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000); 
  } while (existingIds.includes(newId));
  return newId;
}

const express = require('express');
const ProductManager = require('./src/ProductManager');
const http = require('http');
const fs = require('fs');
const existingProductIds = [];
const existingCartIds = [];


const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('¡Fin!\n');
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`El servidor está escuchando en el puerto ${PORT}`);
});

const app = express(); 
const bodyParser = require('body-parser')
app.use(express.json());

const productManager = new ProductManager(); 

app.get('/api/products', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});


app.post('/agregar-producto', (req, res) => {
  const newProduct = req.body;
  newProduct.id = generateUniqueId(existingProductIds); 
});


const carrito = [];

app.post('/agregar-al-carrito/:producto', (req, res) => {
  const producto = req.params.producto;
  carrito.push(producto);
  res.json({ mensaje: `Se agregó "${producto}" al carrito.` });
});


app.delete('/eliminar-del-carrito/:producto', (req, res) => {
  const producto = req.params.producto;
  const indice = carrito.indexOf(producto);
  if (indice !== -1) {
    carrito.splice(indice, 1);
    res.json({ mensaje: `Se eliminó "${producto}" del carrito.` });
  } else {
    res.json({ mensaje: `No se encontró "${producto}" en el carrito.` });
  }
});

