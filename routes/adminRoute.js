const { contactEmail, getEmailContact, deleteEmail } = require("../controller/adminController")


const router = require("express").Router()

router
    .post("/send-email", contactEmail)
    .get("/get-email", getEmailContact)
    .delete("/delete-email/:id", deleteEmail)

module.exports = router