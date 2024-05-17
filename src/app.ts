import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { dbConnection } from './db/config';
import router from './routes';
import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import { errorHandler } from './utils/errorHandler';

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use('/images', express.static(path.join(__dirname, 'src', 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware to handle CORS errors by setting appropriate headers
app.use((req: Request, res: Response, next: NextFunction) => {
    // Allow all origins to access the resources
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Specify the methods allowed when accessing the resource
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );

    // Specify the headers that can be used when making a request
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
    );
    // Pass the control to the next middleware function in the stack
    next();
});

app.use(router);

// Define a health check route
app.get('/', (req: Request, res: Response) => {
    res.send('API is working...');
});

app.use(errors());
app.use(errorHandler)

// Establish database connection
dbConnection();

// Start the server and listen on the specified port
app.listen(PORT, () => {
    // Log the server running status with the port number
    logger.info(`[Server]: Server is running at http://localhost:${PORT}`);
});
