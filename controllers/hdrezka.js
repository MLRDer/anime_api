const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const FormData = require('form-data');
const errors = require('../constants/errors');
const axios = require('axios');
require('dotenv/config');
const cheerio = require('cheerio');

const IMDBScraper = require('imdb-scraper');
const Imdb = new IMDBScraper({ requestDefaults: {}, maxRetries: 3 });

/*
 *  all controllers related to hdrezka and imdb
 */

const hdrezkaTest = async (id) => {
    const body = new FormData();
    const body1 = new FormData();
    body.append('translator_id', 238);
    body1.append('translator_id', 238);
    body.append('id', id);
    body1.append('id', id);

    body1.append('action', 'get_stream');
    body1.append('season', 1);
    body1.append('episode', 1);

    body.append('action', 'get_movie');

    var config = {
        method: 'post',
        url: `https://rezka.ag/ajax/get_cdn_series/?t=${new Date().getTime()}`,
        headers: {
            ...body.getHeaders(),
        },
        data: body,
    };

    var config1 = {
        method: 'post',
        url: `https://rezka.ag/ajax/get_cdn_series/?t=${new Date().getTime()}`,
        headers: {
            ...body1.getHeaders(),
        },
        data: body1,
    };

    const data = await axios(config);
    const data1 = await axios(config1);

    return data.data.success || data1.data.success;
};

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
    //console.log(id);
    const isAvailable = await hdrezkaTest(id);

    res.status(201).json({
        success: true,
        data: isAvailable ? id : null,
    });
});

exports.getSources = catchAsync(async (req, res, next) => {
    console.log(req.body);
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

    let str = data.data.url;
    str = str.split(',');
    let sources = [];
    for (let item of str) {
        let source = {
            quality: item
                .match(/\[+(.*?)\]+/g)[0]
                .replace(/\[+(.*?)\]+/g, '$1'),
            url: item.slice(item.search('or ') + 3),
        };
        sources.push(source);
    }

    res.status(201).json({
        success: true,
        data: sources,
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
