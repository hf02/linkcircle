import type { Member } from "./members";

export let showDebug = false;

export function setShowDebug(value: boolean) {
	showDebug = value;
}

export function log(type: string, ...args: unknown[]) {
	let consoleType = console[type] ?? console.log;

	if (type === "debug" && !showDebug) return;

	consoleType(`[linkcircle]`, ...args);
}

export function printMembers(members: Member[]) {
	log(
		"debug",
		members.map((v) => `${v.slug} ${v.url}`),
	);
}

export function showErrorMessage(error: unknown, message: string) {
	alert(`${message}\n\n${location.href}\n${error}`);
}
