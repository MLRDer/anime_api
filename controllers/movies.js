const Actor = require('../models/Actor');
const Movie = require('../models/Movie');
const Collection2 = require('../models/Collection2');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const errors = require('../constants/errors');

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
    categories && (query.categories = { $in: categories.split(',') });
    rating && (query.rating = { $gte: rating });
    isSerial && (query.isSerial = isSerial);
    isActive && (query.isActive = isActive);
    page = page * 1 || 1;
    limit = limit * 1 || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find(query)
        .select('_id ru.title en.title ru.poster en.poster rating createdAt')
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
    let movie = {};

    if (req.params.id.length > 10) {
        movie = await Movie.findById(req.params.id)
            .populate('actors')
            .populate('categories')
            .lean();
    } else {
        movie = await Movie.findOne({ tmdbId: req.params.id })
            .populate('actors')
            .populate('categories')
            .lean();
    }

    if (!movie) {
        return next(new AppError(404, errors.NOT_FOUND));
    }

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
    })
        .populate('actors')
        .populate('categories')
        .lean();

    if (!movie) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: movie,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Movie.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});

// full text search
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

// extra routes
exports.card = catchAsync(async (req, res, next) => {
    const card = await Movie.find({ isCard: true, isActive: true })
        .select('en.title ru.title image poster')
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

    const collections = await Collection2.find()
        .populate({
            path: 'movies',
            match: { isActive: true },
            select: 'en.title ru.title rating image poster',
        })
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({
        success: true,
        data: { card, collections },
    });
});

exports.getEpisodes = catchAsync(async (req, res, next) => {
    const movie = await Movie.findById(req.params.id)
        .select('+episodes')
        .populate('actors')
        .populate('categories')
        .lean();

    if (!movie) {
        return next(new AppError(404, errors.NOT_FOUND));
    }

    res.status(200).json({
        success: true,
        data: movie,
    });
});

exports.addEpisode = catchAsync(async (req, res, next) => {
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                episodes: req.body,
            },
        },
        { new: true }
    ).select('episodes');

    res.status(200).json({
        success: true,
        data: movie,
    });
});

exports.updateEpisode = catchAsync(async (req, res, next) => {
    const movie = await Movie.findOneAndUpdate(
        {
            _id: req.params.id,
            'episodes._id': req.params.episodeId,
        },
        {
            $set: {
                'episodes.$.name.en': req.body.name.en,
                'episodes.$.name.ru': req.body.name.ru,
                'episodes.$.season': req.body.season,
                'episodes.$.episode': req.body.episode,
                'episodes.$.sources': req.body.sources,
            },
        },
        { new: true, select: 'episodes' }
    );

    let episode = {};
    for (let i = 0; i < movie.episodes.length; i++) {
        if (movie.episodes[i]._id == req.params.episodeId) {
            episode = movie.episodes[i];
            break;
        }
    }

    res.status(200).json({
        success: true,
        data: episode,
    });
});

exports.deleteEpisode = catchAsync(async (req, res, next) => {
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            $pull: {
                episodes: { _id: req.params.episodeId },
            },
        },
        { new: true }
    ).select('episodes');

    res.status(200).json({
        success: true,
        data: movie,
    });
});
