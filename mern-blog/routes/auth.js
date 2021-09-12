const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");



//Register
router.route('/register').post(async (req, res) => {
try{
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
   
    const username = req.body.username;
    const email = req.body.email;
    const password=hashedPass;
    const newUser = new User({
      username,
      email,
      password
    });
     await newUser.save()
    .then(() => res.status(200).json('New User Created!'))

   }catch(err){
    res.status(500).json(err);
   }
  });



//Login
router.route('/login').post(async (req, res) => {
    try{
     const user = await User.findOne({ username: req.body.username });
     const validated = await bcrypt.compare(req.body.password, user.password);
         
     if(!user){
       res.status(400).json("Wrong Username!"); 
     }
     else if(!validated){
       return res.status(400).json("Wrong Password Please Enter the Right one!")
     }
      else{
          res.status(200).json(`Welcome ${user.username}!`);
      }
     
 
    }catch(err){
     res.status(400).json('Wrong Username or password! Please Try Again');   
    } 
   });
 



module.exports = router;