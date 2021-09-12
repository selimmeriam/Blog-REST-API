const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");


//POST /*Create new post*/
router.route('/').post(async(req, res) => {
    //this is the mongodb method to craete a new post and store it at the mongodb atlas database 
    const newPost= new Post(req.body);
    try{
    await newPost.save()
    .then(post => res.status(200).json(post))

    }catch(err){
      res.status(500).json("Something Happened: " + err);  
    }
     
  });



//GET  /******** */
//This is the 2nd endpoint to handle User GET request to get all posts in the DB
//i.e. http://localhost:5000/posts/?name=mario  or
//i.e. http://localhost:5000/posts/?cat=music   or
//i.e. http://localhost:5000/posts/?name=mario&cat=life 


router.route('/').get(async(req, res) => {
 
    const username=  req.query.name;
    const category = req.query.cat;
    try{
      if(username && typeof category === "undefined"){
       await Post.find({username})
       .then(posts => res.status(200).json(posts))
      }else if(category && typeof username === "undefined"){
       await Post.find({categories:{$in: [category]}})
      .then(posts =>res.status(200).json(posts))
      }else if(typeof username !== "undefined" && typeof category !== "undefined"){
       await Post.find({username, categories:{$in: [category]}})
      .then(posts =>{res.status(200).json(posts); console.log('ana hena  ',username, category)})
      }else { 
         await Post.find()
         .then(posts => res.status(200).json(posts))
      }
  
    }catch(err){
      res.status(500).json("Something Happened: " + err);  
    }
     
  });

//GET specific post 
router.route('/:id').get(async(req, res) => {
    try{
    await Post.findById({_id:req.params.id})
    .then(post => res.status(200).json(post))

    }catch(err){
      res.status(500).json("Sorry, the user you are looking for is not available. Plaese Enter a correct ID ");  
    }
    
  });

//DELETE /*delete a post*/

router.route('/:id').delete(async(req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json("Something Happened: " + err);
      }
    } else {
      res.status(401).json("Sorry, You Only able to delete your Own posts!");
    }
  } catch (err) {
    res.status(500).json("Sorry, No such Post with this ID ");
  }

});

//PUT /*Update Existing Post*/ 
router.route('/:id').put(async(req, res) => {
    try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const title = req.body.title;
        const desc = req.body.desc;
        const photo = req.body.photo;
        const categories = req.body.categories;
        let update={
             title, desc, photo, categories 
         } 
     
        await Post.findByIdAndUpdate(req.params.id ,{$set: update},{returnOriginal:false})
        res.status(200).json('Post have been updated... ');
      } catch (err) {
        res.status(500).json("Something Happened: " + err);
      }
    } else {
      res.status(401).json("Sorry, You Only able to Update your Own Posts!");
    }
  } catch (err) {
    res.status(500).json("Sorry, the Post you are looking for is not available. Plaese Enter a correct ID ") 
  }
  
  });

module.exports = router;