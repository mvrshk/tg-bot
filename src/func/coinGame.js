async function playCoinTossGame(ctx, userChoice) {
    const result = Math.random() < 0.5 ? 'Орел' : 'Решка';
    const choice = userChoice === 'earl' ? 'Орел' : 'Решка';

    if (choice === result) {
        await ctx.reply(`Выбор: ${choice}. ww`);
    } else {
        await ctx.reply(`Выбор: ${choice}. =( Результат: ${result}`);
    }
}

module.exports = { playCoinTossGame };