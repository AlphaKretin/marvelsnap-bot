import fetch from "make-fetch-happen";
import fuse from "fuse.js";
import { MessageEmbed } from "discord.js";
import { messageCapSlice } from "./util";
import { apisource, embed, picsource, picext, dbsource } from "../config.json";

const fuseOptions: fuse.FuseOptions<APICard> = {
	shouldSort: true,
	threshold: 0.6,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: ["name"]
};

let allCards: APICard[] = [];
export let cardFuzzy: fuse<APICard, typeof fuseOptions>;

export async function updateCardNames(): Promise<void> {
	const rawResponse = await fetch(apisource);
	allCards = (await rawResponse.json()) as APICard[];
	cardFuzzy = new fuse<APICard, typeof fuseOptions>(allCards, fuseOptions);
}

interface APICard {
	id: string;
	name: string;
	type: string;
	cost?: string;
	power?: string;
	ability?: string;
	date_added: string;
	status?: string;
	variants?: string;
	pretty_url: string;
}

function generateCardStats(card: APICard): string {
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

function parseCardInfo(card: APICard): MessageEmbed {
	const stats = generateCardStats(card);

	let outEmbed = new MessageEmbed()
		.setColor(embed)
		.setDescription(stats)
		.setThumbnail(picsource + card.id + picext)
		.setTitle(card.name)
		.setURL(dbsource + encodeURIComponent(card.pretty_url));

	if (card.status) {
		outEmbed = outEmbed.setFooter({ text: `Status: ${card.status}` });
	}

	const descs = messageCapSlice(card.ability || "");
	outEmbed = outEmbed.addField("Card Ability", descs[0].length > 0 ? descs[0] : "No Ability");
	for (let i = 1; i < descs.length; i++) {
		outEmbed = outEmbed.addField("Continued", descs[i]);
	}

	return outEmbed;
}

export function searchCard(query: string): MessageEmbed | undefined {
	const fuzzyResult = cardFuzzy.search(query);
	if (fuzzyResult.length > 0) {
		const card = "name" in fuzzyResult[0] ? fuzzyResult[0] : fuzzyResult[0].item;
		return parseCardInfo(card);
	}
	return;
}
