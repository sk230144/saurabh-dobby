const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const ImageModel = require('./models/Image');



const salt = bcrypt.genSaltSync(10);
//this string is taken just random
const secret = 'wieyruiwe73iuhifhdfhj';
///////////////////////////////////


// Middleware
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
/////////////////////





//Database Connection
mongoose.connect('mongodb+srv://risabht043:Skt230144@cluster0.ejlmvi5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
////////////////////////




//registration


app.post('/register', async (req, res) => {
  const  {username, password} = req.body;
  try{
    const userDoc = await User.create({username, 
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e){
      res.status(400).json(e)
  }
})


////////////////////////////////


// LOGIN ////////////////////


app.post('/login', async (req, res) => {
  const  {username, password} = req.body;
  const userDoc = await User.findOne({username:username});
  const passOk = userDoc && bcrypt.compareSync(password, userDoc.password);
  if(passOk){
    //If logged in then respond with jwt
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
     if(err) throw err;
     res.cookie('token', token).json({
      id:userDoc._id,
      username,
     });
  })
  }else{
    res.status(400).json('wrong credentials');
  }
})



// Check user is logged in or not

app.get('/profile', (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
  if(err) throw err;
  res.json(info);
  })
})



//////////////////////////////////////////////////////////////////////////////////////


// Logout function ///////////////////////////////////////////////////////////////////////



app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
})









////////////////////////////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Save uploaded files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Append current date/time to filename
  }
});
const upload = multer({ storage: storage });






app.post('/api/images', async (req, res) => {
  try {
    const { name, imageUrl } = req.body; // Retrieve 'imageUrl' from request body
    const image = new ImageModel({ name, imageUrl }); // Use 'imageUrl' instead of 'image'
    await image.save();
    res.status(201).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});





app.get('/api/images', async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});












/////////////////////////////////////////////////////////////////////////////////////////



console.log('backend start');
app.listen(4000)


// mongodb+srv://risabht043:Skt230144@cluster0.xi43tgp.mongodb.net/?retryWrites=true&w=majority