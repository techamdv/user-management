import express from 'express';

const router = express.Router();


import authRoute from './authRoute.js';
import userRoute from './userRoute.js';
import statusRoute from './statusRoute.js';



router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/status', statusRoute);





export default  router;
