import { Router } from 'express';
import productModel from '../dao/models/products.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort } = req.query;

    // Validar que sort esté en el formato correcto
    if (sort && (!sort.startsWith('price:') || !['1', '-1'].includes(sort.split(':')[1]))) {
      return res.status(400).json({ status: 'error', error: 'Invalid sort parameter' });
    }

    console.log('Sort parameter:', sort);
    const sortOrder = sort ? parseInt(sort.split(':')[1]) : 1;

    // Aplicar paginación y ordenamiento
    const skip = (page - 1) * limit;
    const productsQuery = productModel
      .find({ price: { $gt: 0 } })
      .lean()
      .sort({ price: sortOrder })
      .skip(skip)
      .limit(limit);

    const products = await productsQuery;

    // Obtener el total de productos sin límite ni paginación
    const totalProducts = await productModel.countDocuments({ price: { $gt: 0 } });

    // Construir la respuesta estructurada
    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const response = {
      status: 'success',
      products: products,
      totalPages: totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: hasPrevPage ? `${req.baseUrl}?limit=${limit}&page=${page - 1}&sort=${sort || ''}` : null,
      nextLink: hasNextPage ? `${req.baseUrl}?limit=${limit}&page=${page + 1}&sort=${sort || ''}` : null,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;

    // Verificar si el pid tiene un formato válido de ID de MongoDB
    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ status: 'error', error: 'Invalid product ID format' });
    }

    const product = await productModel.findById(pid).lean().exec();

    if (!product) {
      return res.status(404).json({ status: 'error', error: 'The product does not exist' });
    }

    res.status(200).json({ status: 'success', payload: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Ruta para obtener productos por categoría
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;

    // Validar que la categoría sea válida (puedes adaptar según tus categorías)
    if (!['entradas', 'principales', 'extras'].includes(category)) {
      return res.status(400).json({ status: 'error', error: 'Invalid category' });
    }

    // Obtener parámetros de consulta
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sort = req.query.sort;

    // Realizar consulta por categoría
    const productsQuery = productModel.find({ category: category }).lean().skip(skip).limit(limit);

    // Aplicar ordenamiento si se proporciona
    if (sort) {
      productsQuery.sort(sort);
    }

    const products = await productsQuery;

    if (products.length === 0) {
      return res.status(404).json({ status: 'error', error: `No ${category} found` });
    }

    const totalProducts = await productModel.countDocuments({ category: category });
    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    // Construir la respuesta estructurada
    const response = {
      status: 'success',
      products: products,
      totalPages: totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: hasPrevPage ? `${req.baseUrl}/category/${category}?limit=${limit}&page=${page - 1}&sort=${sort || ''}` : null,
      nextLink: hasNextPage ? `${req.baseUrl}/category/${category}?limit=${limit}&page=${page + 1}&sort=${sort || ''}` : null,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const product = req.body;

    // Agregar validación adicional para otros campos del producto
    if (!product || !product.title || !product.price) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid data. Please provide title and price.'
      });
    }
    
    const addProduct = await productModel.create(product);
    const products = await productModel.find().lean().exec();
    req.app.get('socketio').emit('updatedProducts', products);
    res.status(201).json({ status: 'success', payload: addProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;

    // Verificar si el pid tiene un formato válido de ID de MongoDB
    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ status: 'error', error: 'Invalid product ID format' });
    }

    const updatedProduct = await productModel.findOneAndUpdate({ _id: pid }, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'The product does not exist' });
    }

    const updatedProducts = await productModel.find().lean().exec();
    req.app.get('socketio').emit('updatedProducts', updatedProducts);
    res.status(200).json({ message: `Updating the product: ${updatedProduct.title}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;

    // Verificar si el pid tiene un formato válido de ID de MongoDB
    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ status: 'error', error: 'Invalid product ID format' });
    }

    const result = await productModel.findByIdAndDelete(pid);

    if (!result) {
      return res.status(404).json({ status: 'error', error: `No such product with id: ${pid}` });
    }

    const updatedProducts = await productModel.find().lean().exec();
    req.app.get('socketio').emit('updatedProducts', updatedProducts);
    res.status(200).json({ message: `Product with id ${pid} removed successfully`, products: updatedProducts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

export default router;