![Banner](extras/PRODUCT_MANAGER_BANNER.jpg)

## Objetivo

Desarrollar el backend de un ecommerce totalmente funcional aplicando los conocimientos provistos por el curso de Coderhouse de Programación Backend con Node.js.

## Patrones de diseño utilizados(adicionales a los implementados por Express)

- **Singleton**: Se utiliza para la conexión a la base de datos de MongoDB.
- **DAO**: Se utiliza para el acceso a datos.
- **Repository**: Se utiliza para el acceso a datos como capa de servicios.
- **Factory**: Se utiliza para el manejo de la persistencia de los datos, en base a la configuración del archivo _.env_.

## Tecnologías utilizadas

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **Socket.io**
- **Handlebars**
- **PassportJs**
- **JWT**
- **Nodemailer(with gmail)**
- **Faker js**
- **Winston (for logging)**
- **Mocha**
- **Chai**
- **Supertest**
- **Multer**
- **Swagger**

## Intrucciones de instalación

> #### Requisitos:
>
> - Tener instalado **Node.js**
> - Tener instalado **Postman** (opcional)
> - Tener instalado **Git** (opcional)

- Clonar el repositorio
- Instalar dependencias con `npm install`
- <u>**IMPORTANTE:**</u> Agregar en el archivo _.env_ las variables de entorno faltantes

  ```.bash
    # Admin credentials
    ADMIN_USER=
    ADMIN_PASS=

    # Mongo credentials
    MONGO_USER=
    MONGO_PASS=
    MONGO_HOST=

    # Github credentials
    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=
    GITHUB_CALLBACK_URL=

    # Google credentials
    GMAIL_MAIL_USER=
    GMAIL_MAIL_PASS=
  ```

## Ejecutar servidor

- Con **NODE**: Ejecutar el comando `npm run start` (ejecuta el archivo _app.js_ con node)
- CON **NODEMON**: Ejecutar el comando `npm run dev` (ejecuta el archivo _app.js_ con nodemon)

> #### Nota:
>
> Para modificar el ambiente de ejecución, modificar la variable de entorno `NODE_ENV` en el archivo _.env_.
> Las posibles opciones son: `development` y `production`. Los test se ejecutan en un ambiente de testeo `test`.

## Estructura de carpetas

```bash
.
├── docs
│   ├── carts
│   ├── products
│   └── session
├── extras
├── logs
│   ├── dev
│   ├── prod
│   └── test
├── postman
├── src
│   ├── config
│   ├── constants
│   ├── controllers
│   ├── dao
│   │   ├── fileSystem
│   │   │   ├── managers
│   │   │   └── utils
│   │   └── mongo
│   │       ├── managers
│   │       └── models
│   ├── dto
│   ├── errors
│   │   ├── constants
│   │   └── handlers
│   ├── listeners
│   ├── middlewares
│   ├── mocks
│   ├── public
│   │   ├── assets
│   │   ├── css
│   │   └── js
│   ├── routes
│   ├── services
│   │   └── repositories
│   ├── utils
│   │   └── validations
│   └── views
│       ├── layouts
│       └── partials
└── test
    ├── cart
    ├── dao
    │   └── mongo
    │       └── managers
    ├── product
    ├── session
    ├── users
    └── utils
```

---

## Rutas de vistas

| **Request type** | **Path**          | **Body** | **Query params**    | **Path variables**                  | **Output** |
| ---------------- | ----------------- | -------- | ------------------- | ----------------------------------- | ---------- |
| GET              | /                 |          |                     |                                     | HTML       |
| GET              | /realtimeproducts |          |                     |                                     | HTML       |
| GET              | /chat             |          |                     |                                     | HTML       |
| GET              | /products         |          |                     | limit, page, sort, category, status | HTML       |
| GET              | /cart/:cid        |          |                     | cid: Cart ID                        | HTML       |
| GET              | /register         |          |                     |                                     | HTML       |
| GET              | /login            |          |                     |                                     | HTML       |
| GET              | /restorePassword  |          |                     |                                     | HTML       |
| GET              | /profile          |          |                     |                                     | HTML       |
| GET              | /myCart           |          |                     |                                     | HTML       |
| GET              | /restoreRequest   |          | e: Error            |                                     | HTML       |
| GET              | /restorePassword  |          | token: RestoreToken |                                     | HTML       |

