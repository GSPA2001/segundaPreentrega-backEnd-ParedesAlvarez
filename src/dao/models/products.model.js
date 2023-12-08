import mongoose from 'mongoose';

//mongoose.pluralize(null)

const productsCollection = 'products'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: false },
    //thumbnails: { type: [String], default: [] },
    code: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true },
})

const productModel = mongoose.model(productsCollection, productSchema) 

export default productModel