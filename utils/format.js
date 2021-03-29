exports.subtitles = (subtitles, languages) => {
    let subs = subtitles.map((subtitle) => {
        const lang_code = languages[subtitle.language];
        const sub = {
            lang_code,
            ...subtitle,
        };
        return sub;
    });

    return subs;
};
