const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User  = require('../../models/user');

module.exports = {
    createUser: async args => {
        try{
            //Checking if the email already exists in the database
            const existingUser = await User.findOne({email: args.userInput.email})
            if(existingUser){
                throw new Error('User exist already');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            //Creating the user
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            //Saving the user into the database
            const result = await user.save();
            return {
                ...result._doc,
                password: null,
                _id: result.id
            };
        }catch(error){
            throw error;
        }
    },
    users: async () => {
        try{    
            const users = await User.find();
            return users.map( user => {
                return user
            });
        }catch(error){
            throw error;
        }
    },
    login: async ({email, password}, context) => {
        //If user doesn't exist we can't login
        console.log("INSIDE LOGIN");
        console.log("The email is: ", email + " and the password is: " + password);
        const user = await User.findOne({ email: email });
        if(!user){
            throw new Error('User does not exist');
        }
        //Verify if password matches
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('Password is incorrect');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {expiresIn: '1h'});
        context.res.cookie("myCookie", "dskjskdjskdj");
        console.log("Cookie: ", context.res.cookie);
        return { userId: user.id, token: token, tokenExpiration: 1 };
    }
};