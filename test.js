const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");

const test = async () => {
    const body = new FormData();
    body.append("q", "Doctor House 2004");

    var config = {
        method: "post",
        url: "https://rezka.ag/engine/ajax/search.php",
        headers: {
            ...body.getHeaders(),
        },
        data: body,
    };

    let data = await axios(config);
    let $ = cheerio.load(data.data);

    let links = $("a");
    data = await axios.get(links[0].attribs.href);

    let list_data;
    let res = {};
    $ = cheerio.load(data.data);
    $("ul[id=translators-list]")
        .find("li")
        .each((index, element) => {
            list_data = $(element).attr();
            res = {
                name: list_data.title,
                translator_id: list_data["data-translator_id"],
            };
            console.log(res);
        });
};

test();
