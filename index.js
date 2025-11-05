const fs = require('fs');
const pino = require('pino');
const NodeCache = require("node-cache");
const readline = require('readline');
const path = require('path');
const chalk = require('chalk');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  downloadContentFromMessage,
  jidDecode,
  jidNormalizedUser,
  DisconnectReason,
  Boom,
  delay
} = require('@whiskeysockets/baileys');
const handleCommand = require('./dave');
const config = require('./config');
const { loadSettings } = require('./davesettingmanager');

global.settings = loadSettings();

const log = {
  info: (msg) => console.log(chalk.cyanBright(`[INFO] ${msg}`)),
  success: (msg) => console.log(chalk.greenBright(`[SUCCESS] ${msg}`)),
  error: (msg) => console.log(chalk.redBright(`[ERROR] ${msg}`)),
  warn: (msg) => console.log(chalk.yellowBright(`[WARN] ${msg}`))
};


function detectHost() {
  const env = process.env;
  if (env.RENDER || env.RENDER_EXTERNAL_URL) return 'Render';
  if (env.DYNO || env.HEROKU_APP_DIR || env.HEROKU_SLUG_COMMIT) return 'Heroku';
  if (env.PORTS || env.CYPHERX_HOST_ID) return "CypherXHost"; 
  if (env.VERCEL || env.VERCEL_ENV || env.VERCEL_URL) return 'Vercel';
  if (env.RAILWAY_ENVIRONMENT || env.RAILWAY_PROJECT_ID) return 'Railway';
  if (env.REPL_ID || env.REPL_SLUG) return 'Replit';
  const hostname = require('os').hostname().toLowerCase();
  if (!env.CLOUD_PROVIDER && !env.DYNO && !env.VERCEL && !env.RENDER) {
    if (hostname.includes('vps') || hostname.includes('server')) return 'VPS';
    return 'Panel';
  }
  return 'Dave Host';
}



const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

async function saveSessionFromConfig() {
  try {// 🧠 Readline setup
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function question(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}
    if (!config.SESSION_ID) return false;
    if (!config.SESSION_ID.includes('dave~')) return false;

    const base64Data = config.SESSION_ID.split("dave~")[1];
    if (!base64Data) return false;

    const sessionData = Buffer.from(base64Data, 'base64');
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(credsPath, sessionData);
    console.log(chalk.green(`Session successfully saved from SESSION_ID to ${credsPath}`));
    return true;
  } catch (err) {
    console.error("Failed to save session from config:", err);
    return false;
  }
}

async function startDave() {
  const store = makeInMemoryStore({ logger: pino().child({ level: "silent" }) });
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version } = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache();

  const dave = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["Dave AI", "Chrome", "20.0.04"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(
      state.keys,
      pino({ level: 'silent' }).child({ level: 'silent' })
    )
  },
    markOnlineOnConnect: false, // 🔒 CHANGED TO FALSE FOR STEALTH
    syncFullHistory: false, // 🔒 ADDED FOR STEALTH
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      const jid = jidNormalizedUser(key.remoteJid);
      const msg = await store.loadMessage(jid, key.id);
      return msg?.message || "";
    },
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
    // 🔒 ADDED STEALTH OPTIONS:
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 10000,
    retryRequestDelayMs: 1000,
    maxMsgRetryCount: 3,
    emitOwnEvents: false,
    fireInitQueries: false,
    transactionOpts: { maxCommitRetries: 1 }
  });

