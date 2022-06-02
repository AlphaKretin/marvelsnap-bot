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
const util_1 = require("./modules/util");
const cards_js_1 = require("./modules/cards.js");
const decks_1 = require("./modules/decks");
process.on("unhandledRejection", util_1.errhand);
const bot = new discord_js_1.Client({ intents: ["GUILD_MESSAGES"] });
function update() {
    return __awaiter(this, void 0, void 0, function* () {
        const proms = [];
        proms.push((0, cards_js_1.updateCardNames)().then(() => console.log("Card names updated")));
        yield Promise.all(proms);
    });
}
bot.on("interactionCreate", (i) => __awaiter(void 0, void 0, void 0, function* () {
    if (!i.isCommand())
        return;
    if (i.commandName === "card") {
        const name = i.options.getString("name", true);
        const embed = (0, cards_js_1.searchCard)(name);
        const ephemeral = i.options.getBoolean("ephemeral", false) || false;
        if (embed) {
            yield i.reply({ ephemeral, embeds: [embed] });
        }
        else {
            yield i.reply({
                ephemeral: true,
                content: `Sorry, I couldn't find a card with a name that matches \`${name}\`.`
            });
        }
        return;
    }
    if (i.commandName === "deck") {
        const name = i.options.getString("name", false);
        const card = i.options.getString("card", false);
        const embed = yield (0, decks_1.searchDecks)(name, card);
        const ephemeral = i.options.getBoolean("ephemeral", false) || false;
        if (embed) {
            yield i.reply({ ephemeral, embeds: [embed] });
        }
        else {
            let message = ", I couldn't find any decks that match ";
            if (name) {
                message += `the name \`${name}\``;
                if (card) {
                    message += " and ";
                }
            }
            if (card) {
                message += `the card \`${card}\``;
            }
            message += ".";
            yield i.reply({
                ephemeral: true,
                content: message
            });
        }
        return;
    }
}));
bot.on("error", util_1.errhand);
bot.on("warn", util_1.errhand);
bot.on("ready", () => {
    var _a, _b;
    console.log("Logged in as %s - %s", ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.username) || "null", ((_b = bot.user) === null || _b === void 0 ? void 0 : _b.id) || "null");
    update().then(() => console.log("Ready to go!"));
});
bot.login(auth_json_1.token);
//# sourceMappingURL=snapbot.js.map