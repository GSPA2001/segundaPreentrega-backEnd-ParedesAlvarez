import fs from 'fs';
import { __dirname } from '../../utils.js';

class ProductManager {
  #path
  #format

  constructor(path) {
    this.#path = path
    this.#format = 'utf-8'
    this.products = []
  }

  async getProducts() {
    try {
      return JSON.parse(await fs.promises.readFile(this.#path, this.#format, { encoding: 'utf-8', flag: 'r' }))
    } catch (error) {
      return []
    }
  }

  async addProduct(title, description, price, thumbnail, code, category, stock) {
    const products = await this.getProducts()

    const newProduct = {
      id: await this.#generateId(),
      title,
      description,
      price,
      thumbnail: thumbnail || [],
      code,
      category,
      stock,
      status: true,
    }

    if (await this.#validateProduct(newProduct)) {
      products.push(newProduct)
      await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'), { encoding: 'utf-8', flag: 'w' })
      this.products = products
      return newProduct
    }
  }

  async getProductById(id) {
    const products = await this.getProducts()
    const product = products.find(item => item.id === id)
    return product
  }

  async updateProduct(id, update) {
    const products = await this.getProducts()

    const index = products.findIndex(item => item.id === id)

    if (index !== -1) {
      const isValid = await this.#validateProduct(update)

      if (!isValid) {
        throw new Error('Invalid update')
      }

      products[index] = { ...products[index], ...update }

      await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'), { encoding: 'utf-8', flag: 'w' })
      this.products = products
      return products[index]
    }

    throw new Error('Product not found')
  }

  async deleteProduct(id) {
    const products = await this.getProducts()

    const filterProducts = products.filter(item => item.id !== id)

    if (products.length !== filterProducts.length) {
      await fs.promises.writeFile(this.#path, JSON.stringify(filterProducts, null, '\t'), { encoding: 'utf-8', flag: 'w' })
      this.products = filterProducts
      return true
    }

    return false
  }

  async #validateProduct(product) {
    const products = await this.getProducts()
    const duplicateProduct = await products.find(item => item.code === product.code)
    if (duplicateProduct !== undefined) {
      throw new Error('A product with the same code already exists')
    }
    return true
  }

  async #generateId() {
    const products = await this.getProducts()
    return products.length === 0 ? 1 : products[products.length - 1].id + 1
  }
}

export const productManager = new ProductManager(`${__dirname}../../api/products.json`)