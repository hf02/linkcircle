export function queryDocument(query: string) {
	return document.querySelector(query);
}

export function queryMultipleDocument(query: string) {
	return [...document.querySelectorAll(query)].filter(
		(v) => v instanceof HTMLElement,
	);
}

export function waitForElements(
	query: string,
	timeout = Infinity,
): Promise<HTMLElement[]> {
	return new Promise((resolve) => {
		const firstFound = queryMultipleDocument(query);

		if (firstFound.length !== 0) {
			resolve(firstFound);
			return;
		}

		const observer = new MutationObserver((mutations) => {
			const elements = queryMultipleDocument(query);
			if (elements.length !== 0) {
				resolve(elements);
				observer.disconnect();
			}
		});

		observer.observe(document, {
			childList: true,
			subtree: true,
		});

		if (timeout !== Infinity) {
			setTimeout(() => {
				resolve([]);
				observer.disconnect();
			}, timeout);
		}
	});
}

export function waitForLoad() {
	if (document.readyState === "complete") {
		return Promise.resolve();
	}

	return new Promise<void>((resolve) => {
		window.addEventListener("load", () => {
			resolve();
		});
	});
}

export async function setObscurePage(shouldObscure = true) {
	const html = await waitForElements("html");

	for (let i = 0; i < html.length; i++) {
		const element = html[i];
		element.style.display = shouldObscure ? "none" : null;
	}
}

export function getScriptElement(): HTMLScriptElement {
	return document.currentScript as HTMLScriptElement;
}
