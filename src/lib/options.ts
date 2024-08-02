import { getScriptElement } from "./html";
import { log } from "./log";
import { kebabCaseToCamelCase } from "./string";

export const defaultOptions = {
	cacheLifespan: 1800 * 1000, // 30min
	storagePrefix: "linkcircle",
	hidePage: true,
	showDebug: false,
	dryRun: false,
	showErrorMessage: true,
	useImplicitUrl: true,
	explicitUrlKey: "lc",
	slugAttributeName: "data-slug",
	hrefAttributeName: "href",
	memberSelector: "[href][data-slug]",
	memberNotFoundMessage:
		"Couldn't find a webring member. This could be an issue with the webring or a member's widget.",
	internalErrorMessage: "Internal Linkcircle error!",
	nextName: "next",
	previousName: "previous",
	randomName: "random",
};

export function getOptions() {
	const element = getScriptElement();

	const options = { ...defaultOptions };

	const attributes = element.attributes;

	for (const attribute of attributes) {
		const { name: attributeName, value } = attribute;

		if (!attributeName.startsWith("data-")) continue;
		const name = attributeName.slice(5);

		const camelCaseName = kebabCaseToCamelCase(name);

		if (!(camelCaseName in options)) {
			log("warn", `unknown option`, attribute);
			continue;
		}

		try {
			options[camelCaseName] = JSON.parse(value);
		} catch (e) {
			log("error", "failed to parse option", attribute, e);
		}
	}

	return options;
}
