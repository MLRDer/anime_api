require('dotenv/config');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const Movie = require('../../models/Movie');
const catchAsync = require('../../utils/catchAsync');
const translator = require('../../constants/translator');

const IMDBScraper = require('imdb-scraper');
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
    const url = str.slice(str.search('http'));
    str = url;
    str = str.slice(0, str.search('>') - 1);
    const id = str.slice(str.lastIndexOf('/') + 1, str.search('-'));

    res.status(200).json({
        success: true,
        data: {
            id,
            url: str,
        },
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

    let { url } = data.data;

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

    res.status(200).json({
        success: true,
        data: sources,
    });
});

exports.getAllAvailableTranslators = catchAsync(async (req, res, next) => {
    const data = await axios.get(req.query.url);

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

    if (!result.length) {
        let match = data.data.match(
            /sof.tv.initCDNMoviesEvents\((.+)\, (.+)\, 'rezka.ag'/
        );
        let country = 'Country: ';
        $('table[class=b-post__info]')
            .find('td')
            .each((index, element) => {
                if (index == 5) {
                    country += $(element).text();
                }
            });

        if (!match) {
            match = data.data.match(
                /sof.tv.initCDNSeriesEvents\((.+)\, (.+)\, (.+)\, (.+)\, (.+)\, 'rezka.ag'/
            );
        }

        if (match && match.length && match[2]) {
            const something = translator.find(
                (el) => el.translator_id == match[2]
            );
            result.push({
                name: something ? something.name : country,
                translator_id: match[2],
            });
        }
    }

    res.status(200).json({
        success: true,
        data: result,
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
