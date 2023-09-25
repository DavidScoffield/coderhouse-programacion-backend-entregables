import mongoose from 'mongoose'
import '../../src/config/env.config.js'
import { MONGO_URI } from '../../src/config/mongodb.config.js'
import ProductManager from '../../src/dao/mongo/managers/product.manager.js'

try {
  // --- Initialize DB ---
  console.log('🔎🔎 Connecting to', MONGO_URI)

  await mongoose.connect(MONGO_URI)

  console.log('✅️✅️ Connections to Mongo database succefully')

  // --- Delete all collections ---
  const db = mongoose.connection.db

  const collections = await mongoose.connection.db.listCollections().toArray()
  const collectionNames = collections.map((collection) => collection.name)
  console.log('🗑️  Deleting all collections:', collectionNames)

  const deleteCollectionsPromises = collectionNames.map(async (collectionName) => {
    return db.dropCollection(collectionName)
  })

  await Promise.all(deleteCollectionsPromises)

  console.log('✅️✅️ All collections deleted successfully')

  // --- Create products ---
  console.log('📝 Creating products...')

  const mockProducts = [
    {
      title: 'Camiseta de algodón',
      description: 'Camiseta de algodón suave y cómoda.',
      price: 19.99,
      thumbnail: [],
      code: 'P12325',
      stock: 100,
      category: 'Ropa',
      status: true,
      images: [],
    },
    {
      title: 'Jeans ajustados',
      description: 'Jeans ajustados de alta calidad.',
      price: 49.99,
      thumbnail: [],
      code: 'P23456',
      stock: 50,
      category: 'Ropa',
      status: true,
      images: [],
    },
    {
      title: 'Vestido de verano',
      description: 'Vestido ligero y fresco para el verano.',
      price: 29.99,
      thumbnail: [],
      code: 'P34567',
      stock: 75,
      category: 'Ropa',
      status: true,
      images: [],
    },
    {
      title: 'Zapatillas deportivas',
      description: 'Zapatillas ideales para hacer ejercicio.',
      price: 59.99,
      thumbnail: [],
      code: 'P45678',
      stock: 30,
      category: 'Calzado',
      status: true,
      images: [],
    },
    {
      title: 'Chaqueta de cuero',
      description: 'Chaqueta de cuero genuino para hombres.',
      price: 129.99,
      thumbnail: [],
      code: 'P56789',
      stock: 25,
      category: 'Ropa',
      status: true,
      images: [],
    },
    {
      title: 'Blusa elegante',
      description: 'Blusa elegante para ocasiones especiales.',
      price: 39.99,
      thumbnail: [],
      code: 'P67890',
      stock: 40,
      category: 'Ropa',
      status: true,
      images: [],
    },
    {
      title: 'Shorts de playa',
      description: 'Shorts de playa cómodos y ligeros.',
      price: 24.99,
      thumbnail: [],
      code: 'P78901',
      stock: 60,
      category: 'Ropa',
      status: true,
      images: [],
    },
    {
      title: 'Mochila de senderismo',
      description: 'Mochila resistente para senderismo y aventuras al aire libre.',
      price: 69.99,
      thumbnail: [],
      code: 'P89012',
      stock: 20,
      category: 'Accesorios',
      status: true,
      images: [],
    },
    {
      title: 'Sombrero de sol',
      description: 'Sombrero de ala ancha para protegerse del sol.',
      price: 14.99,
      thumbnail: [],
      code: 'P90123',
      stock: 80,
      category: 'Accesorios',
      status: true,
      images: [],
    },
    {
      title: 'Jersey de lana',
      description: 'Jersey de lana cálido para el invierno.',
      price: 34.99,
      thumbnail: [],
      code: 'P11234',
      stock: 35,
      category: 'Ropa',
      status: true,
      images: [],
    },
    {
      title: 'Pantalones cortos deportivos',
      description: 'Pantalones cortos deportivos para entrenamiento.',
      price: 19.99,
      thumbnail: [],
      code: 'P13345',
      stock: 55,
      category: 'Ropa',
      status: true,
      images: [],
    },
    {
      title: 'Vestido de noche',
      description: 'Vestido elegante para eventos nocturnos.',
      price: 79.99,
      thumbnail: [],
      code: 'P123456',
      stock: 15,
      category: 'Ropa',
      status: true,
      images: [],
    },
    {
      title: 'Calcetines deportivos',
      description: 'Calcetines cómodos para deportes.',
      price: 9.99,
      thumbnail: [],
      code: 'P1134567',
      stock: 100,
      category: 'Calzado',
      status: true,
      images: [],
    },
    {
      title: 'Gorra de béisbol',
      description: 'Gorra de béisbol con diseño clásico.',
      price: 12.99,
      thumbnail: [],
      code: 'P1145678',
      stock: 70,
      category: 'Accesorios',
      status: true,
      images: [],
    },
    {
      title: 'Bufanda de invierno',
      description: 'Bufanda suave y abrigada para el invierno.',
      price: 16.99,
      thumbnail: [],
      code: 'P1156789',
      stock: 45,
      category: 'Accesorios',
      status: true,
      images: [],
    },
  ]

  const pm = new ProductManager()
  const addProductsPromises = mockProducts.map((product) => {
    product.thumbnail = [
      `https://picsum.photos/seed/${product.code}/600/400`,
      `https://picsum.photos/seed/${product.code}zz/600/400`,
    ]

    return pm.addProduct(product)
  })

  const newProducts = await Promise.all(addProductsPromises)

  console.log('✅️✅️ Products created successfully')

  // --- Close DB ---
  await mongoose.connection.close()

  console.log('✅️✅️ DB connection closed successfully')
} catch (err) {
  console.log('❌ error connecting to MongoDB:', err.message)
}
