const express = require("express");
const mineflayer = require("mineflayer");
const dns = require("dns");

// -----------------------------
// Render Web Server
// -----------------------------
const app = express();

app.get("/", (req, res) => {
    res.send("Minecraft Jump Bot is Online!");
});

const WEB_PORT = process.env.PORT || 3000;

app.listen(WEB_PORT, () => {
    console.log(`Web server running on port ${WEB_PORT}`);
});

// -----------------------------
// Minecraft Config
// -----------------------------
const config = {
    host: "spinyfin.aternos.host",
    port: 38491,
    username: "JumpBot",
    version: false // Auto-detect
};

// -----------------------------
// Start Bot
// -----------------------------
function startBot() {

    console.log("================================");
    console.log("Starting bot...");
    console.log(`Host: ${config.host}`);
    console.log(`Port: ${config.port}`);
    console.log("================================");

    dns.lookup(config.host, (err, address, family) => {
        if (err) {
            console.log("DNS Error:", err);
        } else {
            console.log(`Resolved ${config.host} -> ${address} (IPv${family})`);
        }
    });

    const bot = mineflayer.createBot(config);

    bot._client.on("connect", () => {
        console.log("✅ TCP Connected");
    });

    bot.on("login", () => {
        console.log("✅ Logged in");
    });

    bot.once("spawn", () => {
        console.log("✅ Spawned!");

        setInterval(() => {
            if (!bot.entity) return;

            console.log("Jump!");

            bot.setControlState("jump", true);

            setTimeout(() => {
                bot.setControlState("jump", false);
            }, 250);

        }, 5000);
    });

    bot.on("message", (msg) => {
        console.log("[CHAT]", msg.toString());
    });

    bot.on("kicked", (reason) => {
        console.log("❌ Kicked:");
        console.log(reason);
    });

    bot.on("error", (err) => {
        console.log("❌ Error:");
        console.log(err);
    });

    bot.on("end", (reason) => {
        console.log("❌ Disconnected:");
        console.log(reason);

        console.log("Reconnecting in 5 seconds...");

        setTimeout(startBot, 5000);
    });
}

startBot();
