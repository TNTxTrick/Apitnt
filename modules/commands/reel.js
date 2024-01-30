const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function downloadImage(url, destination) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  await fs.writeFile(destination, Buffer.from(response.data, 'binary'));
}

module.exports = {
  config: {
    name: "reels",
    aliases: [],
    author: "kshitiz",
    version: "1.1",
  },

  onStart: async function ({ api, event, args }) {
    const username = args[0];

    if (!username) {
      return;
    }

    try {
      const reels = await fetchInstagramReels(username);

      if (!reels || reels.length === 0) {
        api.sendMessage({ body: `No Instagram reels found for ${username}.` }, event.threadID, event.messageID);
        return;
      }

      const reelTitles = reels.map((reel, index) => `${index + 1}. Reel ${reel.id}`);
      const message = `Choose a reel by replying with its number:\n\n${reelTitles.join('\n')}`;

      const tempFilePath = path.join(os.tmpdir(), 'reels_response.json');
      await fs.writeFile(tempFilePath, JSON.stringify(reels));

      const info = await api.sendMessage({ body: message }, event.threadID);
      api.onReply.set(info.messageID, {
        commandName: 'reels',
        messageID: info.messageID,
        author: event.senderID,
        tempFilePath,
      });
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while fetching Instagram reels.\nPlease try again later.' }, event.threadID, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName, tempFilePath } = Reply;

    if (event.senderID !== author || !tempFilePath) {
      return;
    }

    const reelIndex = parseInt(args[0], 10);

    if (isNaN(reelIndex) || reelIndex <= 0) {
      api.sendMessage({ body: 'Invalid input.\nPlease provide a valid number.' }, event.threadID, event.messageID);
      return;
    }

    try {
      const reelsData = await fs.readFile(tempFilePath, 'utf-8');
      const reels = JSON.parse(reelsData);

      if (!reels || reels.length === 0 || reelIndex > reels.length) {
        api.sendMessage({ body: 'Invalid reel number.\nPlease choose a number within the range.' }, event.threadID, event.messageID);
        return;
      }

      const selectedReel = reels[reelIndex - 1];
      const reelUrl = selectedReel.video_url;

      if (!reelUrl) {
        api.sendMessage({ body: 'Error: Reel not found.' }, event.threadID, event.messageID);
        return;
      }

      const tempReelPath = path.join(os.tmpdir(), 'reels_video.mp4');
      await downloadImage(reelUrl, tempReelPath);

      await api.sendMessage({
        body: `Here is the Instagram reel:`,
        attachment: fs.createReadStream(tempReelPath),
      }, event.threadID);

      await fs.unlink(tempReelPath);
    } catch (error) {
      console.error(error);
      api.sendMessage({ body: 'An error occurred while processing the reel.\nPlease try again later.' }, event.threadID, event.messageID);
    } finally {
      await fs.unlink(tempFilePath);
      api.onReply.delete(event.messageID);
    }
  },
};