## Ruta de archivos estáticos

| **Request type** | **Path** | **Body** | **Query params** | **Path variables** | **Output** |
| ---------------- | -------- | -------- | ---------------- | ------------------ | ---------- |
| GET              | /        |          |                  |                    | Files      |
| GET              | /uploads |          |                  |                    | Files      |

## Rutas de documentación

| **Request type** | **Path** | **Body** | **Query params** | **Path variables** | **Output** |
| ---------------- | -------- | -------- | ---------------- | ------------------ | ---------- |
| GET              | /apiDocs |          |                  |                    | HTML       |

## Documentación de la API:

| **Request type** | **Path**                       | **Body** | **multipart/form-data** | **Query params**                    | **Path variables**              | **Output** |
| ---------------- | ------------------------------ | -------- | ----------------------- | ----------------------------------- | ------------------------------- | ---------- |
| GET              | /healthcheck                   |          |                         |                                     |                                 | Object     |
| GET              | /api/products/                 |          |                         | limit, page, sort, category, status |                                 | Object     |
| GET              | /api/products/:pid             |          |                         |                                     | pid : Product ID                | Object     |
| POST             | /api/products/                 | Object   |                         |                                     |                                 | Object     |
| PUT              | /api/products/:pid             | Object   |                         |                                     | pid : Product ID                | Object     |
| DELETE           | /api/products/:pid             |          |                         |                                     | pid : Product ID                | Object     |
| POST             | /api/products/:pid/images      |          | products                |                                     | pid : Product ID                | Object     |
| DELETE           | /api/products/:pid/images/:iid |          |                         |                                     | pid : Product ID, iid: Image ID | Object     |
| DELETE           | /api/products/:pid             |          |                         |                                     | pid : Product ID                | Object     |
| POST             | /api/carts/                    |          |                         |                                     |                                 | Object     |
| GET              | /api/carts/:cid                |          |                         |                                     | cid : Cart ID                   | Object     |
| POST             | /api/carts/:cid/product/:pid   | Object   |                         |                                     | cid : Cart ID, pid : Product ID | Object     |
| DELETE           | /api/carts/:cid/products/:pid  |          |                         |                                     | cid : Cart ID, pid : Product ID | Object     |
| PUT              | /api/carts/:cid                | Object   |                         |                                     | cid : Cart ID                   | Object     |
| PUT              | /api/carts/:cid/products/:pid  | Object   |                         |                                     | cid : Cart ID, pid : Product ID | Object     |
| DELETE           | /api/carts/:cid                |          |                         |                                     | cid : Cart ID                   | Object     |
| PUT              | /api/carts/:cid/purchase       |          |                         |                                     | cid : Cart ID                   | Object     |
| POST             | /api/sessions/register         | Object   |                         |                                     |                                 | Object     |
| POST             | /api/sessions/registerUsers    | Object   |                         |                                     |                                 | Object     |
| POST             | /api/sessions/login            | Object   |                         |                                     |                                 | Object     |
| GET              | /api/sessions/logout           |          |                         |                                     |                                 | Object     |
| POST             | /api/sessions/restoreRequest   | Object   |                         |                                     |                                 | Object     |
| PUT              | /api/sessions/restorePassword  | Object   |                         |                                     |                                 | Object     |
| GET              | /api/sessions/current          |          |                         |                                     |                                 | Object     |
| GET              | /mockingproducts               |          |                         |                                     |                                 | Object     |
| GET              | /loggerTest                    |          |                         |                                     |                                 | Object     |
| PUT              | /api/users/premium/:uid        |          |                         |                                     | uid: User ID                    | Object     |
| POST             | /api/users/:uid/documents      |          | documents, profiles     |                                     | uid: User ID                    | Object     |
| GET              | /api/users/                    |          |                         |                                     |                                 | Object     |
| DELETE           | /api/users/                    |          |                         |                                     |                                 | Object     |
| DELETE           | /api/users/:uid                |          |                         |                                     | uid: User ID                    | Object     |

### + GET /healthcheck

Retorna un objeto con la información del estado del servidor.

#### Return

