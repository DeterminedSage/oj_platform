const joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const signupValidation = (req, res, next) => {

    console.log("reached signupValidation middleware");
    const schema = joi.object({
        name: joi.string().min(3).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).max(20).required(),
    });
    console.log(schema);

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message, 
            error: error.details
        });
    }

    next();
}



const loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(20).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message, 
            error: error.details
        });
    }

    next();
}

const authMiddleware = (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("return 401");
            return res.status(401).json({ message: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            req.user = decoded;
            console.log("Decoded user:", req.user);
            console.log("this is issue"); //code is reached here
            next();
        } catch (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
};

module.exports = {
    signupValidation,
    loginValidation,
    authMiddleware,
}