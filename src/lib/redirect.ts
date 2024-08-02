import { LinkcircleError } from "./error";
import { log } from "./log";
import { Member, MemberCollection } from "./members";

export enum UrlAction {
	Next,
	Previous,
	Random,
}

export type UrlActionMap = Record<UrlAction, string>;

function actionStringToEnum(
	action: string,
	map: UrlActionMap,
): UrlAction | null {
	switch (action) {
		case map[UrlAction.Next]:
			return UrlAction.Next;
		case map[UrlAction.Previous]:
			return UrlAction.Previous;
		case map[UrlAction.Random]:
			return UrlAction.Random;
		default:
			return null;
	}
}

function getActionFromImplicit(shorthand: string, map: UrlActionMap) {
	const regexMatch = /^(.*)-(.*)$/.exec(shorthand);

	if (regexMatch == null) return null;

	const [, slug, actionString] = regexMatch;

	const action = actionStringToEnum(actionString, map);

	if (action == null) return;

	return [action, slug] as const;
}

function getActionFromImplicitUrl(url: URL, map: UrlActionMap) {
	const parameters = [...url.searchParams.entries()];

	for (let i = 0; i < parameters.length; i++) {
		const element = parameters[i];
		if (element[1]) continue;
		const action = getActionFromImplicit(element[0], map);
		if (action) return action;
	}
	return null;
}

export interface ActionFromUrlOptions {
	explicitKey: string;
	useImplicit: boolean;
	urlActionMap: UrlActionMap;
}

function getActionFromUrl(url: URL, options: ActionFromUrlOptions) {
	const implicit = getActionFromImplicitUrl(url, options.urlActionMap);
	const explicit = getActionFromExplicitUrl(
		url,
		options.explicitKey,
		options.urlActionMap,
	);

	if (options.useImplicit) {
		return implicit ?? explicit;
	} else {
		return explicit;
	}
}

export function couldUrlTakeAction(url: URL, options: ActionFromUrlOptions) {
	return getActionFromUrl(url, options) != null;
}

function getActionFromExplicitUrl(url: URL, key = "lc", map: UrlActionMap) {
	const parameter = url.searchParams.get(key);
	if (!parameter) return null;
	return getActionFromImplicit(parameter, map);
}

export function getClickedMemberFromUrl(
	url: URL,
	members: MemberCollection,
	options: ActionFromUrlOptions,
) {
	const action = getActionFromUrl(url, options);

	if (!action) return null;

	let [actionType, slug] = action;

	let member: Member;

	switch (actionType) {
		case UrlAction.Next:
			member = members.offsetFrom(slug, 1);
			break;
		case UrlAction.Previous:
			member = members.offsetFrom(slug, -1);
			break;
		case UrlAction.Random:
			member = members.randomFromMember(slug);
			break;
	}

	if (member == null) {
		throw new LinkcircleError(
			"slug-not-found",
			`No member exists with the slug "${slug}". Make sure the spelling and capitalization matches.`,
		);
	}

	return member;
}