```js
{
    message: String | "OK" , "ERROR",
    uptime: Integer,
    responsetime: Array,
    timestamp: Integer,
}
```

### + GET /mockingproducts

Retorna un array de 100 productos generados con faker js

#### Return

```js
payload: {
  products: [
    {
        id: String,
        title: String,
        description: String,
        price: Integer,
        thumbnails: Array,
        code: String,
        stock: Integer,
        category: String,
        status: Boolean,
        createdAt: Date,
        updatedAt: Date,
    },
    ...
  ]
}
```

### + GET /loggerTest

Retorna un status 200 - muestra los distintos logs disponibles en el servidor

### + GET /api/products/

Retorna un array de objetos asociados a los productos existentes.

#### Query params

- **limit**: Número máximo de productos a retornar (Opcional) => Por defecto 10
- **page**: Página de productos a retornar (Opcional)
- **sort**: Orden de los productos a retornar (Opcional) => "asc" o "desc"
- **category**: Categoría de los productos a retornar (Opcional)
- **status**: Estado de los productos a retornar(Opcional) => "true"(disponible) o "false"(no disponible)

### + GET /api/products/:pid

Retorna un objeto con la información asociada a un producto con un ID específico.

#### Path variables

- **pid**: ID del producto

### + POST /api/products/

Permite agregar un producto al modelo Products. Recibe un objeto a través del body y retorna un objeto con los valores ingresados junto con el ID de producto asignado.

#### Body

```js
title: String | Required
description: String | Required |
code: String | Required | Unique
price: Integer | Required
status: Boolean | Required
stock: Integer | Required
category: String | Required
thumbnails: Array | Optional
```

### + PUT /api/products/:pid

Modifica un producto a partir de un ID de Producto dado. Recibe a través del body un objeto con atributos.  
Si los atributos existen los reemplaza, si no existen los agrega.  
Debe enviarse al menos un atributo.  
El ID de Producto es el único que **no se modifica** independientemente de que sea enviado en el objeto de atributos.

#### Body

```js
title: String | Optional
description: String | Optional
code: String | Optional | Unique
price: Integer | Optional
status: Boolean | Optional
stock: Integer | Optional
category: String | Optional
thumbnails: Array | Optional
```

### + DELETE /api/products/:pid

Elimina un producto a partir de un ID de Producto dado.

#### Path variables

- **pid**: ID del producto

### + POST /api/products/:pid/images

Permite agregar imágenes a un producto. Recibe las imágenes a través de un form-data y retorna un objeto con el producto actualizado.

#### Path variables

- **pid**: ID del producto

#### Form-data

```js
images: Array | Required
{
  image: File | Required
}
```

### + DELETE /api/products/:pid/images/:iid

Permite eliminar una imagen de un producto. Recibe el ID de la imagen a eliminar a través de los path variables y retorna un objeto con el producto actualizado.

#### Path variables

- **pid**: ID del producto
- **iid**: ID de la imagen

### + POST /api/carts/

Crea un carrito de compras vacío. Retorna un objeto con el carrito creado.

### + GET /api/carts/:cid

Retorna un objeto con la información asociada a un carrito con un ID específico.

#### Path variables

- **cid**: ID del carrito

### + POST /api/carts/:cid/product/:pid

Agrega un producto a un carrito de compras. Recibe un objeto a través del body y retorna un objeto con el carrito actualizado.

#### Path variables

- **cid**: ID del carrito
- **pid**: ID del producto

#### Body

```js
quantity: Integer | Optional
```

### + DELETE /api/carts/:cid/products/:pid

Elimina un producto de un carrito de compras. Retorna un objeto con el carrito actualizado.

#### Path variables

- **cid**: ID del carrito
- **pid**: ID del producto

### + PUT /api/carts/:cid

Modifica un carrito a partir de un ID de Carrito dado. Recibe a través del body un objeto con un arreglo de productos.
Reemplaza en el carrito los productos existentes por los enviados en el body.
Agrega aquellos que tengan formato valido.

#### Path variables

- **cid**: ID del carrito

#### Body

```js
products: Array | Required
    {
        id: String | Required
        quantity: Integer | Required | Min 1
    }
```

### + PUT /api/carts/:cid/products/:pid

