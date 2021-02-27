const Actor = require('../../models/Actor');
const Movie = require('../../models/Movie');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.getAll = catchAsync(async (req, res, next) => {
    const actors = await Actor.find().lean();

    res.status(200).json({
        success: true,
        data: actors,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    const actor = await Actor.findById(req.params.id).lean();

    if (!actor) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: actor,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const actor = await Actor.create(req.body);

    res.status(201).json({
        success: true,
        data: actor,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    const actor = await Actor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).lean();

    if (!actor) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: actor,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Actor.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});

exports.movies = catchAsync(async (req, res, next) => {
    const actor = await Actor.findById(req.params.id).lean();

    if (!actor) return next(new AppError(404, errors.NOT_FOUND));

    const movies = await Movie.find({ actors: { $in: req.params.id } })
        .select('_id ru.title en.title ru.poster en.poster rating createdAt')
        .lean();

    res.status(200).json({
        success: true,
        data: {
            ...actor,
            movies,
        },
    });
});

exports.search = catchAsync(async (req, res, next) => {
    const search = await Actor.find(
        {
            $text: {
                $search: req.query.search,
            },
        },
        {
            score: {
                $meta: 'textScore',
            },
        }
    )
        .sort({ score: { $meta: 'textScore' } })
        .lean();

    res.status(200).json({
        success: true,
        data: search,
    });
});
