export function checkUrl(url: string): void {
	if (url.includes('http://') || url.includes('https://')) throw new Error(`Url ${url} should look like this: ${url.split('//')[1]}`);
}
