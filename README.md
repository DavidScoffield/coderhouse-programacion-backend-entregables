![Banner](extras/PRODUCT_MANAGER_BANNER.jpg)

## Intrucciones de instalación

> #### Requisitos:
>
> - Tener instalado **Node.js**
> - Tener instalado **Postman** (opcional)
> - Tener instalado **Git** (opcional)

- Clonar el repositorio
- Instalar dependencias con `npm install`

## Ejecutar servidor

- Con **NODE**: Ejecutar el comando `npm run start` (ejecuta el archivo _app.js_ con node)
- CON **NODEMON**: Ejecutar el comando `npm run dev` (ejecuta el archivo _app.js_ con nodemon)

## Estructura de carpetas

```bash
.
├── extras
└── src
    ├── config
    ├── constants
    ├── controllers
    ├── dao
    │   ├── fileSystem
    │   │   ├── managers
    │   │   └── utils
    │   └── mongo
    │       ├── managers
    │       └── models
    ├── errors
    ├── listeners
    ├── middlewares
    ├── public
    │   ├── css
    │   └── js
    ├── routes
    ├── utils
    │   └── validations
    └── views
        ├── layouts
        └── partials

```

---

## Rutas de vistas

| **Request type** | **Path**          | **Body** | **Query params** | **Path variables**                  | **Output** |
| ---------------- | ----------------- | -------- | ---------------- | ----------------------------------- | ---------- |
| GET              | /                 |          |                  |                                     | HTML       |
| GET              | /realtimeproducts |          |                  |                                     | HTML       |
| GET              | /chat             |          |                  |                                     | HTML       |
| GET              | /products         |          |                  | limit, page, sort, category, status | HTML       |
| GET              | /cart/:cid        |          |                  | cid: Cart ID                        | HTML       |
| GET              | /register         |          |                  |                                     | HTML       |
| GET              | /login            |          |                  |                                     | HTML       |
| GET              | /restorePassword  |          |                  |                                     | HTML       |
| GET              | /profile          |          |                  |                                     | HTML       |

## Documentación de la API:

| **Request type** | **Path**                      | **Body** | **Query params**                    | **Path variables**              | **Output** |
| ---------------- | ----------------------------- | -------- | ----------------------------------- | ------------------------------- | ---------- |
| GET              | /healthcheck                  |          |                                     |                                 | Object     |
| GET              | /api/products/                |          | limit, page, sort, category, status |                                 | Object     |
| GET              | /api/products/:pid            |          |                                     | pid : Product ID                | Object     |
| POST             | /api/products/                | Object   |                                     |                                 | Object     |
| PUT              | /api/products/:pid            | Object   |                                     | pid : Product ID                | Object     |
| DELETE           | /api/products/:pid            |          |                                     | pid : Product ID                | Object     |
| POST             | /api/carts/                   |          |                                     |                                 | Object     |
| GET              | /api/carts/:cid               |          |                                     | cid : Cart ID                   | Object     |
| POST             | /api/carts/:cid/product/:pid  | Object   |                                     | cid : Cart ID, pid : Product ID | Object     |
| DELETE           | /api/carts/:cid/products/:pid |          |                                     | cid : Cart ID, pid : Product ID | Object     |
| PUT              | /api/carts/:cid               | Object   |                                     | cid : Cart ID                   | Object     |
| PUT              | /api/carts/:cid/products/:pid | Object   |                                     | cid : Cart ID, pid : Product ID | Object     |
| DELETE           | /api/carts/:cid               |          |                                     | cid : Cart ID, pid : Product ID | Object     |
| POST             | /api/sessions/register        | Object   |                                     |                                 | Object     |
| POST             | /api/sessions/login           | Object   |                                     |                                 | Object     |
| GET              | /api/sessions/logout          |          |                                     |                                 | Object     |
| PUT              | /api/sessions/restorePassword | Object   |                                     |                                 | Object     |

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

### + POST /api/sessions/login

Permite loguear un usuario. Recibe un objeto a través del body y retorna un objeto con los valores ingresados junto con el ID de usuario asignado.

#### Body

```js
email: String | Required
password: String | Required
```

### + GET /api/sessions/logout

Desloguea al usuario actual. Elimina la sesión del usuario.

### + PUT /api/sessions/restorePassword

Permite restaurar la contraseña de un usuario. Recibe un objeto a través del body y actualiza la contraseña del usuario especificado.

#### Body

```js
email: String | Required
password: String | Required
```

##

##

---

    En `TODO.md` podran encontrar los requerimientos de la entrega .

> Puede importar en postman el archivo `postman_endpoints_export.json` para testear los endpoints desarrollados.

> **ACLARACION:** No eliminar el carrito con id _"64679c70db83fc11a4f2df62"_, ya que es el utilizado de momento de forma estatica para cargar los productos en la home de /products. Si se elimina, se debera cambiar el id en el archivo `products.js` en la linea 2.
