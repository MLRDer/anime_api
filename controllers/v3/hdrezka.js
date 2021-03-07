require('dotenv/config');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const IMDBScraper = require('imdb-scraper');
const catchAsync = require('../../utils/catchAsync');

const Imdb = new IMDBScraper({ requestDefaults: {}, maxRetries: 3 });

/*
 *  all controllers related to hdrezka and imdb
 */

exports.getID = catchAsync(async (req, res, next) => {
    const body = new FormData();
    body.append('q', req.query.search);

    var config = {
        method: 'post',
        url: 'https://rezka.ag/engine/ajax/search.php',
        headers: {
            ...body.getHeaders(),
        },
        data: body,
    };

    const data = await axios(config);

    let str = data.data;

    // extract movie id from html
    str = str.slice(str.search('http'));
    str = str.slice(0, str.search('>') - 1);
    const id = str.slice(str.lastIndexOf('/') + 1, str.search('-'));

    res.status(200).json({
        success: true,
        data: id,
    });
});

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

    url = url.split(',');
    let sources = [];
    for (let item of url) {
        let source = {
            quality: item
                .match(/\[+(.*?)\]+/g)[0]
                .replace(/\[+(.*?)\]+/g, '$1'),
            url: item.slice(item.search('or ') + 3),
        };
        sources.push(source);
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

exports.getIMDbInfo = catchAsync(async (req, res, next) => {
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

exports.getAllAvailableTranslators = catchAsync(async (req, res, next) => {
    const body = new FormData();
    body.append('q', req.query.title);

    var config = {
        method: 'post',
        url: 'https://rezka.ag/engine/ajax/search.php',
        headers: {
            ...body.getHeaders(),
        },
        data: body,
    };

    let data = await axios(config);
    let $ = cheerio.load(data.data);

    let links = $('a');
    data = await axios.get(links[0].attribs.href);

    let list_data;
    let result = [];
    $ = cheerio.load(data.data);
    $('ul[id=translators-list]')
        .find('li')
        .each((index, element) => {
            list_data = $(element).attr();
            result.push({
                name: list_data.title,
                translator_id: list_data['data-translator_id'],
            });
        });

    res.status(200).json({
        success: true,
        data: result,
    });
});
