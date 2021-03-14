const admin = require('firebase-admin');
const catchAsync = require('../../utils/catchAsync');

const serviceAccount = require('../../constants/cassette-notifications-firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

exports.subscribe = catchAsync(async (req, res, next) => {
    const { topic, token } = req.body;

    messaging.subscribeToTopic(token, topic);

    res.status(200).json({
        success: true,
    });
});

exports.send = catchAsync(async (req, res, next) => {
    const { bigText, message, title, image, deeplink } = req.body;

    // 'cassette:///collection/602534859c801234d8dcfdf9,602a6e7daa45004e989652f6?generated=true&title_ru=Novie filmi&title_en=New Movies',

    messaging.send({
        data: {
            bigText_en: bigText.en || '',
            bigText_ru: bigText.ru || '',
            message_en: message.en || '',
            message_ru: message.ru || '',
            title_en: title.en || '',
            title_ru: title.ru || '',
            image: image || '',
            deeplink: deeplink || '',
        },
        topic: 'all',
    });

    res.status(200).json({
        success: true,
    });
});
