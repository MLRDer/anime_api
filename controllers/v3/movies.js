const axios = require('axios');
const FormData = require('form-data');
const _ = require('lodash');
const Movie = require('../../models/Movie');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Format = require('../../utils/format');
const errors = require('../../constants/errors');
const hdrezkaActions = require('../../constants/hdrezka-actions');

const getHdrezkaSources = async (payload, hdrezkaUrl) => {
    const body = new FormData();

    for (key in payload) {
        body.append(key, payload[key]);
    }

    var config = {
        method: 'post',
        url: `https://rezka.ag/ajax/get_cdn_series/?t=${new Date().getTime()}`,
        headers: {
            ...body.getHeaders(),
        },
        data: body,
    };

    const data = await axios(config);

    let { url, subtitle, subtitle_lns } = data.data,
        sources = [],
        subtitles = [];

    if (!url && hdrezkaUrl) {
        const html = await axios.get(hdrezkaUrl);
        var match = html.data.match(/"streams":"(.+)","default_quality"/);
        if (match && match.length && match[1])
            url = match[1].replace(/\\\//g, '/');
    }

    if (url) {
        url = url.split(',');
        for (let item of url) {
            let source = {
                quality: item
                    .match(/\[+(.*?)\]+/g)[0]
                    .replace(/\[+(.*?)\]+/g, '$1'),
                url: item.slice(item.search('or ') + 3),
            };
            sources.push(source);
        }
    }

    if (subtitle) {
        subtitle = subtitle.split(',');
        for (let item of subtitle) {
            let sub = {
                language: item
                    .match(/\[+(.*?)\]+/g)[0]
                    .replace(/\[+(.*?)\]+/g, '$1'),
                url: item.match(
                    /(http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/
                )[0],
            };
            subtitles.push(sub);
        }
    }

    const formatedSubtitles = Format.subtitles(subtitles, subtitle_lns);

    return { sources, subtitles: formatedSubtitles };
};

exports.sources = catchAsync(async (req, res, next) => {
    const movie = await Movie.findOne({
        _id: req.body.id,
    })
        .select('+episodes')
        .lean();

    if (!movie) {
        return next(new AppError(404, errors.NOT_FOUND));
    }

    let sources = {
            en: null,
            ru: null,
        },
        subtitles = [],
        hdrezkaSources;

    for (i in sources) {
        const payload = {
            id: movie.hdrezka,
            translator_id: movie[i].translator_id,
        };
        let episode;

        if (movie.isSerial) {
            episode = movie.episodes.find((e) => e._id == req.body.episode);

            payload.action = hdrezkaActions.get_stream;
            payload.season = episode.season;
            payload.episode = episode.episode;
        } else {
            payload.action = hdrezkaActions.get_movie;
        }

        try {
            hdrezkaSources = await getHdrezkaSources(payload, movie.hdrezkaUrl);
        } catch (error) {
            console.log(error);
        }

        if (hdrezkaSources) {
            sources[i] = hdrezkaSources?.sources.length
                ? hdrezkaSources.sources
                : episode?.sources?.[i] ?? [];
            subtitles = subtitles.concat(
                hdrezkaSources.subtitles,
                episode?.subtitles ?? []
            );
        }
    }

    res.status(200).json({
        success: true,
        data: {
            sources,
            subtitles: _.uniqBy(subtitles, 'lang_code'),
        },
    });
});
