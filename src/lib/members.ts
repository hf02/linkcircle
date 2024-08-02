import { LinkcircleError } from "./error";
import { ExtendableArray } from "./ExtendableArray";
import { waitForElements, waitForLoad } from "./html";
import { log } from "./log";
import { randInt } from "./random";
import { getStorage, setStorage } from "./storage";

async function getMembersFromDocument(options: MemberHtmlOptions) {
	await waitForLoad();

	const elements = await waitForElements(options.memberSelector);

	const members = elements.map(
		(v) =>
			new Member(
				v.getAttribute(options.slugAttributeName),
				v.getAttribute(options.hrefAttributeName),
			),
	);

	return new MemberCollection(...members);
}

async function getMembersFromStorage(
	cacheLifespan: number,
	storageKey: string,
) {
	try {
		const json = getStorage(storageKey);
		if (json == null) {
			// there's no cache saved.
			return new MemberCollection();
		}

		const savedTimestamp = json.timestamp;
		const now = Date.now();
		if (savedTimestamp > now || savedTimestamp + cacheLifespan < now) {
			// cache expired.
			return new MemberCollection();
		}

		return MemberCollection.fromSerialized(json.members);
	} catch (e) {
		log("warn", "failed to read the cache", e);
		return new MemberCollection();
	}
}

export function saveMembers(collection: MemberCollection, key: string) {
	setStorage(
		{ members: collection.toSerialized(), timestamp: Date.now() },
		key,
	);
}

export interface MemberHtmlOptions {
	slugAttributeName: string;
	hrefAttributeName: string;
	memberSelector: string;
}

export async function getMembers(
	cacheLifespan: number,
	storagePrefix: string,
	options: MemberHtmlOptions,
) {
	// first, try the cache.
	const storageKey = `${storagePrefix}-${location.pathname}`;
	if (cacheLifespan > 0) {
		const fromStorage = await getMembersFromStorage(
			cacheLifespan,
			storageKey,
		);
		if (fromStorage.length !== 0) {
			return fromStorage;
		}
	}

	// cache had nothing, so read from the document.
	const members = await getMembersFromDocument(options);
	saveMembers(members, storageKey);
	return members;
}

export class Member {
	url: URL;
	constructor(public slug: string, href: string) {
		try {
			this.url = new URL(href, location.href);
		} catch (e) {
			throw new LinkcircleError(
				"invalid-url",
				`"${href}" is not a valid URL.`,
				e,
			);
		}
	}

	toSerialized() {
		return JSON.stringify({
			url: this.url.toString(),
			slug: this.slug,
		});
	}

	static fromSerialized(data: string) {
		const member = JSON.parse(data);
		return new Member(member.slug, member.url);
	}
}

export class MemberCollection extends ExtendableArray<Member> {
	indexOfSlug(slug: string) {
		for (let i = 0; i < this.length; i++) {
			const element = this[i];
			if (element.slug === slug) {
				return i;
			}
		}
		return -1;
	}

	offsetFrom(slug: string, offset: number): Member | null {
		const index = this.indexOfSlug(slug);
		if (index === -1) {
			return null;
		}
		return this.at((index + offset) % this.length);
	}

	random() {
		return this[randInt(0, this.length)];
	}

	randomFromMember(slug: string) {
		// would return undefined otherwise, which sucks
		if (this.length === 1) return this.random();

		const withoutMember = new MemberCollection(...this);
		const memberIndex = withoutMember.indexOfSlug(slug);
		withoutMember.splice(memberIndex, 1);

		return withoutMember.random();
	}

	toSerialized() {
		return JSON.stringify(this.map((v) => v.toSerialized()));
	}

	static fromSerialized(data: string) {
		const collection = JSON.parse(data);
		return new MemberCollection(
			...collection.map((v) => Member.fromSerialized(v)),
		);
	}
}
