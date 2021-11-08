/* eslint-disable func-names */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        idEmp: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
        },
        firstName: {
            type: String,
        },
        dateCreated: {
            type: Date,
        },
        department: {
            type: String,
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
