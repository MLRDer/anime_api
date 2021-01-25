const Anime = require("../models/Anime");
const Collection = require("../models/Collection");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const FormData = require("form-data");
const errors = require("../constants/errors");
const axios = require("axios");
require("dotenv/config");

const IMDBScraper = require("imdb-scraper");
const Imdb = new IMDBScraper({ requestDefaults: {}, maxRetries: 3 });

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

    const animes = await Anime.find(query)
        .select("_id title poster rating createdAt")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

    const cquery = type ? { isActive: true, type: type } : { isActive: true };
    const count = await Anime.find().count(cquery);

    res.status(200).json({
        success: true,
        data: animes,
        count: count,
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

exports.movieCreate = catchAsync(async (req, res, next) => {
    const body = new FormData();
    body.append("q", req.body.search);

    var config = {
        method: "post",
        url: "https://rezka.ag/engine/ajax/search.php",
        headers: {
            ...body.getHeaders(),
        },
        data: body,
    };

    const data = await axios(config);

    let str = data.data;

    // extract movie id from html
    str = str.slice(str.search("http"));
    str = str.slice(0, str.search(">") - 1);
    const id = str.slice(str.lastIndexOf("/") + 1, str.search("-"));
    //console.log(id);

    res.status(201).json({
        success: true,
        data: id,
    });
});

exports.getSources = catchAsync(async (req, res, next) => {
    const body = new FormData();
    body.append("translator_id", 238);
    body.append("id", req.body.id);

    if (req.body.isSerial) {
        body.append("action", "get_stream");
        body.append("season", req.body.season);
        body.append("episode", req.body.episode);
    } else {
        body.append("action", "get_movie");
    }

    console.log(body);

    var config = {
        method: "post",
        url: `https://rezka.ag/ajax/get_cdn_series/?t=${new Date().getTime()}`,
        headers: {
            ...body.getHeaders(),
        },
        data: body,
    };

    const data = await axios(config);

    let str = data.data.url;
    str = str.split(",");
    let sources = [];
    for (let item of str) {
        let source = {
            quality: item
                .match(/\[+(.*?)\]+/g)[0]
                .replace(/\[+(.*?)\]+/g, "$1"),
            url: item.slice(item.search("or ") + 3),
        };
        sources.push(source);
    }

    res.status(201).json({
        success: true,
        data: sources,
    });
});

exports.imdb = catchAsync(async (req, res, next) => {
    Imdb.title(req.query.id)
        .then((data) => {
            res.status(200).json({
                success: true,
                data: data,
            });
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                data: null,
            });
        });
});

exports.card = catchAsync(async (req, res, next) => {
    const card = await Anime.find({ isCard: true, isActive: true })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

    const collections = await Collection.find()
        .populate({
            path: "data",
            match: { isActive: true },
        })
        .lean();

    res.status(200).json({
        success: true,
        data: { card, collections },
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

exports.updateEpisode = catchAsync(async (req, res, next) => {
    const anime = await Anime.findOneAndUpdate(
        {
            _id: req.params.id,
            "episodes._id": req.params.episodeId,
        },
        {
            $set: {
                "episodes.$": req.body,
            },
        },
        { new: true }
    );

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
        .select("+episodes")
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
    console.log(req.query);
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
    let query = { isActive: true };
    const { quality, year, categories, rating, isSerial, isActive } = req.query;

    quality && (query.quality = quality);
    year && (query.year = year);
    categories && (query.categories = { $in: categories.split(",") });
    rating && (query.rating = { $gte: rating });
    isSerial && (query.isSerial = isSerial);
    isActive && (query.isActive = isActive);

    const animes = await Anime.find(query).lean();
    res.status(200).json({
        success: true,
        data: animes,
    });
});
