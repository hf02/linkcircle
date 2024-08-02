export function kebabCaseToCamelCase(kebab: string) {
	let shouldCapitalize = false;
	let camel = "";
	for (let i = 0; i < kebab.length; i++) {
		const element = kebab[i];
		if (element === "-") {
			shouldCapitalize = true;
			continue;
		}

		if (shouldCapitalize) {
			camel += element.toUpperCase();
			shouldCapitalize = false;
		} else {
			camel += element;
		}
	}

	return camel;
}
