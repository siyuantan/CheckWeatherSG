const { Telegraf } = require('telegraf');
const https = require('https');
require('dotenv').config();


const bot = new Telegraf(process.env.BOT_TOKEN);

// considering to update to momentjs
const d = new Date();
const currentYear = d.getFullYear().toString();
const currentMonth = d.getMonth().toString();
const currentDate = d.getDate().toString();
const currentHour = d.getHours().toString().length < 2 ? '0' + d.getHours() : d.getHours();
const currentMin = d.getMinutes().toString().length < 2 ? '0' + d.getMinutes() : d.getMinutes();
const currentSec = d.getSeconds().toString().length < 2 ? '0' + d.getSeconds() : d.getSeconds();
const currentDateTimeStr = currentYear + '-' + (currentMonth + 1) + '-' + currentDate + 'T' +
    currentHour + ':' + currentMin + ':' + currentSec;

bot.start((ctx) => {
    let message = `Hi there, what would you like me to do?\n`;
    message += `Current time is ${currentDateTimeStr}`;
    ctx.reply(message);
});

bot.help((ctx) => {
    let message = `Help pressed`;
    ctx.reply(message);
});

bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.on('inline_query', (ctx) => {
    const result = ['1', 'two', '3'];
    // Explicit usage
    ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

    // Using context shortcut
    ctx.answerInlineQuery(result)
});

bot.command('weather', (ctx) => {
    https.get(`https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=${currentDateTimeStr}`, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
            ctx.reply('Loading...');
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            ctx.reply(JSON.parse(data).items[0].forecasts[0].area + '\n' + JSON.parse(data).items[0].forecasts[0].forecast);
        });

    }).on("error", (err) => {
        ctx.reply("Error retrieving weather: " + err.message);
    });
});


bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
