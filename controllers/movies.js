const Actor = require("../models/Actor");
const Movie = require("../models/Movie");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = catchAsync(async (req, res, next) => {
    let query = { isActive: true };
    let {
        quality,
        year,
        categories,
        rating,
        isSerial,
        type,
        isActive,
        page,
        limit,
    } = req.query;

    type && (query.type = type);
    quality && (query.quality = quality);
    year && (query.year = year);
    categories && (query.categories = { $in: categories.split(",") });
    rating && (query.rating = { $gte: rating });
    isSerial && (query.isSerial = isSerial);
    isActive && (query.isActive = isActive);
    page = page * 1 || 1;
    limit = limit * 1 || 20;
    const skip = (page - 1) * limit;

    // should be corrected
    const movies = await Movie.find(query)
        .select("_id title poster rating createdAt")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

    const cquery = type ? { isActive: true, type: type } : { isActive: true };
    const count = await Movie.countDocuments(cquery);

    res.status(200).json({
        success: true,
        data: movies,
        count: count,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    const movie = await Movie.findById(req.params.id).populate("actors").lean();

    if (!movie) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: movie,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const movie = await Movie.create(req.body);

    res.status(201).json({
        success: true,
        data: movie,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).lean();

    if (!movie) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: movie,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Movie.findById(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});

exports.search = catchAsync(async (req, res, next) => {
    const search = await Movie.find(
        {
            isActive: true,
            $text: {
                $search: req.query.search,
            },
        },
        {
            score: {
                $meta: "textScore",
            },
        }
    )
        .sort({ score: { $meta: "textScore" } })
        .lean();

    res.status(200).json({
        success: true,
        data: search,
    });
});
