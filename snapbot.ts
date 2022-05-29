import { Client } from "discord.js";
import { token } from "./auth.json";
import { errhand } from "./modules/util";
import { searchCard, updateCardNames } from "./modules/cards.js";

process.on("unhandledRejection", errhand);

const bot = new Client({ intents: ["GUILD_MESSAGES"] });

async function update(): Promise<void> {
	const proms: Array<Promise<void>> = [];
	proms.push(updateCardNames().then(() => console.log("Card names updated")));
	await Promise.all(proms);
}

bot.on("interactionCreate", async i => {
	if (!i.isCommand()) return;
	const name = i.options.getString("name", true);
	const embed = searchCard(name);
	if (embed) {
		await i.reply({ embeds: [embed] });
	} else {
		await i.reply({ ephemeral: true, content: `Sorry, I couldn't find a card with a name that matches \`${name}\`.` });
	}
});

bot.on("error", errhand);

bot.on("warn", errhand);

bot.on("ready", () => {
	console.log("Logged in as %s - %s", bot.user?.username || "null", bot.user?.id || "null");
	update().then(() => console.log("Ready to go!"));
});

bot.login(token);
