import { LinkcircleError } from "./lib/error";
import { setObscurePage, waitForElements, waitForLoad } from "./lib/html";
import { log, printMembers, setShowDebug, showErrorMessage } from "./lib/log";
import { getMembers, Member, MemberHtmlOptions } from "./lib/members";
import { defaultOptions, getOptions } from "./lib/options";
import {
	ActionFromUrlOptions,
	couldUrlTakeAction,
	getClickedMemberFromUrl,
	UrlAction,
} from "./lib/redirect";

async function executeCurrentUrl(options: typeof defaultOptions) {
	const url = new URL(location.toString());

	// check to see if we could take an action

	const actionFromUrlOptions: ActionFromUrlOptions = {
		explicitKey: options.explicitUrlKey,
		useImplicit: options.useImplicitUrl,
		urlActionMap: {
			[UrlAction.Next]: options.nextName,
			[UrlAction.Previous]: options.previousName,
			[UrlAction.Random]: options.randomName,
		},
	};

	const couldTakeAction = couldUrlTakeAction(url, actionFromUrlOptions);

	// hide the contents of the page if it looks like we're gonna redirect

	if (couldTakeAction && options.hidePage) {
		setObscurePage(true);
	}

	// get the members from the page

	const memberHtmlOptions: MemberHtmlOptions = {
		hrefAttributeName: options.hrefAttributeName,
		memberSelector: options.memberSelector,
		slugAttributeName: options.slugAttributeName,
	};

	const members = await getMembers(
		options.cacheLifespan,
		options.storagePrefix,
		memberHtmlOptions,
	);

	printMembers(members);

	// get the member the user clicked on

	const clickedMember = getClickedMemberFromUrl(
		url,
		members,
		actionFromUrlOptions,
	);

	// redirect if we should

	if (clickedMember) {
		log("debug", "redirecting to", clickedMember.url.href);
		if (!options.dryRun) {
			location.replace(clickedMember.url);
		}

		return true;
	}

	return false;
}

export async function main(options: typeof defaultOptions) {
	setShowDebug(options.showDebug);
	log("debug", "main() called");

	let redirected = false;
	let error = null;

	// try to redirect using the normal options
	try {
		redirected = await executeCurrentUrl(options);
	} catch (e) {
		if (!(e instanceof LinkcircleError && e.code === "slug-not-found")) {
			// handle but don't stop execution.
			// we'll try to recover by not using the cache.
			log("error", e);

			if (options.showErrorMessage) {
				showErrorMessage(e, options.internalErrorMessage);
			}

			error = e;
		} else {
			// disregard the error, we just didn't find the member in there. it's likely that the cache
			// wasn't updated, which we will deal with later on
			log("debug", "member not found");
		}
	}

	if (!redirected) {
		// we didn't redirect, so try again without a cache
		log("debug", "re-running without cache");

		await executeCurrentUrl({ ...options, cacheLifespan: 0 });
	}

	if (error) throw error;
}
