const fs = require('fs');
const pino = require('pino');
const readline = require('readline');
const path = require('path');
const chalk = require('chalk');
const initAntiDelete = require('./antiDelete');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  jidDecode
} = require('@whiskeysockets/baileys');

const handleCommand = require('./dave');
const config = require('./config');
const { loadSettings } = require('./davesettingmanager');

global.settings = loadSettings();
global.owner = config.OWNER_NUMBER ? [config.OWNER_NUMBER] : [];

const store = require('./davelib/lightweight_store')
store.readFromFile()
setInterval(() => store.writeToFile(), (global.settings && global.settings.storeWriteInterval) || 10000)

setInterval(() => {
    if (global.gc) {
        global.gc()
    }
}, 60000)

setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 500) {
        process.exit(1)
    }
}, 60000)

const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

setInterval(() => {
  fs.readdir(customTemp, (err, files) => {
    if (err) return;
    for (const file of files) {
      const filePath = path.join(customTemp, file);
      fs.stat(filePath, (err, stats) => {
        if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
          fs.unlink(filePath, () => {});
        }
      });
    }
  });
}, 3 * 60 * 60 * 1000);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const log = {
  info: (msg) => console.log(chalk.cyanBright(`[INFO] ${msg}`)),
  success: (msg) => console.log(chalk.greenBright(`[SUCCESS] ${msg}`)),
  error: (msg) => console.log(chalk.redBright(`[ERROR] ${msg}`)),
  warn: (msg) => console.log(chalk.yellowBright(`[WARN] ${msg}`))
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function question(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

async function saveSessionFromConfig() {
  try {
    if (!config.SESSION_ID) return false;
    if (!config.SESSION_ID.includes('DAVE-AI:~')) return false;

    const base64Data = config.SESSION_ID.split("DAVE-AI:~")[1];
    if (!base64Data) return false;

    const sessionData = Buffer.from(base64Data, 'base64');
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(credsPath, sessionData);
    console.log(chalk.green(`Session saved from SESSION_ID to ${credsPath}`));
    return true;
  } catch (err) {
    console.error("Failed to save session from config:", err);
    return false;
  }
}

async function startvenom() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  const venom = makeWASocket({
    version, 
    keepAliveIntervalMs: 10000,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(
        state.keys,
        pino({ level: 'silent' }).child({ level: 'silent' })
      )
    },
    browser: ["Ubuntu", "Chrome", "20.0.00"],
    syncFullHistory: true 
  });

  venom.ev.on('creds.update', saveCreds);
  store.bind(venom.ev);

  if (!venom.authState.creds.registered && (!config.SESSION_ID || config.SESSION_ID === "")) {
    try {
      const phoneNumber = await question(chalk.yellowBright("Enter the WhatsApp number you want to use as a bot (with country code):\n"));
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
      console.clear();
      const custom = "DAVEBOTS";
      const pairCode = await venom.requestPairingCode(cleanNumber, custom);
      log.info(`Enter this code on your phone to pair: ${chalk.green(pairCode)}`);
      log.info("Wait a few seconds and approve the pairing on your phone...");
    } catch (err) {
      console.error("Pairing prompt failed:", err);
    }
  }

  venom.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
  };

  venom.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
      log.error('Connection closed.');
      if (shouldReconnect) setTimeout(() => startvenom(), 5000);

    } else if (connection === 'open') {
      const botNumber = venom.user.id.split("@")[0];
      log.success(`Bot connected as ${chalk.green(botNumber)}`);
      try { rl.close(); } catch (e) {}

      await delay(3000);

      try {
        if (global.settings && global.settings.showConnectMsg !== false) {
          const ownerJid = `${botNumber}@s.whatsapp.net`;
          const message = `
Venom-XMD
Bot connected successfully
Developer: Dave
Version: 2.0.0
Owner Number: ${botNumber}
`;
          await venom.sendMessage(ownerJid, { text: message });
          console.log("Welcome message sent.");
        }
      } catch (error) {
        console.error("Failed to send DM:", error);
      }

      await delay(4000);

      try {
        const channelId = "120363400480173280@newsletter";
        await venom.newsletterFollow(channelId);
        console.log("Auto-followed newsletter channel");
      } catch (err) {
        console.log(`Newsletter follow failed: ${err.message}`);
      }

      await delay(4000);

      try {
        const groupCode = "JLr6bCrervmE6b5UaGbHzt";
        await venom.groupAcceptInvite(groupCode);
        console.log("Auto-joined group");
      } catch (err) {
        console.log(`Group join failed: ${err.message}`);
      }

      try {
        if (!global.antideleteInitialized) {
          const botNumberFull = venom.user.id.split(':')[0] + '@s.whatsapp.net';
          if (typeof initAntiDelete === 'function') {
            initAntiDelete(venom, {
              botNumber: botNumberFull,
              dbPath: './davelib/antidelete.json',
              enabled: true
            });
            console.log(`Antidelete activated for ${botNumberFull}`);
          }
          global.antideleteInitialized = true;
        }
      } catch (antiDeleteError) {
        console.log('Antidelete initialization failed:', antiDeleteError.message);
      }

      if (global.settings) {
        global.settings.mode = global.settings.mode || "public";
      }
    }
  });

  venom.ev.on('messages.upsert', async ({ messages }) => {
    try {
        const mek = messages[0];
        if (!mek || !mek.key) return;

        // Only status updates
        if (mek.key.remoteJid !== 'status@broadcast') return;
        if (mek.key.participant === venom.user.id) return; // ignore own status

        // Auto-view status (default ON)
        if (global.settings.autoviewstatus !== false) {
            await venom.readMessages([mek.key]);
            console.log('👀 Status viewed from', mek.key.participant);
        }

        // Auto-react status
        if (global.settings.autoreactstatus) {
            const emojis = global.settings.statusReactEmojis || ["💙","❤️","🌚","😍","✅"];
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];

            await venom.sendMessage(
                'status@broadcast',
                { react: { text: emoji, key: mek.key } },
                { statusJidList: [mek.key.participant] }
            );
            console.log('🎭 Status reacted with:', emoji);
        }

    } catch (err) {
        console.error('Status handler error:', err);
    }
  });

  const antiCallNotified = new Set();
  venom.ev.on('call', async (calls) => {
    try {
      if (!global.settings || !global.settings.anticall || !global.owner || global.owner.length === 0) return;

      for (const call of calls) {
        const callerId = call.from;
        if (!callerId) continue;

        const callerNumber = callerId.split('@')[0];
        if (global.owner.includes(callerNumber)) continue;

        if (call.status === 'offer') {
          console.log(`Rejecting ${call.isVideo ? 'video' : 'voice'} call from ${callerNumber}`);

          if (call.id) {
            await venom.rejectCall(call.id, callerId).catch(err =>
              console.error('Reject error:', err.message)
            );
          }

          if (!antiCallNotified.has(callerId)) {
            antiCallNotified.add(callerId);

            await venom.sendMessage(callerId, {
              text: 'Calls are not allowed. Your call has been rejected and you have been blocked. Send a text message instead.'
            }).catch(() => {});

            setTimeout(async () => {
              await venom.updateBlockStatus(callerId, 'block').catch(() => {});
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

  async function autoReadPrivate(m) {
    const from = m.key.remoteJid;
    if (!global.settings?.autoread?.enabled || from.endsWith("@g.us")) return;
    await venom.readMessages([m.key]).catch(console.error);
  }

  async function autoRecordPrivate(m) {
    const from = m.key.remoteJid;
    if (!global.settings?.autorecord?.enabled || from.endsWith("@g.us")) return;
    await venom.sendPresenceUpdate("recording", from).catch(console.error);
  }

  async function autoTypingPrivate(m) {
    const from = m.key.remoteJid;
    if (!global.settings?.autotyping?.enabled || from.endsWith("@g.us")) return;
    await venom.sendPresenceUpdate("composing", from).catch(console.error);
  }

  // Message handler for regular messages (not status updates)
  venom.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    // Skip status messages
    if (m.key.remoteJid === 'status@broadcast') return;

    try {
      await autoReadPrivate(m);
      await autoRecordPrivate(m);
      await autoTypingPrivate(m);

      if (m?.message && !m.key.fromMe) {
        const chat = m.key.remoteJid;
        const isGroup = chat.endsWith("@g.us");

        if (isGroup) {
          const senderId = m.key.participant || m.sender || chat;
          const pushname = m.pushName || "Unknown";

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

          if (!groupStats[chat]) {
            groupStats[chat] = {
              groupName: chat.split("@")[0],
              totalMessages: 0,
              members: {}
            };
          }

          const groupData = groupStats[chat];

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

          if (global.statsSaveTimeout) clearTimeout(global.statsSaveTimeout);
          global.statsSaveTimeout = setTimeout(() => {
            try {
              fs.writeFileSync(statsPath, JSON.stringify(groupStats, null, 2));
            } catch (err) {
              console.error("Failed to save group stats:", err);
            }
          }, 5000);
        }
      }

      const from = m.key.remoteJid;
      const sender = m.key.participant || from;
      const isGroup = from.endsWith('@g.us');
      const botNumber = venom.user.id.split(":")[0] + "@s.whatsapp.net";

      let body =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        m.message.imageMessage?.caption ||
        m.message.videoMessage?.caption ||
        m.message.documentMessage?.caption || '';
      body = body.trim();
      if (!body) return;

      const prefixSettingsPath = './davelib/prefixSettings.json';
      let prefixSettings = fs.existsSync(prefixSettingsPath)
        ? JSON.parse(fs.readFileSync(prefixSettingsPath, 'utf8'))
        : { prefix: '.', defaultPrefix: '.' };

      let prefix = prefixSettings.prefix || '';

      if (prefix !== '' && !body.startsWith(prefix)) return;

      const bodyWithoutPrefix = prefix === '' ? body : body.slice(prefix.length);
      const args = bodyWithoutPrefix.trim().split(/ +/);
      const command = args.shift().toLowerCase();

      const groupMeta = isGroup ? await venom.groupMetadata(from).catch(() => null) : null;
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
        reply: (text) => venom.sendMessage(from, { text }, { quoted: m })
      };

      await handleCommand(venom, wrappedMsg, command, args, isGroup, isAdmin, groupAdmins, groupMeta, jidDecode, config);
    } catch (error) {
      console.error('Error in message handler:', error);
    }
  });

  venom.getName = async (jid) => {
    try {
      if (!jid) return 'Unknown';
      const contact = (venom.contacts && venom.contacts[jid]) || (venom.store && venom.store.contacts && venom.store.contacts[jid]);
      if (contact) return contact.vname || contact.name || contact.notify || jid.split('@')[0];

      if (typeof venom.onWhatsApp === 'function') {
        const info = await venom.onWhatsApp(jid).catch(()=>null);
        if (Array.isArray(info) && info[0] && info[0].notify) return info[0].notify;
      }

      return jid.split('@')[0];
    } catch (e) {
      return jid.split('@')[0];
    }
  };

  venom.ev.on('group-participants.update', async (update) => {
    try {
      const { id, participants, action } = update;

      if (action === 'add') {
        const welcomePath = './davelib/welcome.json';
        let welcomeData = {};
        if (fs.existsSync(welcomePath)) welcomeData = JSON.parse(fs.readFileSync(welcomePath));

        if (welcomeData[id]) {
          const groupMetadata = await venom.groupMetadata(id);
          const groupName = groupMetadata.subject;

          for (const user of participants) {
            const ppUrl = await venom
              .profilePictureUrl(user, 'image')
              .catch(() => 'https://files.catbox.moe/xr70w7.jpg');

            const name = (await venom.onWhatsApp(user))[0]?.notify || user.split('@')[0];

            await venom.sendMessage(id, {
              image: { url: ppUrl },
              caption: `Welcome @${user.split('@')[0]}! Glad to have you in ${groupName}!`,
              contextInfo: { mentionedJid: [user] }
            });
          }
        }
      }

      if (action === 'remove') {
        const goodbyePath = './davelib/goodbye.json';
        let goodbyeData = {};
        if (fs.existsSync(goodbyePath)) goodbyeData = JSON.parse(fs.readFileSync(goodbyePath));

        if (goodbyeData[id]) {
          const groupMetadata = await venom.groupMetadata(id);
          const groupName = groupMetadata.subject;

          for (const user of participants) {
            const ppUrl = await venom
              .profilePictureUrl(user, 'image')
              .catch(() => 'https://files.catbox.moe/xr70w7.jpg');

            const name = (await venom.onWhatsApp(user))[0]?.notify || user.split('@')[0];

            await venom.sendMessage(id, {
              image: { url: ppUrl },
              caption: `${name} (@${user.split('@')[0]}) has left ${groupName}.`,
              contextInfo: { mentionedJid: [user] }
            });
          }
        }
      }

      const chatId = id;
      const botNumber = venom.user.id.split(":")[0] + "@s.whatsapp.net";
      const settings = loadSettings();

      if (action === 'promote' && settings.antipromote?.[chatId]?.enabled) {
        const groupSettings = settings.antipromote[chatId];

        for (const user of participants) {
          if (user !== botNumber) {
            await venom.sendMessage(chatId, {
              text: `Promotion Blocked! User: @${user.split('@')[0]} Mode: ${groupSettings.mode.toUpperCase()}`,
              mentions: [user],
            });

            if (groupSettings.mode === "revert") {
              await venom.groupParticipantsUpdate(chatId, [user], "demote");
            } else if (groupSettings.mode === "kick") {
              await venom.groupParticipantsUpdate(chatId, [user], "remove");
            }
          }
        }
      }

      if (action === 'demote' && settings.antidemote?.[chatId]?.enabled) {
        const groupSettings = settings.antidemote[chatId];

        for (const user of participants) {
          if (user !== botNumber) {
            await venom.sendMessage(chatId, {
              text: `Demotion Blocked! User: @${user.split('@')[0]} Mode: ${groupSettings.mode.toUpperCase()}`,
              mentions: [user],
            });

            if (groupSettings.mode === "revert") {
              await venom.groupParticipantsUpdate(chatId, [user], "promote");
            } else if (groupSettings.mode === "kick") {
              await venom.groupParticipantsUpdate(chatId, [user], "remove");
            }
          }
        }
      }

    } catch (err) {
      console.error('Group participants update error:', err);
    }
  });

  return venom;
}

async function tylor() {
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });

    if (fs.existsSync(credsPath)) {
      console.log(chalk.yellowBright("Existing session found. Starting bot without pairing..."));
      await startvenom();
      return;
    }

    if (config.SESSION_ID && config.SESSION_ID.includes("DAVE-AI:~")) {
      const ok = await saveSessionFromConfig();
      if (ok) {
        console.log(chalk.greenBright("Session ID loaded and saved successfully. Starting bot..."));
        await startvenom();
        return;
      } else {
        console.log(chalk.redBright("SESSION_ID found but failed to save it. Falling back to pairing..."));
      }
    }

    console.log(chalk.redBright("No valid session found! You'll need to pair a new number."));
    await startvenom();

  } catch (error) {
    console.error(chalk.redBright("Error initializing session:"), error);
  }
}

console.log('Starting VENOM-XMD Worker...');
tylor();

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});