const mongoose = require('mongoose');
const Movie = require('../../models/Movie');
const Collection2 = require('../../models/Collection2');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const errors = require('../../constants/errors');

exports.getAll = catchAsync(async (req, res, next) => {
    const collections = await Collection2.find()
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
        data: collections,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    let collection;

    if (req.query.generated && req.query.generated == 'true') {
        const movies = await Movie.find({
            _id: {
                $in: req.params.id
                    .split(',')
                    .map((id) => mongoose.Types.ObjectId(id)),
            },
            isActive: true,
        })
            .select(
                '_id ru.title en.title ru.poster en.poster rating createdAt views'
            )
            .lean();

        collection = {
            movies,
        };
    } else {
        collection = await Collection2.findById(req.params.id)
            .populate({
                path: 'movies',
                match: { isActive: true },
                select:
                    '_id en.title ru.title rating en.image en.poster ru.image ru.poster',
            })
            .lean();
    }

    if (!collection) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: collection,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const coll = await Collection2.create(req.body);

    const collection = await Collection2.findById(coll._id)
        .populate({
            path: 'movies',
            match: { isActive: true },
            select:
                '_id en.title ru.title rating en.image en.poster ru.image ru.poster',
        })
        .lean();

    res.status(201).json({
        success: true,
        data: collection,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    const collection = await Collection2.findByIdAndUpdate(
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

    if (!collection) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: collection,
    });
});

exports.push = catchAsync(async (req, res, next) => {
    const collection = await Collection2.findByIdAndUpdate(
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
    await Collection2.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});
