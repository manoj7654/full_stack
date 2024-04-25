
const {UserModal}=require("../modal/userModal")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require("dotenv").config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'manojsfstm5@gmail.com',
    pass: 'tqob mypx jlmj zdhw'
  }
});

const sendVerificationEmail = async (recipientEmail, OTP) => {
  try {
    await transporter.sendMail({
      from: 'manojsfstm5@gmail.com',
      to: recipientEmail,
      subject: 'Verify Your Email',
      text: `Your OTP is: ${OTP}`
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
};


const signup=async(req,res)=>{
    try {
        const { name,phone,email, password } = req.body;
        const existingUser = await UserModal.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModal({ name,phone,email, password: hashedPassword });
        await newUser.save();
        const generateOTP = () => {
          const digits = '0123456789';
          let OTP = '';
          for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
          }
          return OTP;
        };
        const OTP = generateOTP();
        await sendVerificationEmail(email, OTP);
        res.status(200).json({ message: 'OTP sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}


const login=async(req,res)=>{
  try {
    const { email, password } = req.body;

    const user = await UserModal.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({userId:user._id}, process.env.key , { expiresIn: '1h' });
    res.status(200).json({message:"Login Successfull", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const changePassword=async(req,res)=>{
  try {
    const { email, currentPassword, newPassword } = req.body;
   
    const user = await UserModal.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModal.updateOne({ email }, { password: hashedPassword });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports={signup,login,changePassword}
