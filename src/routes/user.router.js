import express from 'express';
const userRouter = express.Router();

const users = [];

userRouter.get('/', (req, res) => { 
    res.render('main');
});

userRouter.post('/', (req, res) => { 
    const { nombre, correo, contrasena } = req.body;
    
    users.push({ nombre, correo, contrasena });
    
    console.log(users);
    res.redirect('/');
});

export { userRouter };