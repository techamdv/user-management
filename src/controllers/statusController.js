import {User} from'../models/User.js';
import {generateToken, verifyToken} from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// for all users
const updateStatus = async (req, res) => {
  try {

    const  Authorization = req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : '';
    if (!Authorization || Authorization === '') {
      return res.status(401).json({ message: 'JWt Token should be in Bearer format' });
    }

    const isVerified = verifyToken(Authorization);

    if(isVerified){
      // swith users status
      const result =  await User.updateMany({
        is_deleted: false,
      },
        [
          {
            $set: {
              status: {
                $cond: {
                  if: { $eq: ["$status", "active"] },
                  then: "inactive",
                  else: "active"
                }
              }
            }
          }
        ]
      );


      return res.status(200).json({ message: 'Status updated successfully' });
    }
    else{
      return res.status(400).json({ message: 'Invalid Token' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// for single user
const updateUserStatus = async (req, res) => {
  try {

    const  Authorization = req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : '';
    if (!Authorization || Authorization === '') {
      return res.status(401).json({ message: 'JWt Token should be in Bearer format' });
    }
    const isVerified = verifyToken(Authorization);

    if(isVerified){
      // deactivate Single active users
      const result =  await User.updateOne({
          _id : isVerified.id , is_deleted: false,
      },  [
          {
            $set: {
              status: {
                $cond: {
                  if: { $eq: ["$status", "active"] },
                  then: "inactive",
                  else: "active"
                }
              }
            }
          }
        ]       
    );

    //   console.log(result );

      return res.status(200).json({ message: 'Status updated successfully' });
    }
    else{
      return res.status(400).json({ message: 'Invalid Token' });
    }
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export { 
  updateStatus ,
  updateUserStatus
};