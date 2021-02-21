const Update = require("../models/Update");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = catchAsync(async (req, res, next) => {
    const updates = await Update.find().lean();

    res.status(200).json({
        success: true,
        data: updates,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    const update = await Update.findById(req.params.id).lean();

    if (!update) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: update,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const update = await Update.create(req.body);

    res.status(201).json({
        success: true,
        data: update,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    const update = await Update.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).lean();

    if (!update) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: update,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Update.findById(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});
