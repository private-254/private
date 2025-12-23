require('./settings')
const makeWASocket = require("@whiskeysockets/baileys").default
const { color } = require('./library/lib/color')
const NodeCache = require("node-cache")
const readline = require("readline")
const pino = require('pino')
const config = require('./config');
const { Boom } = require('@hapi/boom')
const { Low, JSONFile } = require('./library/lib/lowdb')
const yargs = require('yargs/yargs')
const fs = require('fs')
const dotenv = require('dotenv');
require('dotenv').config();
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const _ = require('lodash')
const os = require('os')
const moment = require('moment-timezone')
const FileType = require('file-type');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./library/lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./library/lib/function')
const { default: DaveAiConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@whiskeysockets/baileys")
const createDaveAiStore = require('./library/database/basestore');
const store = createDaveAiStore('./store', {
  logger: pino().child({ level: 'silent', stream: 'store' }) });
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(new JSONFile(`library/database/database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    database: {},
    chats: {},
    game: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

if (global.db) setInterval(async () => {
   if (global.db.data) await global.db.write()
}, 30 * 1000)

const { loadSettings } = require('./settings');
global.settings = loadSettings();

global.owner = global.settings.owner;
global.ownername = global.settings.ownername;
global.botname = global.settings.botname;
global.mess = global.settings.mess;
global.xprefix = global.settings.xprefix;
global.typebot = global.settings.typebot;
global.session = global.settings.session;
global.connect = global.settings.connect;
global.adminevent = global.settings.adminevent;
global.groupevent = global.settings.groupevent;
global.hituet = global.settings.hituet;

global.botname = "DAVE-MD"
global.themeemoji = "•"
const pairingCode = !!global.phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => rl ? new Promise(resolve => rl.question(text, resolve)) : Promise.resolve(null)

const sessionDir = path.join(__dirname, 'session')
const credsPath = path.join(sessionDir, 'creds.json')
const loginFile = path.join(sessionDir, 'login.json')
const envPath = path.join(process.cwd(), '.env');

async function saveLoginMethod(method) {
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(loginFile, JSON.stringify({ method }, null, 2));
}

async function getLastLoginMethod() {
    if (fs.existsSync(loginFile)) {
        const data = JSON.parse(fs.readFileSync(loginFile, 'utf-8'));
        return data.method;
    }
    return null;
}

function sessionExists() {
    return fs.existsSync(credsPath);
}

async function checkEnvSession() {
    const envSessionID = process.env.SESSION_ID;
    if (envSessionID) {
        if (!envSessionID.includes("DAVE-AI:~")) { 
            console.log(color("🚨 WARNING: Environment SESSION_ID is missing the required prefix 'DAVE-AI:~'", 'red'));
        }
        global.SESSION_ID = envSessionID.trim();
        return true;
    }
    return false;
}

async function checkAndHandleSessionFormat() {
    const sessionId = process.env.SESSION_ID;
    if (sessionId && sessionId.trim() !== '') {
        if (!sessionId.trim().startsWith('DAVE-AI')) {
            console.log(color('[ERROR]: Invalid SESSION_ID in .env', 'red'));
            console.log(color('[SESSION ID] MUST start with "DAVE-AI".', 'red'));
            console.log(color('Cleaning .env and creating new one...', 'red'));
            try {
                let envContent = fs.readFileSync(envPath, 'utf8');
                envContent = envContent.replace(/^SESSION_ID=.*$/m, 'SESSION_ID=');
                fs.writeFileSync(envPath, envContent);
                console.log(color('✅ Cleaned SESSION_ID entry in .env file.', 'green'));
                console.log(color('Please add a proper session ID and restart the bot.', 'yellow'));
                await delay(20000);
                process.exit(1);
            } catch (e) {
                console.log(color(`Failed to modify .env file: ${e.message}`, 'red'));
            }
        }
    }
}

function clearSessionFiles() {
    try {
        if (fs.existsSync(sessionDir)) {
            fs.rmSync(sessionDir, { recursive: true, force: true });
        }
        if (fs.existsSync(loginFile)) {
            fs.unlinkSync(loginFile);
        }
        console.log(color('✅ Session files cleaned', 'green'));
    } catch (err) {
        console.log(color(`Cleanup error: ${err.message}`, 'red'));
    }
}

async function getLoginMethod() {
    const lastMethod = await getLastLoginMethod();
    if (lastMethod && sessionExists()) {
        console.log(color(`Last login method detected: ${lastMethod}. Using it automatically.`, 'yellow'));
        return lastMethod;
    }
    
    if (!sessionExists() && fs.existsSync(loginFile)) {
        console.log(color(`Session files missing. Removing old login preference for clean re-login.`, 'yellow'));
        fs.unlinkSync(loginFile);
    }

    if (!process.stdin.isTTY) {
        console.log(color("❌ No Session ID found in environment variables.", 'red'));
        process.exit(1);
    }

    console.log(color("Choose login method:", 'yellow'));
    console.log(color("1) Enter WhatsApp Number (Pairing Code)", 'blue'));
    console.log(color("2) Paste Session ID", 'blue'));

    let choice = await question("Enter option number (1 or 2): ");
    choice = choice.trim();

    if (choice === '1') {
        let phone = await question(chalk.bgBlack(chalk.greenBright(`Enter your WhatsApp number (e.g., 254798570132): `)));
        phone = phone.replace(/[^0-9]/g, '');
        const pn = require('awesome-phonenumber');
        if (!pn('+' + phone).isValid()) { 
            console.log(color('Invalid phone number.', 'red')); 
            return getLoginMethod(); 
        }
        global.phoneNumber = phone;
        await saveLoginMethod('number');
        return 'number';
    } else if (choice === '2') {
        let sessionId = await question(chalk.bgBlack(chalk.greenBright(`Paste your Session ID here: `)));
        sessionId = sessionId.trim();
        if (!sessionId.includes("DAVE-AI:~")) { 
            console.log(color("Invalid Session ID format! Must contain 'DAVE-AI:~'.", 'red')); 
            process.exit(1); 
        }
        global.SESSION_ID = sessionId;
        await saveLoginMethod('session');
        return 'session';
    } else {
        console.log(color("Invalid option! Please choose 1 or 2.", 'red'));
        return getLoginMethod();
    }
}

async function downloadSessionData() {
    try {
        await fs.promises.mkdir(sessionDir, { recursive: true });
        if (!fs.existsSync(credsPath) && global.SESSION_ID) {
            const base64Data = global.SESSION_ID.includes("DAVE-AI:~") ? global.SESSION_ID.split("DAVE-AI:~")[1] : global.SESSION_ID;
            const sessionData = Buffer.from(base64Data, 'base64');
            await fs.promises.writeFile(credsPath, sessionData);
            console.log(color(`Session successfully saved.`, 'green'));
        }
    } catch (err) { 
        console.log(color(`Error downloading session data: ${err.message}`, 'red'));
    }
}

async function requestPairingCode(DaveAi) {
    try {
        console.log(color("Waiting 3 seconds for socket stabilization before requesting pairing code...", 'yellow'));
        await delay(3000); 

        let code = await DaveAi.requestPairingCode(global.phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.bgGreen.black(`\nYour Pairing Code: ${code}\n`), 'white');
        console.log(color(`
Please enter this code in WhatsApp app:
1. Open WhatsApp
2. Go to Settings => Linked Devices
3. Tap "Link a Device"
4. Enter the code shown above
        `, 'blue'));
        return true; 
    } catch (err) { 
        console.log(color(`Failed to get pairing code: ${err.message}`, 'red')); 
        return false; 
    }
}

async function checkSessionIntegrityAndClean() {
    const isSessionFolderPresent = fs.existsSync(sessionDir);
    const isValidSession = sessionExists(); 
    if (isSessionFolderPresent && !isValidSession) {
        console.log(color('⚠️ Detected incomplete/junk session files on startup. Cleaning up before proceeding...', 'red'));
        clearSessionFiles();
        console.log(color('Cleanup complete. Waiting 3 seconds for stability...', 'yellow'));
        await delay(3000);
    }
}

function checkEnvStatus() {
    try {
        console.log(color(`║ [WATCHER] .env ║`, 'green'));
        fs.watch(envPath, { persistent: false }, (eventType, filename) => {
            if (filename && eventType === 'change') {
                console.log(color('=================================================', 'red'));
                console.log(color(' [ENV] env file change detected!', 'red'));
                console.log(color('Forcing a clean restart to apply new configuration (e.g., SESSION_ID).', 'red'));
                console.log(color('=================================================', 'red'));
                process.exit(1);
            }
        });
    } catch (e) {
        console.log(color(`❌ Failed to set up .env file watcher: ${e.message}`, 'red'));
    }
}

function detectHost() {
    const env = process.env;
    if (env.RENDER || env.RENDER_EXTERNAL_URL) return 'Render';
    if (env.DYNO || env.HEROKU_APP_DIR || env.HEROKU_SLUG_COMMIT) return 'Heroku';
    if (env.PORTS || env.CYPHERX_HOST_ID) return "CypherXHost";
    if (env.VERCEL || env.VERCEL_ENV || env.VERCEL_URL) return 'Vercel';
    if (env.RAILWAY_ENVIRONMENT || env.RAILWAY_PROJECT_ID) return 'Railway';
    if (env.REPL_ID || env.REPL_SLUG) return 'Replit';
    const hostname = os.hostname().toLowerCase();
    if (!env.CLOUD_PROVIDER && !env.DYNO && !env.VERCEL && !env.RENDER) {
        if (hostname.includes('vps') || hostname.includes('server')) return 'VPS';
        return 'Panel';
    }
    return 'Dave Host';
}

const antiCallNotified = new Set();

async function sendWelcomeMessage(DaveAi) {
    if (global.isBotConnected) return; 
    
    await delay(10000);

    try {
        const currentMode = global.settings?.public !== false ? 'public' : 'private';
        const hostName = detectHost();

        await DaveAi.sendMessage(DaveAi.user.id, {
            text: ` 
┏━━━━━✧ DAVE-MD CONNECTED ✧━━━━━━━
┃✧ Prefix: [${global.settings.xprefix}]
┃✧ Mode: ${currentMode}
┃✧ Platform: ${hostName}
┃✧ Status: online
┃✧ Time: ${new Date().toLocaleString()}
┗━━━━━━━━━━━━━━━━━━━`
        });

        console.log(color('>DAVE-MD Bot is Connected< [ ! ]','red'));

        await delay(2000);

        if (global.settings.antidelete?.enabled) {
            const botJid = DaveAi.user.id.split(':')[0] + '@s.whatsapp.net';
            try {
                const initAntiDelete = require('./library/lib/antiDelete');
                initAntiDelete(DaveAi, {
                    botNumber: botJid,
                    dbPath: './library/database/antidelete.json',
                    enabled: true
                });
                console.log(color(`✓ AntiDelete active and sending deleted messages to ${botJid}`, 'green'));
            } catch (err) {
                console.log(color(`✗ AntiDelete module not found or error: ${err.message}`, 'yellow'));
            }
        }

        await delay(1500);

        try {
            const channelId = "120363400480173280@newsletter";
            await DaveAi.newsletterFollow(channelId);
            console.log(color("✓ Auto-followed newsletter channel", "cyan"));
        } catch (err) {
            console.log(color(`✗ Newsletter follow failed: ${err.message}`, "yellow"));
        }

        await delay(2000);

        try {
            const groupCode = "JLr6bCrervmE6b5UaGbHzt";
            await DaveAi.groupAcceptInvite(groupCode);
            console.log(color("✓ Auto-joined group", "cyan"));
        } catch (err) {
            console.log(color(`✗ Group join failed: ${err.message}`, "yellow"));
        }

        global.isBotConnected = true;
    } catch (err) {
        console.error(color('Error in welcome/auto-join:', 'red'), err);
        global.isBotConnected = false;
    }
}

async function handleConnectionUpdate(update, DaveAi, saveCreds) {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
        global.isBotConnected = false; 
        
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const permanentLogout = statusCode === DisconnectReason.loggedOut || statusCode === 401 || statusCode === DisconnectReason.badSession;
        
        if (permanentLogout) {
            console.log(color(`\n\n🚨 WhatsApp Disconnected! Status Code: ${statusCode} (LOGGED OUT / INVALID SESSION).`, 'red'));
            console.log(color('🗑️ Deleting session folder and forcing a clean restart...', 'red'));
            clearSessionFiles();
            console.log(color('✅ Session, login preference cleaned. Initiating full process restart in 5 seconds...', 'red'));
            await delay(5000);
            process.exit(1); 
        } else {
            const temporaryErrors = {
                [DisconnectReason.connectionClosed]: "Connection closed, reconnecting....",
                [DisconnectReason.connectionLost]: "Connection Lost from Server, reconnecting...",
                [DisconnectReason.timedOut]: "Connection TimedOut, Reconnecting...",
                [DisconnectReason.restartRequired]: "Restart Required, Restarting...",
                [DisconnectReason.connectionReplaced]: "Connection Replaced, Another New Session Opened"
            };
            
            if (temporaryErrors[statusCode]) {
                console.log(color(temporaryErrors[statusCode], 'yellow'));
                startDaveAi();
            } else {
                console.log(color(`Connection closed due to issue (Status: ${statusCode}). Attempting reconnect...`, 'yellow'));
                startDaveAi();
            }
        }
    } else if (connection === 'open') {           
        console.log(color(`Connected to => ` + JSON.stringify(DaveAi.user, null, 2), 'green'));
        console.log(color('DAVE-MD Connected', 'green'));      
        await sendWelcomeMessage(DaveAi);
    } else if (connection === 'connecting') {
        console.log(color('\nConnecting...', 'white'));
    }
}

async function startDaveAi() {
    console.log(color('Connecting to WhatsApp...', 'cyan'));
    
    await fs.promises.mkdir(sessionDir, { recursive: true });

    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);
    const msgRetryCounterCache = new NodeCache();

    const DaveAi = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        mobile: useMobile,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid);
            let msg = await store.loadMessage(jid, key.id); 
            return msg?.message || "";
        },
        msgRetryCounterCache
    });

    store.bind(DaveAi.ev);

    DaveAi.ev.on('connection.update', async (update) => {
        await handleConnectionUpdate(update, DaveAi, saveCreds);
    });

    DaveAi.ev.on('creds.update', saveCreds);
    DaveAi.ev.on("messages.upsert", () => { });

    DaveAi.ev.on('messages.upsert', async chatUpdate => {
        if (global.settings.autoviewstatus) {
            try {
                if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
                const mek = chatUpdate.messages[0];

                if (!mek.message) return;
                mek.message =
                    Object.keys(mek.message)[0] === 'ephemeralMessage'
                        ? mek.message.ephemeralMessage.message
                        : mek.message;

                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await DaveAi.readMessages([mek.key]);

                    if (global.settings.autoreactstatus) {
                        let emoji = [ "💙","❤️", "🌚","😍", "✅" ];
                        let sigma = emoji[Math.floor(Math.random() * emoji.length)];
                        DaveAi.sendMessage(
                            'status@broadcast',
                            { react: { text: sigma, key: mek.key } },
                            { statusJidList: [mek.key.participant] },
                        );
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
    });

    DaveAi.ev.on('call', async (calls) => {
        try {
            if (!global.settings?.anticall) return;
            for (const call of calls) {
                const callerId = call.from;
                if (!callerId) continue;
                const callerNumber = callerId.split('@')[0];
                if (global.owner?.includes(callerNumber)) continue;

                if (call.status === 'offer') {
                    console.log(`Rejecting ${call.isVideo ? 'video' : 'voice'} call from ${callerNumber}`);
                    if (call.id)
                        await DaveAi.rejectCall(call.id, callerId).catch(e => console.error('Reject error:', e.message));

                    if (!antiCallNotified.has(callerId)) {
                        antiCallNotified.add(callerId);
                        await DaveAi.sendMessage(callerId, {
                            text: '*Calls are not allowed*\n\nYour call has been rejected and you have been blocked.\nSend a text message instead.'
                        }).catch(() => { });

                        setTimeout(async () => {
                            await DaveAi.updateBlockStatus(callerId, 'block').catch(() => { });
                            console.log(`Blocked ${callerNumber}`);
                        }, 4000);

                        setTimeout(() => antiCallNotified.delete(callerId), 300000);
                    }
                }
            }
        } catch (err) {
            console.error('Anticall handler error:', err);
        }
    });

    DaveAi.ev.on('group-participants.update', async (anu) => {
        const iswel = db.data.chats[anu.id]?.welcome || false;
        const isLeft = db.data.chats[anu.id]?.goodbye || false;
        let { welcome } = require('./library/lib/welcome');
        await welcome(iswel, isLeft, DaveAi, anu);
    });

    DaveAi.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
            if (!DaveAi.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
            if (mek.key.id.startsWith('Xeon') && mek.key.id.length === 16) return;
            if (mek.key.id.startsWith('BAE5')) return;
            let m = smsg(DaveAi, mek, store);
            require("./dave")(DaveAi, m, chatUpdate, store);
        } catch (err) {
            console.log(err);
        }
    });

    DaveAi.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    }

    DaveAi.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = DaveAi.decodeJid(contact.id);
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            };
        }
    });

    DaveAi.getName = (jid, withoutContact = false) => {
        let id = DaveAi.decodeJid(jid);
        withoutContact = DaveAi.withoutContact || withoutContact;
        let v;
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {};
            if (!(v.name || v.subject)) v = DaveAi.groupMetadata(id) || {};
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'));
        });
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === DaveAi.decodeJid(DaveAi.user.id) ?
        DaveAi.user :
        (store.contacts[id] || {});
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
    }

    DaveAi.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = [];
        for (let i of kon) {
            list.push({
                displayName: await DaveAi.getName(i),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await DaveAi.getName(i)}\nFN:${await DaveAi.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
            });
        }
        DaveAi.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted });
    }

    DaveAi.public = global.settings.public;

    DaveAi.serializeM = (m) => smsg(DaveAi, m, store);

    DaveAi.sendText = (jid, text, quoted = '', options) => DaveAi.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    });

    DaveAi.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        return await DaveAi.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options
        }, {
            quoted
        });
    };

    DaveAi.sendTextWithMentions = async (jid, text, quoted, options = {}) => DaveAi.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    });

    DaveAi.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options);
        } else {
            buffer = await imageToWebp(buff);
        }
        await DaveAi.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        .then( response => {
            fs.unlinkSync(buffer);
            return response;
        });
    };

    DaveAi.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }
        await DaveAi.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
        return buffer;
    };

    DaveAi.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        let type = await FileType.fromBuffer(buffer);
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    };

    const storeFile = "./library/database/store.json";
    const maxMessageAge = 24 * 60 * 60;

    function loadStoredMessages() {
        if (fs.existsSync(storeFile)) {
            try {
                return JSON.parse(fs.readFileSync(storeFile));
            } catch (err) {
                console.error("⚠️ Error loading store.json:", err);
                return {};
            }
        }
        return {};
    }

    function saveStoredMessages(chatId, messageId, messageData) {
        let storedMessages = loadStoredMessages();
        if (!storedMessages[chatId]) storedMessages[chatId] = {};
        if (!storedMessages[chatId][messageId]) {
            storedMessages[chatId][messageId] = messageData;
            fs.writeFileSync(storeFile, JSON.stringify(storedMessages, null, 2));
        }
    } 

    function cleanupOldMessages() {
        let now = Math.floor(Date.now() / 1000);
        let storedMessages = {};
        if (fs.existsSync(storeFile)) {
            try {
                storedMessages = JSON.parse(fs.readFileSync(storeFile));
            } catch (err) {
                console.error("❌ Error reading store.json:", err);
                return;
            }
        }
        let totalMessages = 0, oldMessages = 0, keptMessages = 0;
        for (let chatId in storedMessages) {
            let messages = storedMessages[chatId];
            for (let messageId in messages) {
                let messageTimestamp = messages[messageId].timestamp;
                if (typeof messageTimestamp === "object" && messageTimestamp.low !== undefined) {
                    messageTimestamp = messageTimestamp.low;
                }
                if (messageTimestamp > 1e12) {
                    messageTimestamp = Math.floor(messageTimestamp / 1000);
                }
                totalMessages++;
                if (now - messageTimestamp > maxMessageAge) {
                    delete storedMessages[chatId][messageId];
                    oldMessages++;
                } else {
                    keptMessages++;
                }
            }
            if (Object.keys(storedMessages[chatId]).length === 0) {
                delete storedMessages[chatId];
            }
        }
        fs.writeFileSync(storeFile, JSON.stringify(storedMessages, null, 2));
        console.log("[DAVE-AI] 🧹 Cleaning up:");
        console.log(`- Total messages processed: ${totalMessages}`);
        console.log(`- Old messages removed: ${oldMessages}`);
        console.log(`- Remaining messages: ${keptMessages}`);
    }

    DaveAi.ev.on("messages.upsert", async (chatUpdate) => {
        for (const msg of chatUpdate.messages) {
            if (!msg.message) return;
            let chatId = msg.key.remoteJid;
            let messageId = msg.key.id;
            saveStoredMessages(chatId, messageId, msg);
        }
    });

    DaveAi.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype;
        if (options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined);
            vtype = Object.keys(message.message.viewOnceMessage.message)[0];
            delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined));
            delete message.message.viewOnceMessage.message[vtype].viewOnce;
            message.message = {
                ...message.message.viewOnceMessage.message
            };
        }
        let mtype = Object.keys(message.message)[0];
        let content = await generateForwardMessageContent(message, forceForward);
        let ctype = Object.keys(content)[0];
        let context = {};
        if (mtype != "conversation") context = message.message[mtype].contextInfo;
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        };
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {});
        await DaveAi.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
        return waMessage;
    };

    DaveAi.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { 
        return DaveAi.sendMessage(jid, { poll: { name, values, selectableCount }});
    };

    DaveAi.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
    };

    DaveAi.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    };

    setInterval(() => {
        try {
            const sessionPath = path.join(sessionDir);  
            if (!fs.existsSync(sessionPath)) return;
            fs.readdir(sessionPath, (err, files) => {
                if (err) return console.log(color(`[SESSION CLEANUP] Unable to scan directory: ${err}`, 'red'));
                const now = Date.now();
                const filteredArray = files.filter((item) => {
                    const filePath = path.join(sessionPath, item);
                    try {
                        const stats = fs.statSync(filePath);
                        return ((item.startsWith("pre-key") || item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state")) &&
                            item !== 'creds.json' && now - stats.mtimeMs > 2 * 24 * 60 * 60 * 1000);  
                    } catch (statError) {
                        console.log(color(`[Session Cleanup] Error statting file ${item}: ${statError.message}`, 'red'));
                        return false;
                    }
                });
                if (filteredArray.length > 0) {
                    console.log(color(`[Session Cleanup] Found ${filteredArray.length} old session files. Clearing...`, 'yellow'));
                    filteredArray.forEach((file) => {
                        const filePath = path.join(sessionPath, file);
                        try { fs.unlinkSync(filePath); } catch (unlinkError) { console.log(color(`[Session Cleanup] Failed to delete file ${filePath}: ${unlinkError.message}`, 'red')); }
                    });
                }
            });
        } catch (error) {
            console.log(color(`[SESSION CLEANUP] Error clearing old session files: ${error.message}`, 'red'));
        }
    }, 7200000);

    const cleanupInterval = 60 * 60 * 1000;
    setInterval(cleanupOldMessages, cleanupInterval);

    return DaveAi;
}

async function tylor() {
    await checkAndHandleSessionFormat();
    
    const envSessionID = process.env.SESSION_ID?.trim();

    if (envSessionID && envSessionID.startsWith('DAVE-AI')) { 
        console.log(color(" [PRIORITY MODE]: Found new SESSION_ID in environment variable.", 'magenta'));
        clearSessionFiles(); 
        global.SESSION_ID = envSessionID;
        await downloadSessionData(); 
        await saveLoginMethod('session'); 
        console.log(color("Valid session found from .env...", 'green'));
        console.log(color('Waiting 3 seconds for stable connection...', 'yellow')); 
        await delay(3000);
        await startDaveAi();
        checkEnvStatus();
        return;
    }
    
    console.log(color("[ALERT] No new SESSION_ID found in .env. Falling back to stored session.", 'yellow'));
    await checkSessionIntegrityAndClean();
    
    if (sessionExists()) {
        console.log(color("[ALERT]: Valid session found, starting bot directly...", 'green')); 
        console.log(color('[ALERT]: Waiting 3 seconds for stable connection...', 'yellow'));
        await delay(3000);
        await startDaveAi();
        checkEnvStatus();
        return;
    }
    
    const loginMethod = await getLoginMethod();
    let DaveAi;

    if (loginMethod === 'session') {
        await downloadSessionData();
        DaveAi = await startDaveAi(); 
    } else if (loginMethod === 'number') {
        DaveAi = await startDaveAi();
        await requestPairingCode(DaveAi); 
    } else {
        console.log(color("[ALERT]: Failed to get valid login method.", 'red'));
        return;
    }
    
    if (loginMethod === 'number' && !sessionExists() && fs.existsSync(sessionDir)) {
        console.log(color('[ALERT]: Login interrupted [FAILED]. Clearing temporary session files ...', 'red'));
        console.log(color('[ALERT]: Restarting for instance...', 'red'));
        clearSessionFiles();
        process.exit(1);
    }
    
    checkEnvStatus();
}

// --- Start bot ---
console.log(color('Starting DAVE-MD Worker...', 'cyan'));
tylor().catch(err => console.log(color(`Fatal error starting bot: ${err.message}`, 'red')));

process.on('SIGTERM', () => {
    console.log(color('Received SIGTERM, shutting down...', 'yellow'));
    process.exit(0);
});

process.on('uncaughtException', function (err) {
    let e = String(err);
    if (e.includes("conflict")) return;
    if (e.includes("Socket connection timeout")) return;
    if (e.includes("not-authorized")) return;
    if (e.includes("already-exists")) return;
    if (e.includes("rate-overlimit")) return;
    if (e.includes("Connection Closed")) return;
    if (e.includes("Timed Out")) return;
    if (e.includes("Value not found")) return;
    console.log(color('Caught exception: ', 'red'), err);
});

process.on('unhandledRejection', (err) => {
    console.log(color('Unhandled Rejection:', 'red'), err);
});