import express from 'express';
import route from './routes/routeIndex.js';

const app = express();
app.use(express.json());

// Routes
app.use('/api', route);

export { 
    app
};
