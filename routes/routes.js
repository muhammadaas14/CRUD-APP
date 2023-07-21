const express = require('express');
const user = require('../controllers/db/user');
const router = express.Router();
const multer = require('multer');
const jwt = require ('jsonwebtoken')



router.get('/add-user', (req, res) => {
    res.render('add-user', { title: "Add-User" });
});

// Code for image using multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './routes/upload');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({ storage: storage }).single('image');
// adding users to the list and database
router.post('/add-user', upload, async (req, res) => {
    try {
        const person = new user({
            name: req.body.Name,
            email: req.body.Email,
            phone: req.body.Phone,
            image: req.file.filename
        })
const token = await person.createtoken();
        await person.save();

        req.session.message = {
            type: 'success',
            message: "User Added Successfully"
        }

        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.json({ message: error.message, type: "danger" });
    }
});

// to get the data from db to index
router.get('/', async (req, res) => {
    try {
        const users = await user.find().exec();
        res.render('index', { title: "Home Page", user: users});
    } catch (error) {
        console.log(error);
        res.json({ message: error.message, type: 'danger' });
    }
});
// updating users of added data
router.get('/update-user/:id',async(req,res)=>{
    try {
        let id = req.params.id;
        const userss = await user.findById(id)
        if(!userss){
            res.redirect('/')
        }
        else{
            res.render('update-user',{title:"Update User",userss:userss})
        }
    } catch (error) {
        console.log(error);
    }
})
router.post('/update-user/:id',upload,async(req,res)=>{
    try {
            let id = req.params.id
            let new_image = "";
            if(req.file){
                new_image=req.file.filename;
                try {
                    fs.unlinkSync('./routes/upload'+req.body.old_image);
                } catch (error) {
                    console.log(error);
    
                }
                
            }else{
                new_image=req.body.old_image;
            }
            await user.findByIdAndUpdate(id,{
                name:req.body.Name,
                email:req.body.Email,
                phone:req.body.Phone,
                image:new_image
            })
            req.session.message={
                type:'info',
                message:"User Updated Successfully"
            }
            res.redirect('/');
         
    } catch (error) {
        console.log(error);
    }
        
    })
    
// deleting users
router.get('/delete-user/:id',async(req,res)=>{
    try {
        let id = req.params.id;
    const result = await user.findByIdAndRemove(id)
    if(result.image!==""){
        try {
            fs.unlinkSync(result.image)
        } catch (error) {
            console.log(error)
        }
        req.session.message={
            type:"info",
            message:"User Deleted Successfully"
        };
        res.redirect('/')
    }
    } catch (error) {
        res.json({message:error.message})
    }
    
});
// checking Tokens For Authentication
const createtoken = () =>{
    const token = jwt.sign({_id:"64b244b0a4a81c9e58e78198"},process.env.SECRET_KEY)
    const server = jwt.verify(token,process.env.SECRET_KEY)
}
createtoken();



module.exports = router;
