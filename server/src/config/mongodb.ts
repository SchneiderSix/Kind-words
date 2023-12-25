import mongoose from 'mongoose';

/**
 * Inicializar la base de datos de mongo
 */
const MongodbConnection = async () => {
  try {
      await mongoose.connect(process.env.MONGODB_URI as string, {
          autoIndex: true
      });
      console.log('Connected to Mongodb Atlas 🍃');
  } catch (error) {
      console.error(error);
  }
}

export default MongodbConnection;
