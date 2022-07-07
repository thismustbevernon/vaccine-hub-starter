
const db = require("../db")
const {BCRYPT_WORK_FACTOR} = require("../config")
const {BadRequestError,UnauthorizedError} = require("../utils/errors")
const bcrypt = require("bcrypt")


class User{
    static async makePublicUser(user){
        return{
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            location: user.location,
            date: user.date


        }
    }
    static async login(credentials){


        //user should submit their emails and passwords
        //if any of these fields are missing, throw an error
        //look up the user in the db by email
        //if a user is found compare the submitted password with the passoword in the db
        //if ther is a match return the user
        // if any of this goes wrong throw an error

        requiredFields.forEach(field => {
            if(!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })

        const user = await User.fetchUserByEmail(credentials.email)

        if(user){
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if(isValid){
                return User.makePublicUser(user)
            }
        }
        throw new UnauthorizedError("Invalid email/passowrd combo")
    }


    static async register(credentials){

        
        //user should submit their email,pw,rsvp status, and #of guests
        //if any of these fields are missing throw an error 
        //make sure no user already exists in the system with that email
        //if one does throw an error
        //take the user password and hash it 

        //take the use emails and lowercase it
        //create a new user in the db with the info
        //return the user

        const requiredFields = ["first_name","last_name","location","email","password","date"]
        requiredFields.forEach(field => {
            if(!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })

        if(credentials.email.indexOf("@") <= 0){
            throw new BadRequestError("Invalid email.");
        }


        const existingUser = await User.fetchUserByEmail(credentials.email)
        if(existingUser){
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }

        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)

        const lowercasedEmail = credentials.email.toLowerCase();

        const result = await db.query(`
        INSERT INTO users(
            first_name,
            last_name,
            email,
            location,
            password,
            date
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id,first_name,last_name,email,location,date;
        `, [credentials.first_name,credentials.last_name,lowercasedEmail,credentials.location, hashedPassword,credentials.date]

        )

        const user = result.rows[0]

        // return User.makePublicUser(user);

        return user

    }



    static async fetchUserByEmail(email){
        if(!email){
            throw new BadRequestError("No email provided")
        }

        const query = `SELECT * FROM users WHERE email = $1`
        const result = await db.query(query, [email.toLowerCase()])
        const user = result.rows[0]
        return user
    }
}


module.exports = User






