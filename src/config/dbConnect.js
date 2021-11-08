const mongoose = require("mongoose");

const DBconnection = async () => {

    const conn = await mongoose
        .connect(process.env.MONGO_URI)
        .catch((err) => {
            /* eslint-disable no-console */
            console.log(
                "For some reasons we couldn't connect to the DB".red,
                err
            );
            /* eslint-enable no-console */
        });
    /* eslint-disable no-console */
    console.log(
        `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
};

module.exports = DBconnection;
