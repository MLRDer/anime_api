const Anime = require("../models/Anime");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const errors = require("../constants/errors");
require("dotenv/config");

exports.getAll = catchAsync(async (req, res, next) => {
    const animes = await Anime.find()
        .sort({ createdAt: -1 })

        .lean();

    res.status(200).json({
        success: true,
        data: animes,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    const anime = await Anime.findById(req.params.id).lean();

    if (!anime) {
        return next(new AppError(404, errors.NOT_FOUND));
    }

    res.status(200).json({
        success: true,
        data: anime,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const anime = await Anime.create(req.body);

    res.status(201).json({
        success: true,
        data: anime,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    let anime = await Anime.findById(req.params.id);

    if (!anime) {
        return next(new AppError(404, errors.NOT_FOUND));
    }

    anime = await Anime.findByIdAndUpdate(anime._id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: anime,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Anime.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});

exports.getEpisodes = catchAsync(async (req, res, next) => {
    const anime = await Anime.findById(req.params.id)
        .select("title episodes")
        .lean();

    if (!anime) {
        return next(new AppError(404, errors.NOT_FOUND));
    }

    res.status(200).json({
        success: true,
        data: anime,
    });
});

exports.addEpisode = catchAsync(async (req, res, next) => {
    const anime = await Anime.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                episodes: req.body,
            },
        },
        { new: true }
    ).select("episodes");

    res.status(200).json({
        success: true,
        data: anime,
    });
});

exports.deleteEpisode = catchAsync(async (req, res, next) => {
    const anime = await Anime.findByIdAndUpdate(
        req.params.id,
        {
            $pull: {
                episodes: { _id: req.params.episodeId },
            },
        },
        { new: true }
    ).select("episodes");

    res.status(200).json({
        success: true,
        data: anime,
    });
});

exports.search = catchAsync(async (req, res, next) => {
    const search = await Anime.find(
        {
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

    res.status(200).json(search);
});

exports.filter = catchAsync(async (req, res, next) => {
    let query = {};
    const { quality, year, categories, rating, isSerial } = req.query;

    quality && (query.quality = quality);
    year && (query.year = year);
    categories && (query.categories = { $in: categories });
    rating && (query.rating = { $gte: rating });
    isSerial && (query.isSerial = isSerial);

    const animes = await Anime.find(query).lean();
    res.status(200).json({
        success: true,
        data: animes,
    });
});
