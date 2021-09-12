const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

//GET
router.route('/').get(async(req, res) => {
    try{
    await User.find()
    .then(users => res.json(users))

    }catch(err){
      res.status(500).json("Something Happened: " + err);  
    }
     
  });

 
//GET Specific user

router.route('/:id').get(async(req, res) => {
    try{
    await User.findById({_id:req.params.id})
    .then(users => res.status(200).json(users))

    }catch(err){
      res.status(500).json("Sorry, the user you are looking for is not available. Plaese Enter a correct ID ");  
    }
    
  });

  
//Update Specific user
router.route('/:id').put(async(req, res) => {
    try {
    const user = await User.findById(req.params.id);
    if (req.body.id === req.params.id) {
      try {
        const username = req.body.username;
        const email = req.body.email;
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        let update={
             username, email, password
         } 
     
        await User.findByIdAndUpdate(req.params.id ,{$set: update},{returnOriginal:false})
        res.status(200).json('User have been updated... ');
      } catch (err) {
        res.status(500).json("Something Happened: " + err);
      }
    } else {
      res.status(401).json("Sorry, You Only able to Update your Own Account!");
    }
  } catch (err) {
    res.status(500).json("Sorry, the user you are looking for is not available. Plaese Enter a correct ID ") 
  }

  });




//Delete Specific user
router.route('/:id').delete(async(req, res) => {

 try {
    const user = await User.findById(req.params.id);
    if (req.body.id === req.params.id ) {
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json(`This is a Goodbay ${user.username}, Your account has been Deleted ...`);
      } catch (err) {
        res.status(500).json("Something Happened: " + err +" please Try again later");
      }
    } else {
      res.status(401).json("Sorry, You Only able to delete your Own Account!");
    }
  } catch (err) { 
    res.status(404).json("No Such account with this ID");
  }

});


module.exports = router;