const mongoose = require('mongoose')
const mongooseURI = "mongodb://localhost:27017/rssnewsapp"

const connectToMongo = async()=>{
    await mongoose.connect(mongooseURI)
    .then(()=>{
        console.log("Connected to mongo successfully.");
    }).catch((error)=>{
        console.error(error);
    })
    
}

module.exports = connectToMongo