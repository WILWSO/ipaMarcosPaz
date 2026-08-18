export interface VercelRequest {
	method?: string;
	url?: string;
	headers: Record<string, string | string[] | undefined>;
	query: Record<string, string | string[] | undefined>;
}

export interface VercelResponse {
	status(code: number): VercelResponse;
	setHeader(name: string, value: string | string[]): VercelResponse;
	getHeader(name: string): string | string[] | number | undefined;
	json(body: unknown): VercelResponse;
	end(body?: string): VercelResponse;
}

export function first(value: string | string[] | undefined): string | null {
	return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export function parseCookies(header: string | string[] | undefined): Record<string, string> {
	const value = Array.isArray(header) ? header.join(';') : header ?? '';
	return Object.fromEntries(
		value.split(';').flatMap((part) => {
			const separator = part.indexOf('=');
			if (separator < 0) return [];
			return [[part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1).trim())]];
		})
	);
}

export function cookie(name: string, value: string, options: string): string {
	return `${name}=${encodeURIComponent(value)}; ${options}`;
}
