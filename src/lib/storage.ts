export function setStorage(value: any, key) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key: string) {
	return JSON.parse(localStorage.getItem(key));
}
