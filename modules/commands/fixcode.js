const prettier = require('prettier');
const fs = require('fs');

module.exports.config = {
  name: "fixcode",
  version: "1.0.0",
  permissions: 1,
  credits: "tnt",
  description: "Tự động fix code",
  usages: "",
  commandCategory: "code",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  try {
    
    const filePath = __filename;
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    
    const formattedCode = prettier.format(fileContent, {
      parser: 'babel',
      singleQuote: true,
      semi: false,
    });

    
    fs.writeFileSync(filePath, formattedCode);

    api.sendMessage({ body: 'Code đã được tự động fix.' }, event.threadID);
  } catch (error) {
    console.error(error);
    api.sendMessage({ body: 'Đã xảy ra lỗi khi thực hiện fix code.' }, event.threadID);
  }
};
