/**
 * exclusive
 */
export function randInt(min: number, max: number) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max) - 1;
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}
