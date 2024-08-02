export class LinkcircleError extends Error {
	name = "LinkcircleError";
	constructor(
		public code: string,
		public message: string,
		public cause?: unknown,
	) {
		super();
	}
}
