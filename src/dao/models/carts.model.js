import mongoose from 'mongoose';

const cartsCollection = 'carts'

const cartSchema = new mongoose.Schema({
  products: {
    type: [{
      _id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
        validate: {
          validator: Number.isInteger,
          message: '{VALUE} is not an integer value',
        },
      },
    }],
    default: [],
  },
});

const cartModel = mongoose.model(cartsCollection, cartSchema);

export default cartModel;