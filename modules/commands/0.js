module.exports.config = {
    name: "danhbai",
    version: "2.0.5",
    hasPermssion: 3,
    credits: "tnt",
    description: "Chơi trò chơi đánh bài",
    commandCategory: "Game",
    usages: "[số người chơi] [số lá bài]",
    cooldowns: 5,
    dependencies: {}
}

module.exports.run = async function ({ api, args, event }) {
    const { threadID, senderID } = event;
    const numPlayers = parseInt(args[0]) || 4;
    const numCards = parseInt(args[1]) || 5;
    const commandName = args[2];

    if (isNaN(numPlayers) || isNaN(numCards) || numPlayers < 2 || numCards < 1) {
        return api.sendMessage("Vui lòng nhập số người chơi và số lá bài là số nguyên dương.", threadID);
    }

    const suits = ['Cơ', 'Rô', 'Tép', 'Bích'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const playersReady = [];

    function createDeck() {
        const deck = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push({ suit, rank });
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    function dealCards(deck, numPlayers, numCards) {
        const hands = Array.from({ length: numPlayers }, () => []);
        for (let i = 0; i < numCards; i++) {
            for (let j = 0; j < numPlayers; j++) {
                hands[j].push({ ...deck.pop(), order: i + 1 }); 
            }
        }
        return hands;
    }

    function displayHand(player, hand) {
        let message = `Người chơi ${player + 1} Lá bài:\n`;
        for (const card of hand) {
            message += `${card.rank} of ${card.suit} (Số thứ tự: ${card.order})\n`;
        }
        return message;
    }

    async function playGame(api, event, numPlayers, numCards) {
        const deck = shuffleDeck(createDeck());
        const hands = dealCards(deck, numPlayers, numCards);

        for (let i = 0; i < numPlayers; i++) {
            const playerHand = displayHand(i, hands[i]);
            await api.sendMessage(playerHand, senderID);
        }

        if (!playersReady.includes(senderID)) {
            playersReady.push(senderID);
        }

        if (playersReady.length === numPlayers) {
            const groupHand = hands.map((hand, index) => displayHand(index, hand)).join('\n');
            api.sendMessage(`Bài của mọi người:\n${groupHand}`, threadID);
        } else {
            api.sendMessage(`Người chơi ${senderID} đã sẵn sàng. Số người chơi đã sẵn sàng: ${playersReady.length}/${numPlayers}`, threadID);
        }
    }

    if (playersReady.length === 0 && (commandName && commandName.toLowerCase() === 'start')) {
        playGame(api, event, numPlayers, numCards);
    } else {
        if (playersReady.length > 0) {
            api.sendMessage(`Người chơi đang chờ. Hãy sử dụng lệnh ${event.prefix}danhbai start để bắt đầu trò chơi.`, threadID);
        } else {
            api.sendMessage(`Hãy sử dụng lệnh /danhbai [số người chơi] [số lá bài] start để tham gia vào bàn đánh bài.`, threadID);
        }
    }
}
