const mongoose = require('mongoose')

const connectDb = async ()=>{

    try
    {
        const connection  = await mongoose.connect("mongodb+srv://monudixit0007:LLf5nR0ocKsFqF9y@cluster0.xo6ducm.mongodb.net/postdatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

    console.log('mongo db connected')

    }

    catch (error) 

    {
        console.log(error)
        process.exit(1)
    }
    
}

module.exports = connectDb