import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 
import fs from 'fs';   
import 'express-async-errors';
import morgan from 'morgan';
import { loggerMiddleware } from './presentation/middlewares/logger.middleware.js';
import noteRoutes from './presentation/routes/note.routes.js';
import authRoutes from './presentation/routes/auth.routes.js';
import { connectMongo } from './infrastructure/database/mongo/connection.js';
import { connectMysql } from './infrastructure/database/mysql/connection.js';
import { setupSwagger } from './infrastructure/config/swagger.config.js';

//categorias
import categoryRoutes from './presentation/routes/category.routes.js';
//
await connectMongo();
await connectMysql();
 
const app = express();
 
app.use(cors());
app.use(express.json());
// Configuración de Swagger
setupSwagger(app);
//
app.use(loggerMiddleware);
app.use(morgan('dev'));
 
//imagenes estaticas
// Crear carpeta uploads si no existe
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
    console.log('📁 Carpeta uploads creada');
}

app.use('/uploads', express.static('uploads'));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', noteRoutes);
//categorias
app.use('/api/v1/categories', categoryRoutes);
//
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API de notas activa' });
});

 // ✅ Middleware global de errores descriptivo
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Error personalizado (NotFoundError, ForbiddenError, etc.)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            error: err.code,
            message: err.message,
            statusCode: err.statusCode
        });
    }

    // Error genérico
    res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "Error interno del servidor",
        statusCode: 500
    });
});

const PORT = process.env.PORT || 3000;

// Solo levanta el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
}

export default app; 
