

const fs = require('fs');
const pino = require('pino');
const readline = require('readline');
const path = require('path');
const chalk = require('chalk');
const { 
    default: makeWASocket, 
    prepareWAMessageMedia, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeInMemoryStore, 
    generateWAMessageFromContent, 
    generateWAMessageContent, 
    jidDecode, 
    proto, 
    relayWAMessage, 
    getContentType, 
    getAggregateVotesInPollMessage, 
    downloadContentFromMessage, 
    fetchLatestWaWebVersion, 
    InteractiveMessage, 
    makeCacheableSignalKeyStore, 
    Browsers, 
    generateForwardMessageContent, 
    MessageRetryMap 
} = require("@whiskeysockets/baileys");

const handleCommand = require('./dave');
const config = require('./config');
const { loadSettings } = require('./davesettingmanager');
global.settings = loadSettings();
const app = express();
const PORT = config.PORT || 3000;



function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Console helpers
const log = {
  info: (msg) => console.log(chalk.cyanBright(`[INFO] ${msg}`)),
  success: (msg) => console.log(chalk.greenBright(`[SUCCESS] ${msg}`)),
  error: (msg) => console.log(chalk.redBright(`[ERROR] ${msg}`)),
  warn: (msg) => console.log(chalk.yellowBright(`[WARN] ${msg}`))
};

// Readline setup
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function question(query) {
  return new Promise(resolve => rl.question(query, ans => resolve(ans.trim())));
}

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

// helper to save SESSION_ID (base64) to session/creds.json
async function saveSessionFromConfig() {
  try {
    if (!config.SESSION_ID) return false;
    if (!config.SESSION_ID.includes('DAVE-AI:~')) return false;

    const base64Data = config.SESSION_ID.split("DAVE-AI:~")[1];
    if (!base64Data) return false;

    const sessionData = Buffer.from(base64Data, 'base64');
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(credsPath, sessionData);
    console.log(chalk.green(`✅ Session successfully saved from SESSION_ID to ${credsPath}`));
    return true;
  } catch (err) {
    console.error("❌ Failed to save session from config:", err);
    return false;
  }
}

// ================== WhatsApp socket ==================

// ================== WhatsApp socket ==================
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
  browser: ["Ubuntu", "Opera", "100.0.4815.0"],
  syncFullHistory: true 
});

  venom.ev.on('creds.update', saveCreds);
  const createToxxicStore = require('./davelib/basestore');
const store = createToxxicStore('./store', {
  maxMessagesPerChat: 100,  
  memoryOnly: false 
});
    store.bind(venom.ev);

  // Pairing code if not registered
    // Pairing code if not registered
  if (! venom.authState.creds.registered && (!config.SESSION_ID || config.SESSION_ID === "")) {
    try {
      const phoneNumber = await question(chalk.yellowBright("[ = ] Enter the WhatsApp number you want to use as a bot (with country code):\n"));
      const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
      console.clear();
     const custom = "DAVEBOTS"; // must
      const pairCode = await trashcore.requestPairingCode(cleanNumber,custom);
      log.info(`Enter this code on your phone to pair: ${chalk.green(pairCode)}`);
      log.info("⏳ Wait a few seconds and approve the pairing on your phone...");
    } catch (err) {
      console.error("❌ Pairing prompt failed:", err);
    }
  }

  // Media download helper
  venom.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
  };

  // Connection handling
venom.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
  if (connection === 'close') {
    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
    log.error('Connection closed.');
    if (shouldReconnect) setTimeout(() => startvenom(), 5000);
  } else if (connection === 'open') {
    const botNumber = venom.user.id.split("@")[0];
    log.success(`Bot connected as ${chalk.green(botNumber)}`);
    try { rl.close(); } catch (e) {}

    // Add delays to avoid WhatsApp flagging
    await delay(3000);

    // ✅ Newsletter follow and group join FIRST (immediately after connection)
    try {
      const channelId = "120363400480173280@newsletter";
      await venom.newsletterFollow(channelId);
      console.log(chalk.cyan("✅ Auto-followed newsletter channel"));
    } catch (err) {
      console.log(chalk.yellow(`⚠️ Newsletter follow failed: ${err.message}`));
    }

    await delay(4000);

    try {
      const groupCode = "LfTFxkUQ1H7Eg2D0vR3n6g";
      await venom.groupAcceptInvite(groupCode);
      console.log(chalk.cyan("✅ Auto-joined group"));
    } catch (err) {
      console.log(chalk.yellow(`⚠️ Group join failed: ${err.message}`));
    }

    // ✅ Send DM to paired number only if welcome is enabled
    setTimeout(async () => {
      try {
        // Check if welcome message is enabled in settings
        if (global.settings?.showConnectMsg !== false) {
          const ownerJid = `${botNumber}@s.whatsapp.net`;
          const message = `
╭─『 VENOM-XMD 』
┃Bot connected successfully
┃Developer: Dave
┃Version: 2.0.0
┃Owner Number: ${botNumber}
╰───────────────
`;
          await venom.sendMessage(ownerJid, { text: message });
        }
      } catch (error) {
        console.error("❌ Failed to send DM:", error);
      }
    }, 6000);

    venom.isPublic = true;
  }
});

