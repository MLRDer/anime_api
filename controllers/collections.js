const Collection = require("../models/Collection");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const errors = require("../constants/errors");

exports.getAll = catchAsync(async (req, res, next) => {
    const collections = await Collection.find().populate("media").lean();

    res.status(200).json({
        success: true,
        data: collections,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    const collection = await Collection.findById(req.params.id)
        .populate("media")
        .lean();

    if (!collection) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: collection,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const collection = await Collection.create(req.body);

    res.status(201).json({
        success: true,
        data: collection,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    const collection = await Collection.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).lean();

    if (!collection) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: collection,
    });
});

exports.push = catchAsync(async (req, res, next) => {
    const collection = await Collection.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                data: {
                    $each: req.body.media,
                },
            },
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: collection,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Collection.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});
