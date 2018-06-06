
namespace Ui {
    export class Matrix extends Core.Object {
        a: number = 1;
        b: number = 0;
        c: number = 0;
        d: number = 1;
        e: number = 0;
        f: number = 0;

        // The matrix format is like that
        //
        // | a | c | e |
        // | b | d | f |
        // | 0 | 0 | 1 |
        //

        // @constructs
        // @class
        // @extends Core.Object
        constructor() {
            super();
        }

        isTranslateOnly(): boolean {
            return ((this.a === 1) && (this.b === 0) && (this.c === 0) && (this.d === 1));
        }

        isIdentity(): boolean {
            return ((this.a === 1) && (this.b === 0) && (this.c === 0) && (this.d === 1) && (this.e === 0) && (this.f === 0));
        }

        translate(x: number, y: number): Matrix {
            return this.multiply(Matrix.createTranslate(x, y));
        }

        rotate(angle: number): Matrix {
            return this.multiply(Matrix.createRotate(angle));
        }

        scale(scaleX: number, scaleY?: number): Matrix {
            if (scaleY === undefined)
                scaleY = scaleX;
            return this.multiply(Matrix.createScale(scaleX, scaleY));
        }

        multiply(matrix: Matrix): Matrix {
            let a = matrix.a * this.a + matrix.b * this.c;
            let c = matrix.c * this.a + matrix.d * this.c;
            let e = matrix.e * this.a + matrix.f * this.c + this.e;

            let b = matrix.a * this.b + matrix.b * this.d;
            let d = matrix.c * this.b + matrix.d * this.d;
            let f = matrix.e * this.b + matrix.f * this.d + this.f;

            return Matrix.createMatrix(a, b, c, d, e, f);
        }

        getDeterminant(): number {
            return ((this.a * this.d) - (this.b * this.c));
        }

        inverse(): Matrix {
            let determinant = this.getDeterminant();
            if (determinant === 0)
                throw ("Matrix not invertible");

            let invd = 1 / determinant;
            let ta = this.d * invd;
            let tb = -this.b * invd;
            let tc = -this.c * invd;
            let td = this.a * invd;
            let te = ((this.c * this.f) - (this.e * this.d)) * invd;
            let tf = ((this.e * this.b) - (this.a * this.f)) * invd;
            return Matrix.createMatrix(ta, tb, tc, td, te, tf);
        }

        setMatrix(a: number, b: number, c: number, d: number, e: number, f: number) {
            this.a = a; this.b = b;
            this.c = c; this.d = d;
            this.e = e; this.f = f;
        }

        getA(): number {
            return this.a;
        }

        getB(): number {
            return this.b;
        }

        getC(): number {
            return this.c;
        }

        getD(): number {
            return this.d;
        }

        getE(): number {
            return this.e;
        }

        getF(): number {
            return this.f;
        }

        clone(): Matrix {
            return Matrix.createMatrix(this.a, this.b, this.c, this.d, this.e, this.f);
        }

        toString(): string {
            return 'matrix(' + this.a.toFixed(4) + ',' + this.b.toFixed(4) + ',' + this.c.toFixed(4) + ',' + this.d.toFixed(4) + ',' + this.e.toFixed(4) + ',' + this.f.toFixed(4) + ')';
        }

        static createMatrix(a: number, b: number, c: number, d: number, e: number, f: number): Matrix {
            let matrix = new Matrix();
            matrix.setMatrix(a, b, c, d, e, f);
            return matrix;
        }

        static createTranslate(x: number, y: number): Matrix {
            return Matrix.createMatrix(1, 0, 0, 1, x, y);
        }

        static createScaleAt(scaleX: number, scaleY: number, centerX: number, centerY: number): Matrix {
            return Matrix.createMatrix(scaleX, 0, 0, scaleY, centerX - (scaleX * centerX), centerY - (scaleY * centerY));
        }

        static createScale(scaleX: number, scaleY?: number): Matrix {
            if (scaleY === undefined)
                scaleY = scaleX;
            return Matrix.createScaleAt(scaleX, scaleY, 0, 0);
        }

        static createRotateAt(angle: number, centerX: number, centerY: number): Matrix {
            // convert from degree to radian
            angle = (angle % 360) * Math.PI / 180;
            let sin = Math.sin(angle);
            let cos = Math.cos(angle);
            let offsetX = (centerX * (1.0 - cos)) + (centerY * sin);
            let offsetY = (centerY * (1.0 - cos)) - (centerX * sin);
            return Matrix.createMatrix(cos, sin, -sin, cos, offsetX, offsetY);
        }

        static createRotate(angle: number): Matrix {
            return Matrix.createRotateAt(angle, 0, 0);
        }

        static parse(stringMatrix: string): Matrix {
            let matrix;
            if (typeof (stringMatrix) === 'string') {
                // parse the matrix
                let res;
                if ((res = stringMatrix.match(/^matrix\((-?\d+\.?\d*),(-?\d+\.?\d*),(-?\d+\.?\d*),(-?\d+\.?\d*),(-?\d+\.?\d*),(-?\d+\.?\d*)\)$/)) != undefined) {
                    let a = parseFloat(res[1]);
                    let b = parseFloat(res[2]);
                    let c = parseFloat(res[3]);
                    let d = parseFloat(res[4]);
                    let e = parseFloat(res[5]);
                    let f = parseFloat(res[6]);
                    matrix = new Matrix();
                    matrix.setMatrix(a, b, c, d, e, f);
                }
            }
            if (matrix === undefined)
                throw ('Unknown matrix format (' + stringMatrix + ')');
            return matrix;
        }
    }
}