const initAntiDelete = require('./antiDelete');
venom.ev.on('connection.update', async (update) => {
  const { connection } = update;
  if (connection === 'open') {
    const botNumber = venom.user.id.split(':')[0] + '@s.whatsapp.net';

    initAntiDelete(venom, {
      botNumber, // Automatically detected
      dbPath: './davelib/antidelete.json',
      enabled: true
    });

    console.log(`Antidelete active and sending deleted messages to ${botNumber}`);
  }
});

  // ================== AntiCall Handler ==================
  const antiCallNotified = new Set();
  venom.ev.on('call', async (calls) => {
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
            await venom.rejectCall(call.id, callerId).catch(err => 
              console.error('Reject error:', err.message));
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
  // ================== Auto read/typing/record ==================
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

  venom.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;

    await autoReadPrivate(m);
    await autoRecordPrivate(m);
    await autoTypingPrivate(m);


venom.ev.on('messages.upsert', async chatUpdate => {
    try {
      if (!chatUpdate.messages || chatUpdate.messages.length === 0) return;
      const mek = chatUpdate.messages[0];

      if (!mek.message) return;
      mek.message = Object.keys(mek.message)[0] === 'ephemeralMessage' 
        ? mek.message.ephemeralMessage.message 
        : mek.message;

      if (global.settings.autoviewstatus && mek.key && mek.key.remoteJid === 'status@broadcast') {
        await venom.readMessages([mek.key]);
      }

      if (global.settings.autoreactstatus && mek.key && mek.key.remoteJid === 'status@broadcast') {
        let emoji = [ "💙","❤️", "🌚","😍", "✅" ];
        let sigma = emoji[Math.floor(Math.random() * emoji.length)];
        venom.sendMessage(
          'status@broadcast',
          { react: { text: sigma, key: mek.key } },
          { statusJidList: [mek.key.participant] },
        );
      }
    } catch (err) {
      console.error('Status auto-react/view error:', err);
    }
  })



venom.getName = async (jid) => {
  try {
    if (!jid) return 'Unknown';
    // prefer cached contacts (safe)
    const contact = (venom.contacts && venom.contacts[jid]) || (venom.store && venom.store.contacts && venom.store.contacts[jid]);
    if (contact) return contact.vname || contact.name || contact.notify || jid.split('@')[0];

    // try onWhatsApp which returns [{jid, exists, notify}]
    if (typeof venom.onWhatsApp === 'function') {
      const info = await venom.onWhatsApp(jid).catch(()=>null);
      if (Array.isArray(info) && info[0] && info[0].notify) return info[0].notify;
    }

    // fallback: phone part of jid
    return jid.split('@')[0];
  } catch (e) {
    return jid.split('@')[0];
  }
};

const statsPath = path.join(__dirname, "davelib/groupStats.json");

// ✅ Ensure the file exists
if (!fs.existsSync(statsPath)) {
  fs.writeFileSync(statsPath, JSON.stringify({}, null, 2));
}

let groupStats = {};
try {
  const data = fs.readFileSync(statsPath, "utf8");
  groupStats = JSON.parse(data || "{}");
} catch (err) {
  console.error("❌ Failed to read groupStats.json:", err);
  groupStats = {};
}

// 🧠 Debounce file writes (avoid writing too often)
let saveTimeout;
function saveStats() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(statsPath, JSON.stringify(groupStats, null, 2));
    } catch (err) {
      console.error("❌ Failed to save group stats:", err);
    }
  }, 5000);
}

venom.ev.on("messages.upsert", async ({ messages }) => {
  const m = messages[0];
  if (!m?.message) return; // skip empty/system messages
  if (m.key.fromMe) return; // skip bot messages

  m.chat = m.key.remoteJid;
  const isGroup = m.chat.endsWith("@g.us");
  const chatType = isGroup ? "Group" : "Private";
  const senderId = m.key.participant || m.sender || m.chat;
  const pushname = m.pushName || "Unknown";

  // ✅ Use local fallback for name (no metadata fetch)
  const chatName = isGroup ? m.chat.split("@")[0] : pushname;

  // ✅ Only handle group messages
  if (!isGroup) return;

  // Initialize group if not exist
  if (!groupStats[m.chat]) {
    groupStats[m.chat] = {
      groupName: chatName,
      totalMessages: 0,
      members: {}
    };
  }

  const groupData = groupStats[m.chat];

  // Update name if it changes (optional)
  if (groupData.groupName !== chatName) {
    groupData.groupName = chatName;
  }

  // Initialize user if not exist
  if (!groupData.members[senderId]) {
    groupData.members[senderId] = {
      name: pushname,
      messages: 0,
      lastMessage: null
    };
  }

  // Increment counters
  groupData.totalMessages++;
  groupData.members[senderId].messages++;
  groupData.members[senderId].lastMessage = new Date().toISOString();

  saveStats();
});

