const Anime = require("../models/Anime");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const errors = require("../constants/errors");
require("dotenv/config");

exports.getAll = catchAsync(async (req, res, next) => {
    const category = req.query.category;
    const animes = await Anime.find(!category ? {} : { category }).lean();

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
        data: Anime,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Anime.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});

exports.addSeries = catchAsync(async (req, res, next) => {
    const anime = await Anime.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                episodes: req.body,
            },
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: anime,
    });
});

exports.deleteSeries = catchAsync(async (req, res, next) => {
    const anime = await Anime.findByIdAndUpdate(
        req.params.id,
        {
            $pull: {
                episodes: { _id: req.params.seriesId },
            },
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: anime,
    });
});
