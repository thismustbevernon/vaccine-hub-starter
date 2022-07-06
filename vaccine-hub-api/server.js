const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const {NotFoundError} = require("./utils/errors")
 
const app = express()
//enables orign cross sharing of resources
app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

app.use ((res,req,next)=>{
    return next(new NotFoundError())
})
app.use((err,req,res,next)=>{
    const status = err.status || 500
    const message = err.message

    return res.status(status).json({
        error: {message,status}
    })
})



const PORT = process.env.PORT||3001

app.listen(PORT,()=>{
    console.log(`🚀 Server running http://localhost:${PORT}`)
})