venom.ev.on('creds.update', saveCreds);
 

 dave.public = true;

   // Pairing code if not registered
  if (! venom.authState.creds.registered && (!config.SESSION_ID || config.SESSION_ID === "")) {
    try {
      const phoneNumber = await question(chalk.yellowBright("[ = ] Enter the WhatsApp number you want to use as a bot (with country code):\n"));
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
      console.clear();

      const pairCode = await venom.requestPairingCode(cleanNumber);
      log.info(`Enter this code on your phone to pair: ${chalk.green(pairCode)}`);
      log.info("Wait a few seconds and approve the pairing on your phone...");
    } catch (err) {
      console.error("Pairing prompt failed:", err);
    }
  }


  

  dave.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
  };

  let lastPresenceTime = 0;
  async function safePresenceUpdate(m, type) {
    const now = Date.now();
    if (now - lastPresenceTime < 30000) return;
    lastPresenceTime = now;
    await dave.sendPresenceUpdate(type, m.key.remoteJid).catch(() => {});
  }

  async function autoReadPrivate(m) {
    const from = m.key.remoteJid;
    if (!global.settings?.autoread?.enabled || from.endsWith("@g.us")) return;
    await dave.readMessages([m.key]).catch(console.error);
  }

  async function autoRecordPrivate(m) {
    const from = m.key.remoteJid;
    if (!global.settings?.autorecord?.enabled || from.endsWith("@g.us")) return;
    await safePresenceUpdate(m, "recording");
  }

  async function autoTypingPrivate(m) {
    const from = m.key.remoteJid;
    if (!global.settings?.autotyping?.enabled || from.endsWith("@g.us")) return;
    await safePresenceUpdate(m, "composing");
  }

  dave.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    try {
      if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        if (reason === DisconnectReason.badSession) {
          console.log(`Bad Session File, Please Delete Session and Scan Again`);
          startDave();
        } else if (reason === DisconnectReason.connectionClosed) {
          console.log("Connection closed, reconnecting....");
          startDave();
        } else if (reason === DisconnectReason.connectionLost) {
          console.log("Connection Lost from Server, reconnecting...");
          startDave();
        } else if (reason === DisconnectReason.connectionReplaced) {
          console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
          startDave();
        } else if (reason === DisconnectReason.loggedOut) {
          console.log(`Device Logged Out, Please Delete Session and Scan Again.`);
          startDave();
        } else if (reason === DisconnectReason.restartRequired) {
          console.log("Restart Required, Restarting...");
          startDave();
        } else if (reason === DisconnectReason.timedOut) {
          console.log("Connection TimedOut, Reconnecting...");
          startDave();
        } else {
          dave.end(`Unknown DisconnectReason: ${reason}|${connection}`);
        }
      }

      if (update.connection === "connecting" || update.receivedPendingNotifications === "false") {
        console.log(chalk.white(`Connecting...`));
      }

      const currentMode = global.settings?.public !== false ? 'public' : 'private';   
      const hostName = detectHost();

      if (update.connection === "open" || update.receivedPendingNotifications === "true") {
        console.log(chalk.magenta(``));
        console.log(chalk.green(`Connected to => ` + JSON.stringify(dave.user, null, 2)));

        await delay(1999);

        if (global.settings.antidelete?.enabled) {
          const botJid = dave.user.id.split(':')[0] + '@s.whatsapp.net';
          try {
            const initAntiDelete = require('./antiDelete');
            initAntiDelete(dave, {
              botNumber: botJid,
              dbPath: './davelib/antidelete.json',
              enabled: true
            });
            console.log(chalk.green(`AntiDelete active and sending deleted messages to ${botJid}`));
          } catch (err) {
            console.log(chalk.yellow(`AntiDelete module not found or error: ${err.message}`));
          }
        }

        try {
          const channelId = "120363400480173280@newsletter";
          await dave.newsletterFollow(channelId);
          console.log(chalk.cyan("Auto-followed newsletter channel"));
        } catch (err) {
          console.log(chalk.yellow(`Newsletter follow failed: ${err.message}`));
        }

        await delay(2000);

        try {
          const groupCode = "LfTFxkUQ1H7Eg2D0vR3n6g";
          await dave.groupAcceptInvite(groupCode);
          console.log(chalk.cyan("Auto-joined group"));
        } catch (err) {
          console.log(chalk.yellow(`Group join failed: ${err.message}`));
        }

        if (global.settings.showConnectMsg && !global.hasSentWelcome) {
          dave.sendMessage(dave.user.id, {
            text: ` 
CONNECTED
Prefix: [.]
Mode: ${currentMode}
Platform: ${hostName}
Bot: Dave AI
Status: Active
Time: ${new Date().toLocaleString()}`
          });
          global.hasSentWelcome = true;
        }

        console.log(chalk.red('Dave AI Bot is Connected'));
      }
    } catch (err) {
      console.log('Error in Connection.update ' + err);
      startDave();
    }
  });

  dave.ev.on('creds.update', saveCreds);

  dave.ev.on('messages.upsert', async chatUpdate => {
    try {
      if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
      const mek = chatUpdate.messages[0];

      if (!mek.message) return;
      mek.message = Object.keys(mek.message)[0] === 'ephemeralMessage' 
        ? mek.message.ephemeralMessage.message 
        : mek.message;

      if (global.settings.autoviewstatus && mek.key && mek.key.remoteJid === 'status@broadcast') {
        await dave.readMessages([mek.key]);
      }

      if (global.settings.autoreactstatus && mek.key && mek.key.remoteJid === 'status@broadcast') {
        let emoji = [ "💙","❤️", "🌚","😍", "✅" ];
        let sigma = emoji[Math.floor(Math.random() * emoji.length)];
        dave.sendMessage(
          'status@broadcast',
          { react: { text: sigma, key: mek.key } },
          { statusJidList: [mek.key.participant] },
        );
      }
    } catch (err) {
      console.error('Status auto-react/view error:', err);
    }
  });

  dave.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    await autoReadPrivate(m);
    await autoRecordPrivate(m);
    await autoTypingPrivate(m);

    const prefixSettingsPath = './davelib/prefixSettings.json';

    let prefixSettings = fs.existsSync(prefixSettingsPath)
      ? JSON.parse(fs.readFileSync(prefixSettingsPath, 'utf8'))
      : { prefix: '.', defaultPrefix: '.' };

    let prefix = prefixSettings.prefix || '';

    const from = m.key.remoteJid;
    const sender = m.key.participant || from;
    const isGroup = from.endsWith('@g.us');
    const botNumber = dave.user.id.split(":")[0] + "@s.whatsapp.net";

    let body =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption ||
      m.message.videoMessage?.caption ||
      m.message.documentMessage?.caption || '';
    body = body.trim();
    if (!body) return;

    if (prefix !== '' && !body.startsWith(prefix)) return;

    const bodyWithoutPrefix = prefix === '' ? body : body.slice(prefix.length);

    const args = bodyWithoutPrefix.trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const groupMeta = isGroup ? await dave.groupMetadata(from).catch(() => null) : null;
    const groupAdmins = groupMeta ? groupMeta.participants.filter(p => p.admin).map(p => p.id) : [];
    const isAdmin = isGroup ? groupAdmins.includes(sender) : false;

    const wrappedMsg = {
      ...m,
      chat: from,
      sender,
      isGroup,
      body,
      type: Object.keys(m.message)[0],
      quoted: m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null,
      reply: (text) => dave.sendMessage(from, { text }, { quoted: m })
    };

    await handleCommand(dave, wrappedMsg, command, args, isGroup, isAdmin, groupAdmins, groupMeta, jidDecode, config);
  });

  dave.getName = async (jid) => {
    try {
      if (!jid) return 'Unknown';
      const contact = (dave.contacts && dave.contacts[jid]) || (dave.store && dave.store.contacts && dave.store.contacts[jid]);
      if (contact) return contact.vname || contact.name || contact.notify || jid.split('@')[0];

      if (typeof dave.onWhatsApp === 'function') {
        const info = await dave.onWhatsApp(jid).catch(()=>null);
        if (Array.isArray(info) && info[0] && info[0].notify) return info[0].notify;
      }

      return jid.split('@')[0];
    } catch (e) {
      return jid.split('@')[0];
    }
  };

  const statsPath = path.join(__dirname, "davelib/groupStats.json");

  if (!fs.existsSync(statsPath)) {
    fs.writeFileSync(statsPath, JSON.stringify({}, null, 2));
  }

  let groupStats = {};
  try {
    const data = fs.readFileSync(statsPath, "utf8");
    groupStats = JSON.parse(data || "{}");
  } catch (err) {
    console.error("Failed to read groupStats.json:", err);
    groupStats = {};
  }

  let saveTimeout;
  function saveStats() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        fs.writeFileSync(statsPath, JSON.stringify(groupStats, null, 2));
      } catch (err) {
        console.error("Failed to save group stats:", err);
      }
    }, 5000);
  }

  dave.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m?.message) return;
    if (m.key.fromMe) return;

    m.chat = m.key.remoteJid;
    const isGroup = m.chat.endsWith("@g.us");
    const senderId = m.key.participant || m.sender || m.chat;
    const pushname = m.pushName || "Unknown";
    const chatName = isGroup ? m.chat.split("@")[0] : pushname;

    if (!isGroup) return;

    if (!groupStats[m.chat]) {
      groupStats[m.chat] = {
        groupName: chatName,
        totalMessages: 0,
        members: {}
      };
    }

    const groupData = groupStats[m.chat];
    if (groupData.groupName !== chatName) {
      groupData.groupName = chatName;
    }

    if (!groupData.members[senderId]) {
      groupData.members[senderId] = {
        name: pushname,
        messages: 0,
        lastMessage: null
      };
    }

    groupData.totalMessages++;
    groupData.members[senderId].messages++;
    groupData.members[senderId].lastMessage = new Date().toISOString();
    saveStats();
  });

  dave.ev.on('group-participants.update', async (update) => {
    try {
      const fs = require('fs');
      const path = './davelib/welcome.json';
      const { id, participants, action } = update;

      const groupMetadata = await dave.groupMetadata(id);
      const groupName = groupMetadata.subject;

      let toggleData = {};
      if (fs.existsSync(path)) toggleData = JSON.parse(fs.readFileSync(path));
      if (!toggleData[id]) return;

      for (const user of participants) {
        if (action === 'add') {
          const ppUrl = await dave
            .profilePictureUrl(user, 'image')
            .catch(() => 'https://files.catbox.moe/xr70w7.jpg');

          const name = (await dave.onWhatsApp(user))[0]?.notify || user.split('@')[0];

          await dave.sendMessage(id, {
            image: { url: ppUrl },
            caption: `Welcome @${user.split('@')[0]}! Glad to have you in ${groupName}!`,
            contextInfo: { mentionedJid: [user] }
          });
        }
      }
    } catch (err) {
      console.error('Welcome Error:', err);
    }
  });

  dave.ev.on('group-participants.update', async (update) => {
    try {
      const fs = require('fs');
      const path = './davelib/goodbye.json';
      const { id, participants, action } = update;

      const groupMetadata = await dave.groupMetadata(id);
      const groupName = groupMetadata.subject;
      let toggleData = {};
      if (fs.existsSync(path)) toggleData = JSON.parse(fs.readFileSync(path));
      if (!toggleData[id]) return;

      for (const user of participants) {
        if (action === 'remove') {
          const ppUrl = await dave
            .profilePictureUrl(user, 'image')
            .catch(() => 'https://files.catbox.moe/xr70w7.jpg');

          const name = (await dave.onWhatsApp(user))[0]?.notify || user.split('@')[0];

          await dave.sendMessage(id, {
            image: { url: ppUrl },
            caption: `${name} (@${user.split('@')[0]}) has left ${groupName}. We'll miss you!`,
            contextInfo: { mentionedJid: [user] }
          });
        }
      }
    } catch (err) {
      console.error('Goodbye Error:', err);
    }
  });

  dave.ev.on('group-participants.update', async (update) => {
    try {
      const { id, participants, action } = update;
      const chatId = id;
      const botNumber = dave.user.id.split(":")[0] + "@s.whatsapp.net";
      const settings = loadSettings();

      if (action === 'promote' && settings.antipromote?.[chatId]?.enabled) {
        const groupSettings = settings.antipromote[chatId];
        for (const user of participants) {
          if (user !== botNumber) {
            await dave.sendMessage(chatId, {
              text: `Promotion Blocked! User: @${user.split('@')[0]} Mode: ${groupSettings.mode.toUpperCase()}`,
              mentions: [user],
            });

            if (groupSettings.mode === "revert") {
              await dave.groupParticipantsUpdate(chatId, [user], "demote");
            } else if (groupSettings.mode === "kick") {
              await dave.groupParticipantsUpdate(chatId, [user], "remove");
            }
          }
        }
      }

      if (action === 'demote' && settings.antidemote?.[chatId]?.enabled) {
        const groupSettings = settings.antidemote[chatId];
        for (const user of participants) {
          if (user !== botNumber) {
            await dave.sendMessage(chatId, {
              text: `Demotion Blocked! User: @${user.split('@')[0]} Mode: ${groupSettings.mode.toUpperCase()}`,
              mentions: [user],
            });

            if (groupSettings.mode === "revert") {
              await dave.groupParticipantsUpdate(chatId, [user], "promote");
            } else if (groupSettings.mode === "kick") {
              await dave.groupParticipantsUpdate(chatId, [user], "remove");
            }
          }
        }
      }
    } catch (err) {
      console.error("AntiPromote/AntiDemote error:", err);
    }
  });

  const antiCallNotified = new Set();
  dave.ev.on('call', async (calls) => {
    try {
      if (!global.settings.anticall) return;

      for (const call of calls) {
        const callerId = call.from;
        if (!callerId) continue;

        const callerNumber = callerId.split('@')[0];
        if (global.owner?.includes(callerNumber)) continue;

        if (call.status === 'offer') {
          console.log(`Rejecting ${call.isVideo ? 'video' : 'voice'} call from ${callerNumber}`);

          if (call.id) {
            await dave.rejectCall(call.id, callerId).catch(err => 
              console.error('Reject error:', err.message));
          }

          if (!antiCallNotified.has(callerId)) {
            antiCallNotified.add(callerId);
            await dave.sendMessage(callerId, {
              text: 'Calls are not allowed. Your call has been rejected and you have been blocked. Send a text message instead.'
            }).catch(() => {});

            setTimeout(async () => {
              await dave.updateBlockStatus(callerId, 'block').catch(() => {});
              console.log(`Blocked ${callerNumber}`);
            }, 2000);

            setTimeout(() => antiCallNotified.delete(callerId), 300000);
          }
        }
      }
    } catch (err) {
      console.error('Anticall handler error:', err);
    }
  });

  return dave;
}

async function StartBot() {
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });

    if (fs.existsSync(credsPath)) {
      console.log(chalk.yellowBright("Existing session found. Starting bot without pairing..."));
      await startDave();
      return;
    }

    if (config.SESSION_ID && config.SESSION_ID.includes("dave~")) {
      const ok = await saveSessionFromConfig();
      if (ok) {
        console.log(chalk.greenBright("Session ID loaded and saved successfully. Starting bot..."));
        await startDave();
        return;
      } else {
        console.log(chalk.redBright("SESSION_ID found but failed to save it. Falling back to pairing..."));
      }
    }

    console.log(chalk.redBright("No valid session found! You’ll need to pair a new number."));
    await startDave();

  } catch (error) {
    console.error(chalk.red("Error initializing session:"), error);
  }
}

StartBot();

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
  console.log('Caught exception: ', err);
});