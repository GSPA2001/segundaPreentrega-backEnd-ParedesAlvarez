// Configuracion de .env
import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import { __dirname, PORT } from './utils.js'

import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import viewsRouter from './routes/views.routes.js'
import messageModel from './dao/models/messages.model.js'

// Configuración de express
const app = express()
app.use(express.json())

//MongoDB URL desde .env
const mongoose_URL = process.env.MONGOOSE_URI
// Nombre de la base de datos en MongoDB
const mongoDBName = 'ecommerce'

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// Configuración de rutas
app.get('/', (req,res) => res.render('index', { name: 'Tutor' }))
app.use('/home', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/products', productsRouter)

// Configuración de Mongoose
mongoose.set('strictQuery', false)

// Conexión a MongoDB y inicio servidor
mongoose.connect(mongoose_URL, {dbName: mongoDBName})
.then(() => {
    console.log('MongoDB connected 🔌')
    const httpServer = app.listen(PORT, () => console.log(`Listening ...✅`))

    // Configuración de socket.io
    const io = new Server(httpServer)

    app.set('socketio', io)

    io.on('connection', async socket => {
        console.log('Successful connection 🚀')
        socket.on('productList', data => {
            io.emit('updatedProducts', data)
        })
        
        async function getChats() { // Load the chats form DB
            try {
              let result = await messagesModel.find();
              return result
            } catch (error) {
              console.log('Error loading the chats: ', error);
            }
          }
          
          async function saveChats({sender, message}) { // Save chats to DB
            try {
              let result = await messagesModel.create({user:sender, message: message});
              return result
            } catch (error) {
              console.log('Error saving the chats: ', error);
            }
          
          }
          
          // Init
          
          let users = [];
          
          io.on("connection", (socket) => {
            console.log(`New socket connected with ID: ${socket.id}`)
            socket.on("login", async (name) => {
              console.log("The user with the following ID has logged in: ", name);
              socket.broadcast.emit("newUser", name); // We broadcast to everyone (except the sender), that a user has logged in
              users.push({ name, id: socket.id });
              let messages = await getChats(); // Get the messages from MongoDB
              console.log('Messages in the DB: ', messages)
              socket.emit("getMessages", messages); // Loads all the messages stored in memory to the new user
            });
          
            socket.on("message", async (messages) => {
              console.log(
                `The user ${messages.sender} sent the following message: ${messages.message}`
              );
              io.emit("newMessage", messages); // We send the message to everyone connected to the server
              await saveChats(messages); // Saves the message to the DB
            });
          
            socket.on("disconnect", () => {
              // If a user disconnects, we let everyone know
              let disconnectedUser = users.find((user) => user.id === socket.id);
              if (disconnectedUser) {
                io.emit("userDisconnect", disconnectedUser.name);
              }
            });
          });
          
    })
}) 
.catch(e => console.error('Error to connect 🚨🚨🚨', e))