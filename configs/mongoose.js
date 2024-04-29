const dotenv = require('dotenv')
dotenv.config();

const mongoose = require('mongoose');

const url = process.env.DB_URL

async function mongo() {
        await mongoose.connect(`${url}/csvFileUpload`);
  }
mongo().then(()=>{
    console.log('Connected to mongoDB')
}).catch((error)=>{
    console.log('Unable to connect to mongoDB', error)
})
