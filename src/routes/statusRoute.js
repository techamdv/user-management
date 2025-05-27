import express from 'express';
const router = express.Router();
import {updateStatus, updateUserStatus} from '../controllers/statusController.js';


router.get('/switch-status', updateStatus);
router.get('/update-user-status', updateUserStatus);

export default  router;
