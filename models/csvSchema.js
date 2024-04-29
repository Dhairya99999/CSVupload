const mongoose = require('mongoose')

const csvSchema = new mongoose.Schema({
    file: {
        type: String,
        required: true
    },
    header:{
        type:[Object]
    },
    data:{
        type:[Object]
    }
},{
    timestamps: true
})

const Csv = mongoose.model('Csv',csvSchema)

module.exports = Csv