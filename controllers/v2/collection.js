const Collection2 = require('../../models/Collection2');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const errors = require('../../constants/errors');

exports.getAll = catchAsync(async (req, res, next) => {
    const collection2s = await Collection2.find()
        .populate({
            path: 'movies',
            match: { isActive: true },
            select:
                '_id en.title ru.title rating en.image en.poster ru.image ru.poster',
        })
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({
        success: true,
        data: collection2s,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    const collection2 = await Collection2.findById(req.params.id)
        .populate({
            path: 'movies',
            match: { isActive: true },
            select:
                '_id en.title ru.title rating en.image en.poster ru.image ru.poster',
        })
        .lean();

    if (!collection2) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: collection2,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const coll2 = await Collection2.create(req.body);

    const collection2 = await Collection2.findById(coll2._id)
        .populate({
            path: 'movies',
            match: { isActive: true },
            select:
                '_id en.title ru.title rating en.image en.poster ru.image ru.poster',
        })
        .lean();

    res.status(201).json({
        success: true,
        data: collection2,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    const collection2 = await Collection2.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )
        .populate({
            path: 'movies',
            match: { isActive: true },
            select:
                '_id en.title ru.title rating en.image en.poster ru.image ru.poster',
        })
        .lean();

    if (!collection2) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: collection2,
    });
});

exports.push = catchAsync(async (req, res, next) => {
    const collection2 = await Collection2.findByIdAndUpdate(
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
        data: collection2,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Collection2.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});
