import express from 'express';
const router = express.Router();
import { getAllUsers, getUserDistance, getUserListing } from '../controllers/userController.js';

router.post('/get-distance', getUserDistance);
router.post('/user-listing', getUserListing);
router.get('/all-users', getAllUsers);


// router.post('/login', login);
// router.get('/switch-status', updateStatus);
// router.get('/all-users', getAllUsers);
// router.get('/update-user-status/:id', updateUserStatus);

export default  router;
