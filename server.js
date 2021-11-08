const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");

const DBconnection = require("./src/config/dbConnect");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();

DBconnection();

const userRoutes = require("./src/routes/users");

const app = express();

app.use(express.json());

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Enable CORS
app.use(cors({ origin: true }));

// Prevent http param pollution
app.use(hpp());

app.use(express.static(path.join(__dirname, "public")));

const versionOne = (routeName) => `/api/v1/${routeName}`;

app.use(versionOne("users"), userRoutes);

app.use(errorHandler);

const server = app.listen(process.env.PORT, () => {
    /* eslint-disable no-console */
    console.log(
        `We are live on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow
            .bold
    );
    /* eslint-enable no-console */
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    /* eslint-disable no-console */
    console.log(`Error: ${err.message}`.red);
    /* eslint-enable no-console */
    // Close server & exit process
    server.close(() => process.exit(1));
});
