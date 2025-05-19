const joi = require('joi');

const addQuestionValidation = (req, res, next) => {
    const schema = joi.object({
        title: joi.string().min(1).max(20).required(),
        description: joi.string().min(1).max(350).required(),
        difficulty: joi.string().valid('easy', 'medium', 'hard').required(),
        numberOfTests: joi.number().min(5).max(20).required(),
        testCases: joi.array().items(
            joi.object({
                input: joi.string().min(1).required(),
                output: joi.string().min(1).required()
            })
        ).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            error: error.details
        });
    }

    next();
};

const signupValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(3).max(100).required(),
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

module.exports = {
    signupValidation,
    loginValidation,
    addQuestionValidation,
}