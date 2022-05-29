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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCard = exports.updateCardNames = exports.cardFuzzy = void 0;
const make_fetch_happen_1 = __importDefault(require("make-fetch-happen"));
const fuse_js_1 = __importDefault(require("fuse.js"));
const discord_js_1 = require("discord.js");
const util_1 = require("./util");
const config_json_1 = require("../config.json");
const fuseOptions = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name"]
};
let allCards = [];
function updateCardNames() {
    return __awaiter(this, void 0, void 0, function* () {
        const rawResponse = yield (0, make_fetch_happen_1.default)(config_json_1.apisource);
        allCards = (yield rawResponse.json());
        exports.cardFuzzy = new fuse_js_1.default(allCards, fuseOptions);
    });
}
exports.updateCardNames = updateCardNames;
function generateCardStats(card) {
    let stats = "";
    const type = `**Type**: ${card.type}`;
    stats += type;
    stats += "\n";
    if (card.cost) {
        stats += `**Cost**: ${card.cost} `;
    }
    if (card.power) {
        stats += `**Power**: ${card.power}`;
    }
    stats += "\n";
    return stats;
}
function parseCardInfo(card) {
    const stats = generateCardStats(card);
    let footer = `${card.id}`;
    if (card.status) {
        footer += ` Status: ${card.status}`;
    }
    let outEmbed = new discord_js_1.MessageEmbed()
        .setColor(config_json_1.embed)
        .setDescription(stats)
        .setFooter({ text: footer })
        .setThumbnail(config_json_1.picsource + card.id + config_json_1.picext)
        .setTitle(card.name)
        .setURL(config_json_1.dbsource + encodeURIComponent(card.pretty_url));
    const descs = (0, util_1.messageCapSlice)(card.ability || "");
    outEmbed = outEmbed.addField("Card Ability", descs[0].length > 0 ? descs[0] : "No Ability");
    for (let i = 1; i < descs.length; i++) {
        outEmbed = outEmbed.addField("Continued", descs[i]);
    }
    return outEmbed;
}
function searchCard(query) {
    const fuzzyResult = exports.cardFuzzy.search(query);
    if (fuzzyResult.length > 0) {
        const card = "name" in fuzzyResult[0] ? fuzzyResult[0] : fuzzyResult[0].item;
        return parseCardInfo(card);
    }
    return;
}
exports.searchCard = searchCard;
//# sourceMappingURL=cards.js.map