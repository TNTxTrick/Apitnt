 const axios = require("axios");
const fs = require("fs");
module.exports.config = {
    name: "cap",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Thiệu Trung Kiên",
    description: "Chụp ảnh profile của người dùng",
    commandCategory: "THÀNH VIÊN",
    usages: "",
    cooldowns: 5
}
module.exports.handleEvent = async ({ api, event, Threads, args, Users }) => {
  try{
  if(event.body.toLowerCase() == "cap"){
    const name = await Users.getNameUser(event.senderID)
    api.sendMessage(`Đợi tý đi ${name}!!`, event.threadID, event.messageID);
    if (event.type == "message_reply") {
      var uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length == 1) {
      var uid = Object.keys(event.mentions)[0];
    }
  else {
          var uid = event.senderID;
    }
    var cookies = `usida=eyJ2ZXIiOjEsImlkIjoiQXM1bTR6MjE0Z3JwOXkiLCJ0aW1lIjoxNzAyNDg1MDM4fQ%3D%3D;zsh=ASRA5A-di7aBdlGFsHeirP-UPNS7Dc7zmJVABzNUa_lctsbPydlYVd4DxJuBeVk8GKZU4ayWSdcktKgv7zPUpLaDVDntQDlmY34BF-uRVB2GqowXHjfe1rkrAaGeFXM1hALuAxdAH_WOsGVpn32brnyktMtnrxODqiN6xEZDUaVItJEXPRRnHZd7UkXkKMoJEL13bSjEUJ42pfckeAtBKaajMYwXaX317qWVGzw1T0l5I_BzwT9eP54-Q4rq3FdMqkOhQ0S8iz1FpFJkYPOudtrH_ERMMFphz2jzP_GyqtkDCoLHmugy762tminnpKVTNbV4mZK9HrDkFsGMqybTU0Oq1-Lwm332RhesuloPTE4lg1PN;datr=z1qZZR3HFjno65VBclg0RPM4;sb=z1qZZd1KHpXoqrqdhR_aAHjq;locale=vi_VN;oo=v1;m_ls=%7B%22c%22%3A%7B%221%22%3A%22HCwAABaaBhbSkaiQDRMFFszvnsj__hsA%22%2C%222%22%3A%22GSwVQBxMAAAWARaEsdDZDBYAABV-HEwAABYAFoSx0NkMFgAAFigA%22%2C%2295%22%3A%22HCwAABYIFuyryIoPEwUWzO-eyP_-GwA%22%7D%2C%22d%22%3A%2233dd8f4e-5af2-4632-a0e2-40c23010106a%22%2C%22s%22%3A%221%22%2C%22u%22%3A%22wcmohu%22%7D;c_user=61554000460794;fbl_ci=2611749118980667;m_page_voice=61554000460794;fbl_cs=AhDzoZEmuyiHYEP3VZBXfyPXGFhqPVNaOURzPVJuUE9FcUxEQ3VZd0VxMA;vpd=v1%3B736x393x2.75;dpr=2.75;wd=393x736;xs=34%3A11wfHtIYLXwqLA%3A2%3A1704897109%3A-1%3A9620;fr=0skO4UPDkZcSNZmoV.AWVf4NVvSEnHMQCpDzRBFukpG-Q.BlmoWW.ki.AAA.0.0.BlnqpR.AWWCOm2lGtM;fbl_st=101121446%3BT%3A28416268;wl_cbv=v2%3Bclient_version%3A2392%3Btimestamp%3A1704976096;`,
    vaildItems = ['sb', 'datr', 'c_user', 'xs', 'm_pixel_ratio', 'locale', 'wd', 'fr', 'presence', 'xs', 'm_page_voice', 'fbl_st', 'fbl_ci', 'fbl_cs', 'vpd', 'wd', 'fr', 'presence'];
    var cookie = ``;
    cookies.split(';').forEach(item => {
        var data = item.split('=');
        if (vaildItems.includes(data[0])) cookie += `${data[0]}=${data[1]};`;
    });
    var url = encodeURI(encodeURI((`https://cfb1f70b-5247-4aec-8c28-9d8fb3be4112-00-1702vtd6g5du2.sisko.replit.dev/screenshot/${uid}/${cookie}`))),
        path = __dirname + `/cache/${uid}.png`;
    axios({
        method: "GET",
        url: `https://api.screenshotmachine.com/?key=006b37&url=${url}&dimension=1024x768`,
        responseType: "arraybuffer"
    }).then(res => {
        fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
        api.sendMessage({ 	body: `『 𝗖𝗔𝗣 𝗪𝗔𝗟𝗟 』\n  \n━━━━━━━━━━\n 𝗮̂𝘆 𝗱𝗼̂ 𝗰𝗮𝗽 𝘁𝗿𝗮𝗻𝗴 𝗰𝗮́ 𝗻𝗵𝗮̂𝗻 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝘅𝗼𝗻𝗴 𝗿𝗼̂̀𝗶 𝗻𝗲̀ ${name} \n \n→ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝗰𝗮𝗽 𝘄𝗮𝗹𝗹 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗰𝗮𝗽`,
                         attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    }).catch(err => console.log(err));
  }
} catch(e){
    console.log(e)
}}
module.exports.run = async function ({ api,Users,event, args }) {
  const name = await Users.getNameUser(event.senderID)
    api.sendMessage(`Đợi tý đi ${name}!!`, event.threadID, event.messageID);
    var uid = String(args[0]);
    isNaN(uid) && (uid = Object.keys(event.mentions)[0], "message_reply" == event.type ? uid = event.messageReply.senderID : uid = event.senderID);
    var cookies = `usida=eyJ2ZXIiOjEsImlkIjoiQXM1bTR6MjE0Z3JwOXkiLCJ0aW1lIjoxNzAyNDg1MDM4fQ%3D%3D;zsh=ASRA5A-di7aBdlGFsHeirP-UPNS7Dc7zmJVABzNUa_lctsbPydlYVd4DxJuBeVk8GKZU4ayWSdcktKgv7zPUpLaDVDntQDlmY34BF-uRVB2GqowXHjfe1rkrAaGeFXM1hALuAxdAH_WOsGVpn32brnyktMtnrxODqiN6xEZDUaVItJEXPRRnHZd7UkXkKMoJEL13bSjEUJ42pfckeAtBKaajMYwXaX317qWVGzw1T0l5I_BzwT9eP54-Q4rq3FdMqkOhQ0S8iz1FpFJkYPOudtrH_ERMMFphz2jzP_GyqtkDCoLHmugy762tminnpKVTNbV4mZK9HrDkFsGMqybTU0Oq1-Lwm332RhesuloPTE4lg1PN;datr=z1qZZR3HFjno65VBclg0RPM4;sb=z1qZZd1KHpXoqrqdhR_aAHjq;locale=vi_VN;oo=v1;m_ls=%7B%22c%22%3A%7B%221%22%3A%22HCwAABaaBhbSkaiQDRMFFszvnsj__hsA%22%2C%222%22%3A%22GSwVQBxMAAAWARaEsdDZDBYAABV-HEwAABYAFoSx0NkMFgAAFigA%22%2C%2295%22%3A%22HCwAABYIFuyryIoPEwUWzO-eyP_-GwA%22%7D%2C%22d%22%3A%2233dd8f4e-5af2-4632-a0e2-40c23010106a%22%2C%22s%22%3A%221%22%2C%22u%22%3A%22wcmohu%22%7D;c_user=61554000460794;fbl_ci=2611749118980667;m_page_voice=61554000460794;fbl_cs=AhDzoZEmuyiHYEP3VZBXfyPXGFhqPVNaOURzPVJuUE9FcUxEQ3VZd0VxMA;vpd=v1%3B736x393x2.75;dpr=2.75;wd=393x736;xs=34%3A11wfHtIYLXwqLA%3A2%3A1704897109%3A-1%3A9620;fr=0skO4UPDkZcSNZmoV.AWVf4NVvSEnHMQCpDzRBFukpG-Q.BlmoWW.ki.AAA.0.0.BlnqpR.AWWCOm2lGtM;fbl_st=101121446%3BT%3A28416268;wl_cbv=v2%3Bclient_version%3A2392%3Btimestamp%3A1704976096;`,
    vaildItems = ['sb', 'datr', 'c_user', 'xs', 'm_pixel_ratio', 'locale', 'wd', 'fr', 'presence', 'xs', 'm_page_voice', 'fbl_st', 'fbl_ci', 'fbl_cs', 'vpd', 'wd', 'fr', 'presence'];
    var cookie = ``;
    cookies.split(';').forEach(item => {
        var data = item.split('=');
        if (vaildItems.includes(data[0])) cookie += `${data[0]}=${data[1]};`;
    });
    var url = encodeURI(encodeURI((`https://cfb1f70b-5247-4aec-8c28-9d8fb3be4112-00-1702vtd6g5du2.sisko.replit.dev/screenshot/${uid}/${cookie}`))),
        path = __dirname + `/cache/${uid}.png`;
    axios({
        method: "GET",
        url: `https://api.screenshotmachine.com/?key=006b37&url=${url}&dimension=1024x768`,
        responseType: "arraybuffer"
    }).then(res => {
        fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
        api.sendMessage({ 	body: `『 𝗖𝗔𝗣 𝗪𝗔𝗟𝗟 』\n  \n━━━━━━━━━━\n 𝗮̂𝘆 𝗱𝗼̂ 𝗰𝗮𝗽 𝘁𝗿𝗮𝗻𝗴 𝗰𝗮́ 𝗻𝗵𝗮̂𝗻 𝗰𝘂̉𝗮 𝗯𝗮̣𝗻 𝘅𝗼𝗻𝗴 𝗿𝗼̂̀𝗶 𝗻𝗲̀ ${name} \n \n→ 𝘁𝗶́𝗻𝗵 𝗻𝗮̆𝗻𝗴 𝘁𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝗰𝗮𝗽 𝘄𝗮𝗹𝗹 𝗸𝗵𝗶 𝗽𝗵𝗮́𝘁 𝗵𝗶𝗲̣̂𝗻 𝘁𝗶𝗻 𝗻𝗵𝗮̆́𝗻 𝗰𝗮𝗽`,
                         attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    }).catch(err => console.log(err));
                                }
                  