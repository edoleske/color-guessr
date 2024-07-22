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

	distanceCIELAB(otherHex: string) {
		const [l0, a0, b0] = Color.extractCIELAB(this.r, this.g, this.b);

		const [r, g, b] = Color.extractRGBFromHex(otherHex);
		const [l1, a1, b1] = Color.extractCIELAB(r, g, b);

		const dl = (l0 - l1) ** 2;
		const da = (a0 - a1) ** 2;
		const db = (b0 - b1) ** 2;
		return Math.sqrt(dl + da + db);
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

	private static extractCIELAB(
		r: number,
		g: number,
		b: number,
	): [number, number, number] {
		// RGB to CIEXYZ
		const linearize = (v: number) =>
			v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
		const [lr, lg, lb] = [linearize(r), linearize(g), linearize(b)];

		const x = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
		const y = 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb;
		const z = 0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb;

		// CIEXYZ to CIELAB
		// Adapted from https://en.wikipedia.org/wiki/CIELAB_color_space
		const f = (t: number) =>
			t > 0.008856451679035631
				? Math.cbrt(t)
				: 7.787037037037037 * t + 0.13793103448275862;

		const fx = f(x / 95.0489);
		const fy = f(y / 100);
		const fz = f(z / 108.884);

		// L*, a*, b*
		return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
	}
}
