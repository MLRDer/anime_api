const Error = require("../models/Error");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const errors = require("../constants/errors");

exports.getAll = catchAsync(async (req, res, next) => {
    const error = await Error.find()
        .populate({ path: "movieId", select: "+episodes" })
        .lean();

    res.status(200).json({
        success: true,
        data: error,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    const error = await Error.findById(req.params.id)
        .populate({ path: "movieId", select: "+episodes" })
        .lean();

    if (!error) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: error,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const error = await Error.create(req.body);

    res.status(200).json({
        success: true,
        data: error,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    const error = await Error.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).lean();

    if (!error) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: error,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Error.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});
