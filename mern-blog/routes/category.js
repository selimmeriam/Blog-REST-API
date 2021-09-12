const router = require("express").Router();
const Category = require("../models/Category");


//GET
router.route('/').get(async(req, res) => {
    try{
    await Category.find()
    .then(cat => res.json(cat))

    }catch(err){
      res.status(500).json("Something Happened: " + err);  
    }
     
  });

//POST /*Add new Category */
router.route('/').post(async (req, res) => {
try{
    const name = req.body.name;
    const newCat = new Category({
      name
    });
     await newCat.save()
    .then(() => res.status(200).json('New Category Created!'))

   }catch(err){
    res.status(500).json(err);
   }
  });

module.exports = router;