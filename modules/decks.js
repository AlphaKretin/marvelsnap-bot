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
exports.searchDecks = void 0;
const discord_js_1 = require("discord.js");
const make_fetch_happen_1 = __importDefault(require("make-fetch-happen"));
const config_json_1 = require("../config.json");
function isError(response) {
    return response.error !== undefined;
}
function searchDecks(name, card) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = `${config_json_1.decksource}?`;
        if (name) {
            url += `name=${encodeURIComponent(name)}`;
            if (card) {
                url += "&";
            }
        }
        if (card) {
            url += `cardcode=${encodeURIComponent(card)}`;
        }
        const deckResponse = yield (0, make_fetch_happen_1.default)(url);
        const decks = (yield deckResponse.json());
        if (isError(decks)) {
            return null;
        }
        else {
            if (decks.length < 1) {
                return null;
            }
            const fiveDecks = decks.slice(0, 5);
            const deckStrings = fiveDecks.map(d => `[${d.deck_name}](${config_json_1.deckurl + d.pretty_url}) created by ${d.username} (${d.deck_views} 👁️)`);
            const deckEmbed = new discord_js_1.MessageEmbed().setTitle("Decks").setDescription(deckStrings.join("\n")).setColor(config_json_1.embed);
            return deckEmbed;
        }
    });
}
exports.searchDecks = searchDecks;
//# sourceMappingURL=decks.js.map