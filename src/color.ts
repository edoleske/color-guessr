export class Color {
	readonly name: string;
	readonly hex: string;

	// RGB numbers
	readonly r: number;
	readonly g: number;
	readonly b: number;

	constructor(name: string, hex: string) {
		this.name = name;
		this.hex = hex;

		const [r, g, b] = Color.extractRGBFromHex(this.hex);
		this.r = r;
		this.g = g;
		this.b = b;
	}

	weightedDistance(otherHex: string) {
		const [r, g, b] = Color.extractRGBFromHex(otherHex);
		const dr = (this.r - r) ** 2;
		const dg = (this.g - g) ** 2;
		const db = (this.b - b) ** 2;
		return 0.3 * dr + 0.59 * dg + 0.11 * db;
	}

	private static extractRGBFromHex(hex: string): [number, number, number] {
		const components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (!components) throw new Error(`Invalid hex color ${hex}`);

		return [
			Number.parseInt(components[1], 16),
			Number.parseInt(components[2], 16),
			Number.parseInt(components[3], 16),
		];
	}
}
