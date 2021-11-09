const express = require("express");
const {
    createUser,
    updateUser,
    getUsers,
    getUsersByDepartment
} = require("../controllers/users");

const router = express.Router({ mergeParams: true });

router
    .route("/departments")
    .get(getUsersByDepartment);
router
    .route("/")
    .get(getUsers)
    .post(createUser);

router
    .route("/:id")
    .put(updateUser);

module.exports = router;
