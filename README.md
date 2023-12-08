# Segunda Pre Entrega

- Curso de programación BackEnd - CoderHouse

## Author

- Gisel Sthefania Paredes Alvarez

## Métodos node utilizados 

Instalación:
* npm init -y (e instalación de nodemon)
* npm install express
* npm install express-handlebars
* npm install mongoose
* npm install socket.io
* npm install dotenv (para el archivo .env)
* Para visualización, en terminal: npm run start

## Funcionamiento de los endpoints:
* Al acceder a http://localhost:8080/api/products, se obtienen todos los productos.
* Al visitar http://localhost:8080/api/products?limit=5, se muestran solo los primeros 5 productos.
* Al ingresar a http://localhost:8080/api/products/6562154e1559fe5e7c2adf4a, se muestra solo el producto con ID 2.
* Al probar con un ID inexistente, por ejemplo, http://localhost:8080/api/products/999, se devuelve un mensaje indicando que el producto no se encontró.

* Al acceder a http://localhost:8080/api/carts, se obtienen todos los carritos.
* Al ingresar a http://localhost:8080/api/carts/65622128f61cdd3d80b8237d, se muestra solo el carrito con ID 1.

## Endpoints de handlebars
* Para el funcionamiento de index.handlebars http://localhost:8080/
* Para el funcionamiento de home.handlebars http://localhost:8080/home
* Para el funcionamiento de realTimeProducts.handlebars http://localhost:8080/home/realtimeproducts 
* Para el funcionamiento de chat.handlebars http://localhost:8080/home/chat 

## Para probar el código puede usar Postman
### Enviar Solicitudes a las Rutas Específicas
Una vez que el servidor esté en ejecución, abre Postman:

#### Para Productos:
- **Obtener todos los productos:** Utiliza el método GET a la URL http://localhost:8080/api/products
- **Obtener un producto por ID:** Utiliza el método GET a la URL http://localhost:8080/api/products/6562154e1559fe5e7c2adf4a, se muestra solo el producto con ID 2.
- **Eliminar un producto por ID:** Utiliza el método DELETE a la URL http://localhost:8080/api/products/{_id}, donde {_id} es el ID del producto que deseas eliminar.

#### Para Carritos:
- **Crear un nuevo carrito:** Utiliza el método POST a la URL http://localhost:8080/api/carts
- **Obtener un carrito por ID:** Utiliza el método GET a la URL http://localhost:8080/api/carts/65622128f61cdd3d80b8237d, donde {id} es el carrito 1.

#### Para Handlebars:
- **Página principal:** Utiliza el método GET a la URL http://localhost:8080/
- **Página home:** Utiliza el método GET a la URL http://localhost:8080/home/
- **Página realTimeProducts:** Utiliza el método GET a la URL http://localhost:8080/home/realtimeproducts
- **Página de chat:** Utiliza el método GET a la URL http://localhost:8080/home/chat


## Used by

Este proyecto es solamente de uso para ejemplo de clase, su estructura no puede ser o debiera ser tomada necesariamente como propuesta para un proyecto real.
Este proyecto es para cumplir con el Segunda Pre Entrega, del curso de programación backend de coderhouse.