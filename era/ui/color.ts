namespace Ui {
    export class Color extends Core.Object {
        r: number = 0;
        g: number = 0;
        b: number = 0;
        a: number = 1;

        constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
            super();
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        addA(a: number): Color {
            return new Color(this.r, this.g, this.b, Math.max(0, Math.min(1, this.a + a)));
        }

        addY(y: number): Color {
            let yuva = this.getYuva();
            yuva.y += y;
            return Color.createFromYuv(yuva.y, yuva.u, yuva.v, yuva.a);
        }

        addH(h: number): Color {
            let hsla = this.getHsla();
            hsla.h += h;
            return Color.createFromHsl(hsla.h, hsla.s, hsla.l, hsla.a);
        }

        addS(s: number): Color {
            let hsla = this.getHsla();
            hsla.s += s;
            return Color.createFromHsl(hsla.h, hsla.s, hsla.l, hsla.a);
        }

        addL(l: number): Color {
            let hsla = this.getHsla();
            hsla.l += l;
            return Color.createFromHsl(hsla.h, hsla.s, hsla.l, hsla.a);
        }

        getCssRgba(): string {
            return 'rgba(' + Math.round(this.r * 255) + ',' + Math.round(this.g * 255) + ',' + Math.round(this.b * 255) + ',' + this.a + ')';
        }

        getCssRgb(): string {
            return 'rgb(' + Math.round(this.r * 255) + ',' + Math.round(this.g * 255) + ',' + Math.round(this.b * 255) + ')';
        }

        getCssHtml(alpha = false): string {
            let res = '#';
            let t = Math.round(this.r * 255).toString(16);
            if (t.length == 1)
                t = '0' + t;
            res += t;
            t = Math.round(this.g * 255).toString(16);
            if (t.length == 1)
                t = '0' + t;
            res += t;
            t = Math.round(this.b * 255).toString(16);
            if (t.length == 1)
                t = '0' + t;
            res += t;
            if (alpha) {
                t = Math.round(this.a * 255).toString(16);
                if (t.length == 1)
                    t = '0' + t;
                res += t;
            }
            return res;
        }

        getRgba() {
            return { r: this.r, g: this.g, b: this.b, a: this.a };
        }

        getRgb() {
            return this.getRgba();
        }

        getHsla() {
            let r = this.r;
            let g = this.g;
            let b = this.b;
            let min = Math.min(r, Math.min(g, b));
            let max = Math.max(r, Math.max(g, b));
            let delta = max - min;
            let h = 0;
            let s = 0;
            let l = 0;
            // hue
            if (delta == 0)
                h = 0;
            // red is max
            else if (max == r)
                h = ((g - b) / delta) % 6;
            // green is max
            else if (max == g)
                h = (b - r) / delta + 2;
            // blue is max
            else
                h = (r - g) / delta + 4;
            h = Math.round(h * 60);
            h = (h + 360) % 360;
            // lightness
            l = (max + min) / 2;
            // saturation
            s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
            return { h: h, s: s, l: l, a: this.a };
        }

        getHsl() {
            return this.getHsla();
        }

        getYuva() {
            let y = 0.299 * this.r + 0.587 * this.g + 0.114 * this.b;
            let u = 0.492 * (this.b - y);
            let v = 0.877 * (this.r - y);
            return { y: y, u: u, v: v, a: this.a };
        }

        getYuv() {
            return this.getYuva();
        }

        //
        // Private
        //
        private initFromHsl(h: number, s: number, l: number, a: number = 1) {
            this.a = Math.min(Math.max(a, 0), 1);
            if (s <= 0) {
                this.r = l; this.g = l; this.b = l;
                return;
            }

            let c = (1 - Math.abs(2 * l - 1)) * s;
            let x = c * (1 - Math.abs((h / 60) % 2 - 1));
            let m = l - c/2;
            let r = 0;
            let g = 0;
            let b = 0;

            if (0 <= h && h < 60) {
                r = c; g = x; b = 0;
            }
            else if (60 <= h && h < 120) {
                r = x; g = c; b = 0;
            }
            else if (120 <= h && h < 180) {
                r = 0; g = c; b = x;
            }
            else if (180 <= h && h < 240) {
                r = 0; g = x; b = c;
            }
            else if (240 <= h && h < 300) {
                r = x; g = 0; b = c;
            }
            else if (300 <= h && h <= 360) {
                r = c; g = 0; b = x;
            }
            this.r = r + m;
            this.g = g + m;
            this.b = b + m;

            if (isNaN(this.r))
                this.r = 0;
            if (isNaN(this.g))
                this.g = 0;
            if (isNaN(this.b))
                this.b = 0;
        }

        private initFromYuv(y: number, u: number, v: number, a: number = 1) {
            this.r = Math.max(0, Math.min(y + 1.13983 * v, 1));
            this.g = Math.max(0, Math.min(y - 0.39465 * u - 0.58060 * v, 1));
            this.b = Math.max(0, Math.min(y + 2.03211 * u, 1));
            this.a = Math.min(Math.max(a, 0), 1);
        }

        private initFromRgb(r: number, g: number, b: number, a: number = 1) {
            this.r = Math.min(Math.max(r, 0), 1);
            this.g = Math.min(Math.max(g, 0), 1);
            this.b = Math.min(Math.max(b, 0), 1);
            this.a = Math.min(Math.max(a, 0), 1);
        }

        toString(): string {
            return 'color(' + this.r.toFixed(4) + ', ' + this.g.toFixed(4) + ', ' + this.b.toFixed(4) + ', ' + this.a.toFixed(4) + ')';
        }

        static knownColor: object = {
            white: '#ffffff',
            black: '#000000',
            red: '#ff0000',
            green: '#008000',
            blue: '#0000ff',
            lightblue: '#add8e6',
            lightgreen: '#90ee90',
            orange: '#ffa500',
            purple: '#800080',
            lightgray: '#d3d3d3',
            darkgray: '#a9a9a9',
            pink: '#ffc0cb',
            brown: '#a52a2a'
        }

        static parse(color: string) {
            let r; let g; let b; let a;

            if (typeof (color) == 'string') {
                if (color in Color.knownColor)
                    color = Color.knownColor[color];
                // parse the color
                let res;
                if ((res = color.match(/^\s*rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+\.?\d*)\s*\)\s*$/)) != undefined) {
                    r = parseInt(res[1]) / 255;
                    g = parseInt(res[2]) / 255;
                    b = parseInt(res[3]) / 255;
                    a = parseFloat(res[4]);
                    return new Color(r, g, b, a);
                }
                else if ((res = color.match(/^\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/)) != undefined) {
                    r = parseInt(res[1]) / 255;
                    g = parseInt(res[2]) / 255;
                    b = parseInt(res[3]) / 255;
                    return new Color(r, g, b);
                }
                else if (color.indexOf('#') === 0) {
                    if (color.length == 4) {
                        r = parseInt(color.substr(1, 1), 16) / 15;
                        g = parseInt(color.substr(2, 1), 16) / 15;
                        b = parseInt(color.substr(3, 1), 16) / 15;
                        return new Color(r, g, b);
                    }
                    else if (color.length == 5) {
                        r = parseInt(color.substr(1, 1), 16) / 15;
                        g = parseInt(color.substr(2, 1), 16) / 15;
                        b = parseInt(color.substr(3, 1), 16) / 15;
                        a = parseInt(color.substr(4, 1), 16) / 15;
                        return new Color(r, g, b, a);
                    }
                    else if (color.length == 7) {
                        r = parseInt(color.substr(1, 2), 16) / 255;
                        g = parseInt(color.substr(3, 2), 16) / 255;
                        b = parseInt(color.substr(5, 2), 16) / 255;
                        return new Color(r, g, b);
                    }
                    else if (color.length == 9) {
                        r = parseInt(color.substr(1, 2), 16) / 255;
                        g = parseInt(color.substr(3, 2), 16) / 255;
                        b = parseInt(color.substr(5, 2), 16) / 255;
                        a = parseInt(color.substr(7, 2), 16) / 255;
                        return new Color(r, g, b, a);
                    }
                }
            }
            throw ('Unknown color format (' + color + ')');
        }

        static create(color: string | Color): Color {
            if (color instanceof Color)
                return color;
            else
                return Color.parse(color);
        }

        static createFromRgb(r: number, g: number, b: number, a: number = 1): Color {
            let color = new Color();
            color.initFromRgb(r, g, b, a);
            return color;
        }

        static createFromYuv(y: number, u: number, v: number, a: number = 1): Color {
            let color = new Color();
            color.initFromYuv(y, u, v, a);
            return color;
        }

        static createFromHsl(h: number, s: number, l: number, a: number = 1): Color {
            let color = new Color();
            color.initFromHsl(h, s, l, a);
            return color;
        }
    }
}


