const  mongoose = require ('mongoose')
const connectdb = async()=>{
    try {
        mongoose.set('strictQuery',false);
        const con = await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        console.log(`database is connected to ${con.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}
module.exports = connectdb;