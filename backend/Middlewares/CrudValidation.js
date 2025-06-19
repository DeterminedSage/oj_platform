const joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const addQuestionValidation = (req, res, next) => {
    const schema = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        difficulty: joi.string().valid('easy', 'medium', 'hard').required(),
        numberOfTests: joi.number().required(),
        testCases: joi.array().items(
            joi.object({
                input: joi.string().required(),
                output: joi.string().required()
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

module.exports = {
    addQuestionValidation,
}