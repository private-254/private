const { malvin } = require('../malvin');
const { sleep } = require('../lib/functions');
const { exec, execSync } = require('child_process');
const { promisify } = require('util');
const config = require('../settings');

const execPromise = promisify(exec);

malvin({
    pattern: 'restart',
    alias: ['reboot', 'refresh'],
    desc: 'Restart the X-GURU bot system',
    category: 'system',
    react: '♻️',
    filename: __filename,
    ownerOnly: true
}, async (malvin, mek, m, { from, sender, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply('❗ *Access Denied:*\nOnly the bot owner can use this command.');
        }

        const newsletterJid = config.NEWSLETTER_JID || '120363299029326322@newsletter';
        const ownerName = config.OWNER_NAME || 'GuruTech';
        const botName = config.BOT_NAME || 'X-GURU';

        // Countdown notification in old style
        await reply(`
╭───〔 *${botName} Restart* 〕───
│ 🔁 Status   : Restart Initiated
│ ⏰ Timer    : 3 seconds
│ 🛑 Note     : Do not send commands until the bot is back online
╰─────────────────────────────
`.trim(), {
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid,
                    newsletterName: ownerName,
                    serverMessageId: 143
                }
            }
        });

        // Countdown 3…2…1
        for (let i = 2; i > 0; i--) {
            await sleep(1000);
            await reply(`⏳ Restarting in ${i}...`, { contextInfo: { mentionedJid: [sender] } });
        }
        await sleep(1000);

        // Final “live” restart box in old style
        const restartBox = `
╔═══════════════════════
║  『 ${botName} RESTART 』
╠═══════════════════════
║ 🔌 Estimated Downtime : 15–20 seconds
║ 🧠 Status             : Auto-reconnect will reactivate the bot
╠═══════════════════════
║ 💻 Owner : ${ownerName}
║ 🤖 Bot   : ${botName}
╠═══════════════════════
║ 🌟 Stay tuned & visit newsletter
╚═══════════════════════
`.trim();

        await reply(restartBox, {
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid,
                    newsletterName: ownerName,
                    serverMessageId: 143
                }
            }
        });

        // Check if PM2 is available
        let pm2Available = false;
        try {
            execSync('pm2 --version', { stdio: 'ignore' });
            pm2Available = true;
        } catch {}

        if (pm2Available) {
            const { stdout, stderr } = await execPromise('pm2 restart all');
            if (stderr) console.error('PM2 Restart Warning:', stderr);
        } else {
            // Fallback for Docker restart
            process.exit(0);
        }

    } catch (e) {
        console.error('Restart Failed:', e.stack);
        await reply(`
╭───〔 RESTART FAILED 〕───
│ ❌ Error: ${e.message}
│ 🔧 Next Steps:
│ 1. Verify PM2 installed
│ 2. Check Docker restart policy
│ 3. Contact ${config.OWNER_NAME || 'GuruTech'}
╰─────────────────────────────
`.trim(), {
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID || '120363299029326322@newsletter',
                    newsletterName: config.OWNER_NAME || 'GuruTech',
                    serverMessageId: 143
                }
            }
        });
    }
});
