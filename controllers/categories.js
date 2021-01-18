const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const errors = require('../constants/errors');

exports.getAll = catchAsync(async (req, res, next) => {
    const categories = await Category.find().lean();

    res.status(200).json({
        success: true,
        data: categories,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id).lean();

    if (!category) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: category,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const category = await Category.create(req.body);

    res.status(201).json({
        success: true,
        data: category,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).lean();

    if (!category) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: category,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Category.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});
