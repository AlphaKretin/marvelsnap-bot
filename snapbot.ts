import { Client } from "discord.js";
import { token } from "./auth.json";
import { errhand } from "./modules/util";
import { searchCard, updateCardNames } from "./modules/cards.js";
import { searchDecks } from "./modules/decks";

process.on("unhandledRejection", errhand);

const bot = new Client({ intents: ["GUILD_MESSAGES"] });

async function update(): Promise<void> {
	const proms: Array<Promise<void>> = [];
	proms.push(updateCardNames().then(() => console.log("Card names updated")));
	await Promise.all(proms);
}

bot.on("interactionCreate", async i => {
	if (!i.isCommand()) return;
	if (i.commandName === "card") {
		const name = i.options.getString("name", true);
		const embed = searchCard(name);
		const ephemeral = i.options.getBoolean("ephemeral", false) || false;
		if (embed) {
			await i.reply({ ephemeral, embeds: [embed] });
		} else {
			await i.reply({
				ephemeral: true,
				content: `Sorry, I couldn't find a card with a name that matches \`${name}\`.`
			});
		}
		return;
	}
	if (i.commandName === "deck") {
		const name = i.options.getString("name", false);
		const card = i.options.getString("card", false);
		const embed = await searchDecks(name, card);
		const ephemeral = i.options.getBoolean("ephemeral", false) || false;
		if (embed) {
			await i.reply({ ephemeral, embeds: [embed] });
		} else {
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
			await i.reply({
				ephemeral: true,
				content: message
			});
		}
		return;
	}
});

bot.on("error", errhand);

bot.on("warn", errhand);

bot.on("ready", () => {
	console.log("Logged in as %s - %s", bot.user?.username || "null", bot.user?.id || "null");
	update().then(() => console.log("Ready to go!"));
	const ONE_DAY_MS = 1000 * 60 * 60 * 24;
	setInterval(() => {
		console.log("Starting update!");
		update()
			.then(() => console.log("Update complete!"))
			.catch(e => console.log(e));
	}, ONE_DAY_MS);
});

bot.login(token);
