import { LinkcircleError } from "./lib/error";
import { setObscurePage } from "./lib/html";
import { log, showErrorMessage } from "./lib/log";
import { getOptions } from "./lib/options";
import { main } from "./main";

export default (async () => {
	const options = getOptions();
	try {
		await main(options);
	} catch (e) {
		if (!(e instanceof LinkcircleError && e.code === "slug-not-found")) {
			log("error", e);
			if (options.showErrorMessage) {
				showErrorMessage(e, options.internalErrorMessage);
			}
		}

		if (options.hidePage) setObscurePage(false);
	}
})();
