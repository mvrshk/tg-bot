const { Bot, InlineKeyboard } = require('grammy');

const bot = new Bot('7707427846:AAGlk1n3_Yd-uYeVVsGR0a-6SF7HUrTIJ_g');

bot.command('start', (ctx) => {
    const keyboard = new InlineKeyboard()
        .text('1', 'var1')
        .text('2', 'var2')
        .row()
        .text('помогите', 'help');
        ctx.reply('Привет!  напиши /help, чтобы ботика на веранде оес!! есои прост на кнопки надо пожмякать, вперед',{reply_markup: keyboard});
});

bot.on('callback_query:data', (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data === 'var1'){
        ctx.answerCallbackQuery('Неправильный вариант...');
        ctx.reply('лучше выберите другой.');
    }else  if (data === 'var2'){
        ctx.answerCallbackQuery('верно!!! с нас 5к в подарок');
        ctx.reply('лучше выберите другой.');
    }else if (data === 'help'){
        ctx.answerCallbackQuery('вам особо не помочь');
        ctx.reply('помощь только через /help.');
    }
})

bot.command('help', (ctx) => {
    ctx.reply('/start - привет\n/help - помосчь\n/echo - повторить сообщение\n/jonk - спой песню');
});

bot.command('echo', (ctx) => {
    const message = ctx.message.text.split(' ').slice(1).join(' ');
    ctx.reply(message||'напиши прикол, чтоб я copypaste тип смешной');
});

bot.command('jonk', async (ctx) => {
    const muz = [
        'В старом доме на обочине\nТри цветка, три дочери\nАманда, Линда и Роуз\nАманда, Линда и Роуз\nРисовали акварелями\nЧтоб забыть о времени\nАманда, Линда и Роуз\nАманда, Линда и Роуз',
        'Этот рэпер диссит VIPERR, хз, как он называется\nТипа влево шаг, вправо шаг, деньги просто спавнятся\nСкажи, что слушаешь VIPERR, если хочешь ей понравиться (Факт)\nА-а-а, VIPERR-лига — это чемпион\nТеперь, как Нико Беллик, на FM Владивосток\nИ ты ничё не дропаешь, потому что у тебя застой\nТы переводишь чужой рэп, а у меня секси-рэп\n',
        'Я знаю твоего отца, он знает меня тоже.\n Я мало ему нравлюсь — в этом мы с ним так похожи.\n Зато я нравлюсь твоей маме, с ней гораздо проще',
        'Кто придумал сосны, маму и кефир?\n Кто нас поливает проливным дождем, \nКто про завтра знает уже сегодня днем?\n Тимочка-философ в облака глядит',
    ];

    const randJonk = muz[Math.floor(Math.random() * muz.length)];
    await ctx.reply(randJonk);
});

bot.start();
console.log('bot starts.');