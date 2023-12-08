import fs from 'fs'
import { __dirname } from '../../utils.js'
import { productManager } from './productManager.js'
import cartModel from '../dao/models/carts.model.js';

class CartManager {
    #path
    #format
    constructor(path) {
        this.#path = path
        this.#format = 'utf-8'
        this.carts = []
    }

    async getCarts() {
      try {
        const data = await fs.promises.readFile(this.#path, this.#format);
        return JSON.parse(data);
    } catch (error) {
        console.log('Error: file not found');
        return [];
    }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(item => item.id === id);
        return cart;
    }

    async #generateId() {
        const carts = await this.getCarts()
        return carts.length === 0 ? 1 : carts[carts.length - 1].id + 1
    }

    async addCart(products = []) {
        const carts = await this.getCarts();
        const newCart = {
            id: await this.#generateId(),
            products: products
        };
        carts.push(newCart);
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, '\t'));
        this.carts = carts;
        return newCart;
    }

    async addProductsToCart(cartId, productId) {
        try {
          const product = await productManager.getProductById(productId);
    
          if (!product) {
            return { status: 'error', error: `The product with id:${productId} does not exist` };
          }
    
          let carts = await this.getCarts();
          const cart = await this.getCartById(cartId);
    
          if (!cart) {
            return { status: 'error', error: 'Invalid cart' };
          }
    
          const productExistsInCart = cart.products.find(item => item.product.toString() === productId);
    
          if (productExistsInCart) {
            productExistsInCart.quantity += 1;
          } else {
            const newProduct = {
              product: productId,
              quantity: 1,
            };
            cart.products.push(newProduct);
          }
    
          // Utilizar findByIdAndUpdate para simplificar la lógica de actualización
          await cartModel.findByIdAndUpdate(cartId, { products: cart.products }, { new: true });
    
          return { status: 'success', payload: cart };
        } catch (err) {
          console.error(err);
          return { status: 'error', error: err.message };
        }
    }
}
    
export const cartManager = new CartManager(`${__dirname}../../api/carts.json`);