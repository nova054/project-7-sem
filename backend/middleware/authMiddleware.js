const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next)=>{
    let token;
    if(req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
                token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
                next();
            } catch(err){   
                return res.status(401).json({message:'Not authorized, token failed'});
        } 
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const requireOrganization = (req, res, next)=>{
    if(req.user.role !== 'organization'){
        return res.status(403).json({message: 'Access denied'});
    }
    next();
};

module.exports = { protect, requireOrganization };