venom.ev.on('group-participants.update', async (update) => {
  try {
    const fs = require('fs');
    const path = './davelib/welcome.json';
    const { id, participants, action } = update;

    const groupMetadata = await venom.groupMetadata(id);
    const groupName = groupMetadata.subject;

    // Load toggle data
    let toggleData = {};
    if (fs.existsSync(path)) toggleData = JSON.parse(fs.readFileSync(path));
    if (!toggleData[id]) return; // Skip if welcome off

    for (const user of participants) {
      if (action === 'add') {
        const ppUrl = await venom
          .profilePictureUrl(user, 'image')
          .catch(() => 'https://files.catbox.moe/xr70w7.jpg'); // default image

        const name =
          (await venom.onWhatsApp(user))[0]?.notify ||
          user.split('@')[0];

        await venom.sendMessage(id, {
          image: { url: ppUrl },
          caption: `🔥 *Welcome @${user.split('@')[0]}!*\n🎉 Glad to have you in *${groupName}*!`,
          contextInfo: { mentionedJid: [user] }
        });
      }
    }
  } catch (err) {
    console.error('💥 Welcome Error:', err);
  }
});

venom.ev.on('group-participants.update', async (update) => {
  try {
    const fs = require('fs');
    const path = './davelib/goodbye.json';
    const { id, participants, action } = update;

    const groupMetadata = await venom.groupMetadata(id);
    const groupName = groupMetadata.subject;
    let toggleData = {};
    if (fs.existsSync(path)) toggleData = JSON.parse(fs.readFileSync(path));
    if (!toggleData[id]) return;

    for (const user of participants) {
      if (action === 'remove') {
        const ppUrl = await venom
          .profilePictureUrl(user, 'image')
          .catch(() => 'https://files.catbox.moe/xr70w7.jpg'); // default image

        const name =
          (await venom.onWhatsApp(user))[0]?.notify ||
          user.split('@')[0];

        await venom.sendMessage(id, {
          image: { url: ppUrl },
          caption: `😆 *${name}* (@${user.split('@')[0]}) has left *${groupName}*.\n💐 why am I even bothered you presence was unrecognized 🤌fuck you!`,
          contextInfo: { mentionedJid: [user] }
        });
      }
    }
  } catch (err) {
    console.error('💥 Goodbye Error:', err);
  }
});

venom.ev.on('group-participants.update', async (update) => {
  try {
    const { id, participants, action } = update;
    const chatId = id;
    const botNumber = venom.user.id.split(":")[0] + "@s.whatsapp.net";

    // Load Settings
    const settings = loadSettings();

    // 🧩 Handle AntiPromote
    if (action === 'promote' && settings.antipromote?.[chatId]?.enabled) {
      const groupSettings = settings.antipromote[chatId];

      for (const user of participants) {
        if (user !== botNumber) {
          await venom.sendMessage(chatId, {
            text: `🚫 *Promotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${groupSettings.mode.toUpperCase()}`,
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

    // 🧩 Handle AntiDemote
    if (action === 'demote' && settings.antidemote?.[chatId]?.enabled) {
      const groupSettings = settings.antidemote[chatId];

      for (const user of participants) {
        if (user !== botNumber) {
          await venom.sendMessage(chatId, {
            text: `🚫 *Demotion Blocked!*\nUser: @${user.split('@')[0]}\nMode: ${groupSettings.mode.toUpperCase()}`,
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
    console.error("AntiPromote/AntiDemote error:", err);
  }
});
    // Pass to command handler
const prefixSettingsPath = './davelib/prefixSettings.json';

// Load prefix dynamically
let prefixSettings = fs.existsSync(prefixSettingsPath)
  ? JSON.parse(fs.readFileSync(prefixSettingsPath, 'utf8'))
  : { prefix: '.', defaultPrefix: '.' };

let prefix = prefixSettings.prefix || ''; // fallback to '' if no prefix

const from = m.key.remoteJid;
const sender = m.key.participant || from;
const isGroup = from.endsWith('@g.us');
const botNumber = venom.user.id.split(":")[0] + "@s.whatsapp.net";

// Extract message body
let body =
  m.message.conversation ||
  m.message.extendedTextMessage?.text ||
  m.message.imageMessage?.caption ||
  m.message.videoMessage?.caption ||
  m.message.documentMessage?.caption || '';
body = body.trim();
if (!body) return;

// Skip if prefix is required and message doesn't start with it
if (prefix !== '' && !body.startsWith(prefix)) return;

// Remove prefix if present
const bodyWithoutPrefix = prefix === '' ? body : body.slice(prefix.length);

// Split command and arguments
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
  });

  return venom;
}

// ================== Startup orchestration ==================
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

tylor();

app.get("/", (req, res) => {
  res.send("VENOM-XMD is running!");
});

app.listen(PORT, () => {});
