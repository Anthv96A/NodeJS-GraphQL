const User = require('../models/user');
const bcyrpt = require('bcryptjs');
const validator = require('validator');

module.exports = {
    createUser: async (args, req) => { 
        const { email, name, password } = args.userInput;

        const errors = [];
        if(!validator.isEmail(email))
            errors.push({ message: 'Email is invalid' });
        
        if(validator.isEmpty(password) || !validator.isLength(password, { min: 5}))
            errors.push({ message: 'Password too short!' });

        if(errors.length > 0){
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const existingUser = await User.findOne({ email });
        if(existingUser)
            throw new Error(`User with email ${existingUser.email} already exists`);
        
        const newUser = new User({
            name,
            email,
            password: await bcyrpt.hash(password, 10)
        });

        const saved = await newUser.save();
        return { ...saved._doc, _id: saved._id.toString() };
    },
    getUser: async ({id}, req) => {
        const user = await User.findById(id, { password: 0 });
        if(!user)
            throw new Error(`User not found`);
        
        return { ...user._doc, _id: user._id.toString() };
    },
    updateUser: async (args, req) => {
        const { email, name } = args.userInput;
        const saved = await User.findOneAndUpdate({ email }, { name }, {new: true});
        return { ...saved._doc, _id: saved._id.toString() };
    },
    deleteUser: async ({email}, req) => {
        try {
            await User.findOneAndDelete({email});
            return true;
        }
        catch(e){
            console.log(e);
            return false;
        }  
    }
}