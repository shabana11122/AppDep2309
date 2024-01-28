const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");   
const dotenv = require("dotenv");   
const path = require("node:path");
dotenv.config();  

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {

        // console.log(file);
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage })

let connectToMDB = async () => {

    try {


        mongoose.connect(process.env.dpPath);

        console.log("Successfully to connected to MDB");

    } catch (err) {
        console.log("Unable to connect to MDB");
    }


}


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, "./client/build")));


app.post("/signup", upload.array("profilePic"), async (req, res) => {


    console.log(req.body);
    console.log(req.files);


    let userArr = await User.find().and({ email: req.body.email });
    if (userArr.length > 0) {
        res.json({ status: "failure", msg: "user already exist." });
    }
    else {

        
        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        try {

            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: parseInt(req.body.age),
                email: req.body.email,
                password: hashedPassword,  
                profilePic: req.files[0].path,
            });




            await newUser.save();
            res.json({ status: "success", msg: "User Ceated Successfully" });


        } catch (err) {
            res.json({ status: "failure", err: err });
        }
    }
});



app.put("/updateProfile", upload.single("profilePic"), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    try {
        if (req.body.firstName.length > 0) {
            await User.updateMany(
                { email: req.body.email },
                { firstName: req.body.firstName }
            );
        }

        if (req.body.lastName.length > 0) {
            await User.updateMany(
                { email: req.body.email },
                { lastName: req.body.lastName }
            );
        }

        if (req.body.age > 0) {
            await User.updateMany(
                { email: req.body.email },
                { age: req.body.age }
            );
        }

        if (req.body.password.length > 0) {
            await User.updateMany(
                { email: req.body.email },
                { password: req.body.password }
            );
        }

        if (req.file && req.file.path) {
            await User.updateMany(
                { email: req.body.email },
                { profilePic: req.file.path }
            );
        }
        res.json({ status: "success", msg: "User Details updated Successfully" });

    } catch (err) {
        res.json({ status: "failure", msg: "Something went wrong", err: err });
    }



});


app.delete("/deleteProfile", async (req, res) => {

    console.log(req.query.email);
    try {
        await User.deleteMany({ email: req.query.email });

        res.json({ status: "success", msg: "User deleted successfully" });


    } catch (err) {


        res.json({ status: "failure", msg: "Unable to delete profile", err: err });
    }



});

app.post("/login", upload.none(), async (req, res) => {
    console.log(req.body);
    let fetchedData = await User.find().and({ email: req.body.email });

    console.log(fetchedData);


    if (fetchedData.length > 0) {

        let passwordResult=await bcrypt.compare(req.body.password,fetchedData[0].password)  

        if (passwordResult==true) {    

            let token = jwt.sign({
                email: req.body.email,
                password: req.body.password
            }, "hahaha");

            // let dataToSend = {...fetchedData[0]};
            // delete dataToSend["password"];

            let dataToSend = {
                firstName: fetchedData[0].firstName,
                lastName: fetchedData[0].lastName,
                age: fetchedData[0].age,
                email: fetchedData[0].email,
                profilePic: fetchedData[0].profilePic,
                token: token,
            };


            console.log(dataToSend);
            res.json({ status: "success", data: dataToSend });
        }
        else {
            res.json({ status: "failure", msg: "Invalid Password" });
        }

    } else {
        res.json({ status: "failure", msg: "User doesnot exist" })
    }
});


app.post("/validateToken", upload.none(), async (req, res) => {
    console.log(req.body.token);

    try {
        let decryptedObj = jwt.verify(req.body.token, "hahaha");
    console.log(decryptedObj);

    let fetchedData = await User.find().and({ email: decryptedObj.email });

    console.log(fetchedData);


    if (fetchedData.length > 0) {

        if (fetchedData[0].password == decryptedObj.password) {

            // let token = jwt.sign({
            //     email: req.body.email,
            //     password: req.body.password
            // }, "hahaha");

            // let dataToSend = {...fetchedData[0]};
            // delete dataToSend["password"];

            let dataToSend = {
                firstName: fetchedData[0].firstName,
                lastName: fetchedData[0].lastName,
                age: fetchedData[0].age,
                email: fetchedData[0].email,
                profilePic: fetchedData[0].profilePic,
                // token:token,
            };


            console.log(dataToSend);
            res.json({ status: "success", data: dataToSend });
        }
        else {
            res.json({ status: "failure", msg: "Invalid Password" });
        }

    } else {
        res.json({ status: "failure", msg: "User doesnot exist" })
    }
        
    }catch(err){res.json({status:"failure",msg:"Invalid token",err:err})}


    

    // let decryptedObj = jwt.verify(req.body.token, "hahaha");
    // console.log(decryptedObj);
});

let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: String,
    password: String,
    profilePic: String,

});

let User = new mongoose.model("user", userSchema);


app.listen(process.env.port, () => {
    console.log(`Listening to port ${process.env.port}`);
});

connectToMDB();




