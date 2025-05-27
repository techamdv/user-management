import {User} from'../models/User.js';
import {verifyToken} from '../utils/generateToken.js';


const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; 

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
};

const getUserDistance = async (req, res) => {

  try {
    const {Destination_Latitude , Destination_Longitude } = req.body;
    const  Authorization = req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : '';
    if (!Authorization || Authorization === '') {
      return res.status(401).json({ message: 'JWt Token should be in Bearer format' });
    }
    const decoded = verifyToken(Authorization);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.findOne({ _id : decoded.id ,is_deleted: false });  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const distance = haversineDistance(
        user.latitude, 
        user.longitude, 
        Destination_Latitude, 
        Destination_Longitude
    );
    res.status(200).json({
      message: 'Distance calculated successfully',
      distance : distance.toFixed(2) + ' km',
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {

  try {

    const  Authorization = req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : '';
    if (!Authorization || Authorization === '') {
      return res.status(401).json({ message: 'JWt Token should be in Bearer format' });
    }
    const decoded = verifyToken(Authorization);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const users = await User.find({ is_deleted: false });  
        
    let data = [];
    users.forEach((user) => {
      data.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        status: user.status,
        register_at: user.createdAt
      })
    })


    res.status(200).json({
      message: 'All Users Fetched successfully',
      data: data
    });

  } catch (err) {
    console.log(err.message);
    
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserListing = async (req, res) => {

  try {
    const { week_number  } = req.body;
    const  Authorization = req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : '';
    if (!Authorization || Authorization === '') {
      return res.status(401).json({ message: 'JWt Token should be in Bearer format' });
    }
    const decoded = verifyToken(Authorization);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findOne({ _id : decoded.id ,is_deleted: false });  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const data = await User.aggregate([
        {
            $addFields: {
            week_number: {
                $subtract: [{ $dayOfWeek: "$createdAt" }, 1] 
            }
            }
        },
        {
            $project: {
            _id: 0,
            name: 1,
            email: 1,
            week_number: 1
            }
        }
        ]);


    
    let result = {};
    for (let day of week_number) {
      let filtered = data.filter(item => item.week_number === day).map(({ week_number, ...rest }) => rest);;
        switch (day) {
            case 0:
                result.sunday = filtered;
                break;
            case 1:
                result.monday = filtered;
                break;
            case 2:
                result.tuesday = filtered;
                break;
            case 3:
                result.wednesday = filtered;
                break;
            case 4:
                result.thrusday = filtered;
                break;
            case 5:
                result.friday = filtered;
                break;
            case 6:
                result.saturday = filtered;
                break;
    }
}

    res.status(200).json({
      message: 'User Listing successfully',
      data : result,
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export { 
  getUserDistance,
  getUserListing,
  getAllUsers
};
