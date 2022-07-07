const db = require("../db")
const {UnauthorizedError} = require ("../utils/errors")

class User{
    static async login(credentials){
        //user should submit their emails and passwords
        //if any of these fields are missing, throw an error
        //look up the user in the db by email
        //if a user is found compare the submitted password with the passoword in the db
        //if ther is a match return the user
        // if any of this goes wrong throw an error
        throw new UnauthorizedError("Invalid email/passowrd combo")
    }

    static async register (credentials){
        //user should submit their email,pw,rsvp status, and #of guests
        //if any of these fields are missing throw an error 
        //make sure no user already exists in the system with that email
        //if one does throw an error
        //take the user password and hash it 

        //take the use emails and lowercase it
        //create a new user in the db with the info
        //return the user
    }
}


module.exports = User