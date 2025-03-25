const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const UserScheme = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'guest', 'admin']
        },
        status: {
            type: Number, // 0 = pending, 1 = verified
            default: 0
        },
        emailCode: {
            type: String,
           // required: true,
            minlength: 6,
            maxlength: 6
        },
        personalInfo: {
            firstName: String,
            lastName: String,
            nif: String
        },
        companyInfo: {
            companyName: String,
            cif: String,
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        logoUrl: String,
    },
    {
        timestamps: true,
        versionKey: false
    }
);

UserScheme.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("users", UserScheme);
