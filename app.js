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
const server = require ("http").Server(app);
const io = require("socket.io")(server);

const app = express();

const PORT = 8080;
 
app.use(express.static('src/public'));

let messages = [
  {
    id:1,
    text: "Hola soy un mensaje",
    author: "Romina"
  }
]

app.use(express.json());

app.listen(PORT, () => {

console.log(`Servidor Express en ejecución en el puerto ${PORT}`);

});

const productManager = new ProductManager('products.json'); 

app.get('/api/products/:id', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const productId = parseInt (req.params.id);  
    const product = products.find((p) => p.id === productId);
    if (product) {
      res.json(product);
    } else {
    res.status(404).json ({ mensaje: 'Producto no encontrado' });
    }
  } catch (error) {
  res.status(500).send('Error al leer archivo');
  }
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

io.on("connection", (socket)=> {
  console.log("Un cliente se ha conectado");
  socket.emit("messages", messages);

  socket.on("newMessage", (data)=>{
    data.id = messages.lenght + 1;
    messages.push(data);
    
    io.emit("messages", messages);
  });
})
