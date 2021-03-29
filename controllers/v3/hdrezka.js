require('dotenv/config');
const axios = require('axios');
const FormData = require('form-data');
const Movie = require('../../models/Movie');
const catchAsync = require('../../utils/catchAsync');

/*
 *  all controllers related to hdrezka and imdb
 */

exports.getSources = catchAsync(async (req, res, next) => {
    const body = new FormData();
    body.append('translator_id', req.body.translator_id);
    body.append('id', req.body.id);

    if (req.body.isSerial) {
        body.append('action', 'get_stream');
        body.append('season', req.body.season);
        body.append('episode', req.body.episode);
    } else {
        body.append('action', 'get_movie');
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

    let { url, subtitle, subtitle_lns } = data.data;

    if (!url) {
        const movie = await Movie.findOne({ hdrezka: req.body.id }).lean();
        const html = await axios.get(movie.hdrezkaUrl);
        var match = html.data.match(/"streams":"(.+)","default_quality"/);
        if (match && match.length && match[1])
            url = match[1].replace(/\\\//g, '/');
    }

    let sources = [];
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

    let subtitles = [];
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

    res.status(200).json({
        success: true,
        data: { sources, subtitles, subtitle_lns },
    });
});
