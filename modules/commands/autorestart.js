const restartSwitch = true; // Công tắc cho phép/tắt lệnh restart

module.exports.config = {
    name: 'autorestart',
    version: '1.1.1',
    hasPermssion: 3,
    credits: 'tnt',
    description: 'Tự động restart',
    commandCategory: 'Hệ thống',
    usages: 'tự động khởi động lại',
    cooldowns: 2
};

module.exports.run = async function ({ api, args, event }) {
    const { threadID } = event;

    // Tự động restart theo nhiều mốc thời gian đã đặt
    const autoRepeatIntervals = [45 * 60 * 1000]; // Thời gian tính bằng mili giây

    // Công tắc restart vòng lặp theo giờ đã cài và không kết thúc
    if (restartSwitch) {
        if (!args[0] || isNaN(args[0])) {
            // Nếu không có tham số hoặc tham số không hợp lệ, sử dụng mốc thời gian mặc định
            autoRepeatIntervals.forEach(interval => {
                const millisecondsUntilNextRestart = calculateMillisecondsUntilNextRestart(interval);
                scheduleRestart(api, threadID, millisecondsUntilNextRestart);
            });
        } else {
            // Nếu có tham số là thời gian mới, sử dụng thời gian đó để tính toán thời gian đến lần restart tiếp theo
            const time = parseInt(args[0]);

            if (time > 0) {
                api.sendMessage(`Bot sẽ tự động khởi động lại sau ${time} giây.`, threadID);
                scheduleRestart(api, threadID, time * 1000);
            } else {
                api.sendMessage(`Vui lòng nhập một khoảng thời gian hợp lệ (số giây) để tự động khởi động lại.`, threadID, event.messageID);
            }
        }
    } else {
        api.sendMessage(`Công tắc tự động restart hiện đang tắt.`, threadID);
    }
};

// Công tắc on / off lệnh restart
function calculateMillisecondsUntilNextRestart(interval) {
    const currentTime = new Date();
    const nextRestartTime = new Date(currentTime.getTime() + interval);

    return nextRestartTime - currentTime;
}

function scheduleRestart(api, threadID, delay) {
    setTimeout(() => {
        api.sendMessage(`Đang bắt đầu quá trình khởi động lại...`, threadID);
        process.exit(1);
    }, delay);
}
