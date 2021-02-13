const Actor = require('../models/Actor');
const Movie = require('../models/Movie');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.all = catchAsync(async (req, res, next) => {
    const actors = await Actor.find(
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

    const movies = await Movie.find(
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
        data: {
            actors,
            movies,
        },
    });
});
