const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User  = require('../../models/user');

const SECRET_KEY = "somesupersecretkey";

module.exports = {
    fetchUser: async (args, context) => {
        console.log("Inside fetchUser");
        // console.log("Context Incoming message: ", context.cookies.token);
        const token = context.cookies.token;
        if(!token){
            return next();
            // return "There is no Token";
        }else{
            const decodedToken = jwt.verify(token, SECRET_KEY, {expiresIn: '1h'});
            console.log("The decoded token is: ", decodedToken.userId);
            return{
                userId: decodedToken.userId,
                email: decodedToken.email
            }
        }
    },
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
        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {expiresIn: '1h'});
        context.res.cookie("token", token);
        // console.log("Cookie: ", context.res.cookie);
        return { userId: user.id };
    }
};