"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const auth_json_1 = require("./auth.json");
const config_json_1 = require("./config.json");
const util_1 = require("./modules/util");
const cards_js_1 = require("./modules/cards.js");
process.on("unhandledRejection", util_1.errhand);
const bot = new discord_js_1.Client({ intents: ["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES"] });
function update() {
    return __awaiter(this, void 0, void 0, function* () {
        const proms = [];
        proms.push((0, cards_js_1.updateCardNames)().then(() => console.log("Card names updated")));
        yield Promise.all(proms);
    });
}
bot.on("messageCreate", m => {
    const msg = m; // assert channel is in cache as code previously assumed
    if (msg.author.bot) {
        return;
    }
    if (msg.content.startsWith(config_json_1.prefix)) {
        const command = (0, util_1.cleanString)(msg.content);
        // Admin-only commands
        if (auth_json_1.admins.includes(msg.author.id)) {
            // Update command. Admin-only, updates the list of tags from the source.
            if (command.startsWith("update")) {
                msg.reply({ content: "Updating!", allowedMentions: { repliedUser: false } }).then(m => {
                    update().then(() => {
                        m.edit("Update complete!");
                    }, err => {
                        m.edit(`Error!\n\`\`\`\n${err}\`\`\``);
                    });
                });
                return;
            }
            if (command.startsWith("server")) {
                const count = bot.guilds.cache.size;
                const guildList = (0, util_1.messageCapSlice)(bot.guilds.cache.map(g => `${g.name} (Users: ${g.memberCount})`).join("\n"));
                msg
                    .reply(`I am in ${count} cached servers. Type \`.servers list\` to see the whole list. This will send you ${guildList.length} Direct Message(s).`)
                    .then(() => __awaiter(void 0, void 0, void 0, function* () {
                    if (command.includes("list")) {
                        const chan = yield msg.author.createDM();
                        for (const mes of guildList) {
                            yield chan.send(mes);
                        }
                    }
                }))
                    .catch(util_1.errhand);
            }
        }
    }
    const queryReg = /\[([^[]+?)\]/g; // declare anew in-scope to reset index
    let result = queryReg.exec(msg.content);
    const results = [];
    while (result !== null) {
        results.push(result[1]);
        result = queryReg.exec(msg.content);
    }
    if (results.length > 0) {
        const max = Math.min(results.length, config_json_1.maxSearch);
        for (let i = 0; i < max; i++) {
            if (results[i].length > 1 || results[i] === "7") {
                (0, cards_js_1.searchCard)(results[i], msg).catch(util_1.errhand);
            }
        }
    }
});
bot.on("error", util_1.errhand);
bot.on("warn", util_1.errhand);
bot.on("ready", () => {
    var _a, _b;
    console.log("Logged in as %s - %s", ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.username) || "null", ((_b = bot.user) === null || _b === void 0 ? void 0 : _b.id) || "null");
    update().then(() => console.log("Ready to go!"));
});
bot.login(auth_json_1.token);
//# sourceMappingURL=snapbot.js.map