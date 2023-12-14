import { Router } from 'express';
import { productManager } from '../dao/fsManagers/productManager.js'
import productModel from '../dao/models/products.model.js';
import messageModel from '../dao/models/messages.model.js';
import cartModel from '../dao/models/carts.model.js';

const router = Router()

// Ruta para renderizar la página principal
router.get('/', async (req, res) => {
    try {
        const allProducts = await productModel.find().lean().exec();
        console.log(allProducts.map(item => item._id));
        res.render('home', { allProducts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
})

// Ruta para la página de productos en tiempo real
router.get('/realTimeProducts', async (req, res) => {
    try {
        const allProducts = await productManager.getProducts()
        res.render('realTimeProducts', { allProducts })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
})

// Nueva ruta para mostrar todos los productos con paginación
/*router.get('/products', async (req, res) => {
    try {
      // Obtener todos los productos desde la base de datos (usando mongoose)
      const allProducts = await productModel.find().lean().exec();
  
      // Renderizar la vista 'products.handlebars' con la lista de productos
      res.render('products', { allProducts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', error: err.message });
    }
  })*/
router.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Puedes ajustar el límite de productos por página según tus necesidades

    try {
        const allProducts = await productModel.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec();

        res.render('products', { allProducts, currentPage: page });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Ruta para la página de carts en tiempo real
router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId).populate('products.product').lean().exec();

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.render('cart', { cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Ruta para la página de chat
router.get('/chat', async (req, res) => {
    try {
        const messages = await messageModel.find().lean().exec();
        res.render('chat', { messages });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
})

export default router