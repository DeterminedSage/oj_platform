const UserModel = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const QuesModel = require('../Models/Question');

const addQues = async (req, res) => {

    try {
        const {title,description,difficulty,numberOfTests,testCases} = req.body;
        const find_title = await QuesModel.findOne({title});
        const errorMsg = "Title is already taken , consider changing it";
        // console.log(find_title);
        if(find_title){
            return res.status(409).json({message: errorMsg , success: false});
        }
        
        // Find the latest qid to increment
        const latestQues = await QuesModel.findOne().sort({ qid: -1 });
        // console.log(latestQues);
        const val = latestQues ? latestQues.qid + 1 : 1;
        console.log(val);

        // Create new question with incremented qid
        const newQues = new QuesModel({
            qid: val,
            title,
            description,
            difficulty,
            numberOfTests,
            testCases
        });

        console.log(newQues);

        await newQues.save();
        res.status(201).json({
            message: "Ques added successfully",
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }

}

const signup = async (req, res) => {
    try {
        const {name, email,password} = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(409).json({message: "User already exists , you can login", success: false});
        }
        const userModel = new UserModel({name,email,password});
        userModel.password = await bcrypt.hash(password,10);
        await userModel.save();
        res.status(201).json({
            message: "Signup successfully",
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

const login = async (req, res) => {
    try {
        const {email,password} = req.body;
        const user = await UserModel.findOne({email});
        const errorMsg = "Auth failed email or password is incorrect";
        if(!user){
            return res.status(403).json({message: errorMsg , success: false});
        }
        const isPassEqual = await bcrypt.compare(password,user.password);
        if(!isPassEqual){
            return res.status(403).json({message: errorMsg , success: false});
        }

        const jwtToken = jwt.sign(
            {email: user.email,_id:user._id},
            process.env.JWT_SECRET,
            {expiresIn: "3h"}
        )

        res.status(200).json({
            message: "Login success",
            success: true,
            jwtToken,
            email,
            name: user.name
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}


    const getQues = async (req, res) => {

      console.log(req.query);
      const { id, qtitle } = req.query;

      try {
        let question;
        if (id) {
          const x = +id;
          question = await QuesModel.findOne({ qid: x });
        } else if (qtitle) {
          question = await QuesModel.findOne({ title: qtitle });

        }

        if (!question) {
          return res.status(404).json({ 
            success: false, 
            question: null
          });
        }

        question.testCases = question.testCases.slice(0, 2);

        return res.status(200).json({ 
          success: true, 
          message: "Question found",
          question
        });

      } catch (error) {
        return res.status(500).json({ 
          success: false, 
          question: null
        });
      }
    }

    const deleteQues = async (req, res) => {
        const { quesId } = req.params;
        console.log("quesId:", quesId);

    if (!quesId) {
        return res.status(400).json({
        success: false,
        message: 'Question ID (quesId) is required',
        });
    }

    try {

        const result = await QuesModel.deleteOne({ qid: Number(quesId) });

        if (result.deletedCount === 0) {
        return res.status(404).json({
            success: false,
            message: 'Question not found or already deleted',
        });
        }

        res.status(200).json({
        success: true,
        message: 'Question deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
        });
    }
    };

    const updateQues = async (req, res) => {
      const { quesId } = req.params;
      const updatedData = req.body;

      if (!quesId) {
        return res.status(400).json({
          success: false,
          message: 'Question ID (quesId) is required',
        });
      }

      try {
        const result = await QuesModel.findOneAndUpdate(
          { qid: Number(quesId) },   // match on your custom field
          updatedData,
          { new: true }              // return the updated document
        );

        if (!result) {
          return res.status(404).json({
            success: false,
            message: 'Question not found',
          });
        }

        res.status(200).json({
          success: true,
          message: 'Question updated successfully',
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
      }
    };

    const getAllQues = async (req, res) => {
      try {
        const questions = await QuesModel.find()
          .sort({ qid: 1 }) // sort by qid ascending
          .select('qid title difficulty'); // only include these fields
        res.status(200).json(questions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ error: 'Failed to fetch questions' });
      }
    };

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select(
      'name email questionsSolvedEasy questionsSolvedHard questionsSolvedMedium questionsSolvedTotal'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = {
    signup,
    login,
    addQues,
    getQues,
    deleteQues,
    updateQues,
    getAllQues,
    getUser,
}