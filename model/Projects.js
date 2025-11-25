const mongoose = require("mongoose")
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    hero: {
        type: String,
        required: true
    },
    projectLink: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("project", adminSchema)