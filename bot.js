const mineflayer = require("mineflayer");
const express = require("express");

// --------------------
// Render Web Server
// --------------------
const app = express();

app.get("/", (req, res) => {
    res.send("Minecraft Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`);
});

// --------------------
// Minecraft Bot
// --------------------

const config = {
    host: "VoidedSMP.aternos.me",
    port: 38491,
    username: "JumpBot",
    version: false // Auto-detect version
};

function startBot() {
    console.log("Starting bot...");

    const bot = mineflayer.createBot(config);

    bot.once("spawn", () => {
        console.log("✅ Bot joined the server!");

        // Jump every 5 seconds
        setInterval(() => {
            if (!bot.entity) return;

            bot.setControlState("jump", true);

            setTimeout(() => {
                bot.setControlState("jump", false);
            }, 300);

        }, 5000);
    });

    bot.on("end", (reason) => {
        console.log("Disconnected:", reason);
        console.log("Reconnecting in 5 seconds...");

        setTimeout(startBot, 5000);
    });

    bot.on("kicked", console.log);

    bot.on("error", (err) => {
        console.log("Error:", err.message);
    });
}

startBot();
