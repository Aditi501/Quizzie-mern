const User = require('../model/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body

        if (!name || !email ||!password ||!confirmPassword) {
            return res.status(400).json({
                message: "Bad Request"
            })
        }
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res
                .status(409)
                .json({
                    message: "Username already exist"
                })
        }

        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
          }

        const hashedpassword = await bcryptjs.hash(password, 10)

        const userData = new User({
            name,
            email,
            password: hashedpassword,
            
        })
        await userData.save();
        
        res.json({ meassage: "user registered successfully" })

    }
    catch (error) {
        next(error)
    }
}
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                meassage: "Bad Request ! Invalid Credentials"
            })
        }
        const userDetails = await User.findOne({ email: email })

        if (!userDetails) {
            return res
                .status(401)
                .json({
                    message: "User Doesn't exist"
                })
        }
        const passwordMatch = await bcryptjs.compare(password, userDetails.password)

        if (!passwordMatch) {
            return res.json({
                meassage: "Invalid Credentials"
            })
        }

        const token = jwt.sign({ userId: userDetails._id, name: userDetails.name },
            process.env.SECRET_KEY,
            { expiresIn: "3d" })
        console.log(token)


        res.json({
            meassage: "User logged in successfully",
            token: token,
            name: userDetails.name
        })
    }
    catch (error) {
        next(error)
    }

}
const logoutUser = async (req, res, next) => {
    try {
     
      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };

module.exports = { registerUser, loginUser,logoutUser }