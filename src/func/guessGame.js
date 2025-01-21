async function startGuessNumberGame(ctx) {
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    currentGame[ctx.from.id] = { targetNumber, attempts: 0 };

    await ctx.reply('Я загадал число от 1 до 100. Попробуйте угадать!');
}


module.exports = {startGuessNumberGame};