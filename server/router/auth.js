const jwt = require('jsonwebtoken')
const express = require('express');
const User = require("../model/userSchema")
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate")
const cookieParser = require("cookie-parser");


const router = express.Router();



require('../db/conn')

require('../model/userSchema')
router.use(cookieParser());
router.get('/', (req, res) => {
    res.send('Welcome to Home Page from ROuter.js');

});

//Using Promises

// router.post('/register', (req,res)=>{


//     const { name,email,phone,work,password,cpassword } = req.body;

//     // console.log(name);
//     // console.log(email);
//     // res.json({message:req.body})

//     if(!name || !email || !phone || !work || !password || !cpassword ){
//         return res.status(422).json({error:"Please fill the unfilled fields"});    }

//         User.findOne({email:email})
//         .then((userExist)=>{
//             if(userExist){
//                 return res.status(422).json({error:"Email Already Exist"})

//             }

//             const user = new User({name,email,phone,work,password,cpassword });

//             user.save().then(()=>{
//                 res.status(201).json({message:"user registered successfully"})
//             }).catch((err)=>res.status(500).json({error:"Failed to Register "}))
//         }).catch(err=>{console.log(err);});
//     // res.send('Mera Register Page')
// });






router.post('/register', async (req, res) => {


    const { name, email, phone, work, password, cpassword } = req.body;

    // console.log(name);
    // console.log(email);
    // res.json({message:req.body})

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill the unfilled fields" });
    }

    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email Already Exist" })

        } else if (password != cpassword) {
            return res.status(422).json({ error: "Passwords are not maching" })

        }

        else {
            const user = new User({ name, email, phone, work, password, cpassword });//Yaha pe mujhe hash karna hoga, toh mujhe ek function call karna hoga(Pre Save Method)
            const userRegister = await user.save();
            if (userRegister) {
                res.status(201).json({ message: "User Registered Succesfully" })
            }
            else {
                res.status(500).json({ error: "Failed to Register " })
            }
        }
    } catch (err) {
        console.log(err);

    }





    // res.send('Mera Register Page')
});

//login route

router.post('/signin', async (req, res) => {
    // console.log(req.body);
    // res.json({message:"Awesome"});
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ error: "Please Fill the data" })
        }

        const userLogin = await User.findOne({ email: email });

        // console.log(userLogin);

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();

            console.log(token);




            if (!isMatch) {

                res.status(400).json({ message: "Invalid Credentials" })
            }
            else {
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                console.log("cookies");
                console.log(req.cookies);
                res.json({ message: "User SignIn Successfully" });

            }

        }
        else {
            res.status(400).json({ error: "Invalid Credentials" })
        }






    } catch (err) {
        console.log(err);
    }

})

router.get('/about', authenticate, (req, res) => {
    console.log('Hello My About')
    res.send(req.rootUser);


}, []);


router.get('/getdata', authenticate, (req, res) => {
    console.log("This is For Data Gathering")
    res.send(req.rootUser);
})

//COntact Us PaGe

router.post('/contact', authenticate, async (req, res) => {
    try {

        const { name, email, phone, message } = req.body

        if (!name || !email || !phone || !message) {
            console.log("Error in Contact Form")
            return res.json({ error: "plzz fill the contact form" })
        }


        const userContact = await User.findOne({ _id: req.userID });

        if (userContact) {

            const userMessage = await userContact.addMessage(name, email, phone, message)

            await userContact.save();

            res.status(201).json({message:"User Contact Successfully"})




        }



    } catch (error) {
        console.log(error)

    }


});

//LogOut ka page

router.get('/logout',  (req, res) => {
    console.log('Hello My LogOut Page')
    res.clearCookie('jwtoken',{ path:'/' });
    res.status(200).send('User LogOut');


}, []);






module.exports = router;
