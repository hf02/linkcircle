export class ExtendableArray<T> extends Array<T> {
	declare ['constructor']: new (...args: T[]) => this;
}
