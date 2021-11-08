const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// @desc    Create user
// @route   POST /api/v1/users
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(200).json({ success: true, data: user });
    next();
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
exports.updateUser = asyncHandler(async (req, res, next) => {

    await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        context: "query",
    }).then((user) => {
        res.status(200).json({ success: true, data: user });
    }).catch((error) => { 
        next( new ErrorResponse(`No user with that id of ${req.params.id}`,400));
    });
});

// @desc    Get all users
// @route   GET /api/v1/users
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find({});
    return !users
    ? next(new ErrorResponse(`No users exist`, 400))
    : res.status(200).json({ success: true, data: users })
});

// @desc    Get users by department
// @route   GET /api/v1/users/departments
exports.getUsersByDepartment = asyncHandler(async (req, res, next) => {

    const usersByDep = await User.find({ department: req.query.department });
    return (usersByDep.length === 0)
        ? next(new ErrorResponse(`No users exist in the department ${req.query.department}`, 400))
        : res.status(200).json({ success: true, data: usersByDep })  
});
