const patientModel = require('../models/userModel');
const bcrypt = require('bcryptjs');


////////////////////////////////
const registerController = async (req,res) => {
        try{
            console.log('User saving');
            const existingPatient = await patientModel.findOne({email: req.body.email});
            if (existingPatient){
                return res.status(200).send({message: 'User already exists', success: false});
            }
            const password = req.body.password;
            const salt = await bcrypt.genSalt(12)
            const hashedPassword = await bcrypt.hash(password, salt)
            req.body.password = hashedPassword
            const newUser = new patientModel(req.body)
            await newUser.save()
            res.status(201).send({message: 'User saved', success: true});
            
        }
        catch(err){
            console.log(err);
            res.status(404).send({success:false, message: `Register Controller ${err.message}`});
        }
    }

    const loginController = () => {}

    module.exports = { loginController, registerController };

