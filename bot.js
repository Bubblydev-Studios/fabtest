const mineflayer = require("mineflayer");
const express = require("express");

// -----------------------------
// Render Web Server
// -----------------------------
const app = express();

app.get("/", (req, res) => {
    res.send("Minecraft Bot is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`);
});

// -----------------------------
// Minecraft Settings
// -----------------------------
const config = {
    host: "VoidedSMP.aternos.me",
    port: 38491,
    username: "JumpBot",
    version: false // Auto detect version
};

function startBot() {
    console.log("==================================");
    console.log("Starting bot...");
    console.log(`Host: ${config.host}`);
    console.log(`Port: ${config.port}`);
    console.log("==================================");

    const bot = mineflayer.createBot(config);

    bot._client.on("connect", () => {
        console.log("✅ TCP Connected!");
    });

    bot.on("login", () => {
        console.log("✅ Logged into Minecraft!");
    });

    bot.once("spawn", () => {
        console.log("✅ Bot spawned!");

        // Jump every 5 seconds
        setInterval(() => {
            if (!bot.entity) return;

            console.log("Jump!");

            bot.setControlState("jump", true);

            setTimeout(() => {
                bot.setControlState("jump", false);
            }, 300);

        }, 5000);
    });

    bot.on("chat", (username, message) => {
        console.log(`<${username}> ${message}`);
    });

    bot.on("message", (message) => {
        console.log("[SERVER]", message.toString());
    });

    bot.on("kicked", (reason) => {
        console.log("❌ Kicked:");
        console.log(reason);
    });

    bot.on("end", (reason) => {
        console.log("❌ Disconnected:");
        console.log(reason);

        console.log("Reconnecting in 5 seconds...");

        setTimeout(() => {
            startBot();
        }, 5000);
    });

    bot.on("error", (err) => {
        console.log("❌ Error:");
        console.log(err);
    });
}

startBot();