Modifica un producto de un carrito a partir de un ID de Carrito y un ID de Producto dados. Recibe a través del body un objeto con la cantidad a actualizar sobre el carrito.

#### Path variables

- **cid**: ID del carrito
- **pid**: ID del producto

#### Body

```js
quantity: Integer | Required | Min 1
```

### + DELETE /api/carts/:cid

Elimina un carrito a partir de un ID de Carrito dado.

#### Path variables

- **cid**: ID del carrito

### + PUT /api/carts/:cid/purchase

Permite realizar la compra de un carrito. Recibe el carrito en los params y lleva a cabo la compra, generando un Ticket de respaldo, y actualiza los productos involucrados en la misma.

#### Path variables

- **cid**: ID del carrito

### + POST /api/sessions/register

Permite registrar un usuario. Recibe un objeto a través del body y retorna un objeto con los valores ingresados junto con el ID de usuario asignado.

#### Body

```js
firstName: String | Required
lastName: String | Required
email: String | Required | Unique
age: Integer | Required
password: String | Required
```

### + POST /api/sessions/registerUsers

Permite a los ADMIN registrar un usuario(permitiendo agregarle el role que deseen, excluyendo al role administrador). Recibe un objeto a través del body y retorna un objeto con los valores ingresados junto con el ID de usuario asignado.

#### Body

```js
firstName: String | Required
lastName: String | Required
email: String | Required | Unique
age: Integer | Required
password: String | Required
role: String | Optional
```

### + POST /api/sessions/login

Permite loguear un usuario. Recibe un objeto a través del body y retorna un objeto con los valores ingresados junto con el ID de usuario asignado.

#### Body

```js
email: String | Required
password: String | Required
```

### + GET /api/sessions/logout

Desloguea al usuario actual. Elimina la sesión del usuario.

### + POST /api/sessions/restoreRequest

Permite solicitar la restauración de la contraseña de un usuario. Recibe un email a través del body y envía un mail con un token de restauración.

#### Body

```js
email: String | Required
```

### + PUT /api/sessions/restorePassword

Permite restaurar la contraseña de un usuario. Recibe un objeto(token y nueva contraseña) a través del body y actualiza la contraseña del usuario especificado.

#### Body

```js
token: String | Required
password: String | Required
```

### + GET /api/sessions/current

Retorna un objeto con la información del usuario actual.

### + PUT /api/users/premium/:uid

Permite cambiar el rol de un usuario, de "user" a "premium" y viceversa.

#### Path variables

- **uid**: ID del usuario

### + POST /api/users/:uid/documents

Permite agregar documentos a un usuario. Recibe los documentos a través de un form-data y retorna un objeto con el usuario actualizado.

#### Path variables

- **uid**: ID del usuario

#### Form-data

```js
documents: Array | Required
{
  document: File | Required
}

profiles: Array((length = 1)) | Required
{
  profile: File | Required
}
```

### + GET /api/users/

Retorna un array de objetos asociados a los usuarios existentes. Solo puede ser ejecutado por un ADMIN. Retorna un array de objetos asociados a los usuarios existentes.

### + DELETE /api/users/

Elimina todos los usuarios inactivos. Solo puede ser ejecutado por un ADMIN. Retorna un objeto con la cantidad de usuarios eliminados y la cantidad de los mismos.

### + DELETE /api/users/:uid

Elimina un usuario a partir de un ID de Usuario dado. Solo puede ser ejecutado por un ADMIN.

#### Path variables

- **uid**: ID del usuario

## Tests

Para ejecutar los tests, ejecutar el comando `npm run test`.

## Logs de la aplicación

Los logs de la aplicación se encuentran en la carpeta `logs` y se dividen en 3 carpetas:

- **dev**: Logs de desarrollo
- **prod**: Logs de producción
- **test**: Logs de tests

## Documentación de la API

La documentación de la API se puede acceder desde el endpoint '/apiDocs' y se encuentra en formato SWAGGER.

##

##

---

    En `TODO.md` podran encontrar los requerimientos de la entrega .

> Puede importar en postman el archivo `postman/postman_endpoints_export.json` para testear los endpoints desarrollados. Con su respectivo ENV `postman/Backend-Coderhouse_ENV.postman_environment.json`
