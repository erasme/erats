
namespace Ui
{
	export class Point extends Core.Object
	{
		x: number = 0;
		y: number = 0;

		//
		// @constructs
		// @class
		// @extends Core.Object
		//
		constructor(x: number = 0, y: number = 0) {
			super();
			this.x = x;
			this.y = y;
		}

		matrixTransform(matrix: Matrix): Point {
			let x = this.x * matrix.a + this.y * matrix.c + matrix.e;
			let y = this.x * matrix.b + this.y * matrix.d + matrix.f;
			this.x = x;
			this.y = y;
			return this;
		}

		multiply(value: number | Matrix): Point {
			let res;
			if (typeof (value) === 'number')
				res = new Ui.Point(this.x * value, this.y * value);
			else if (value instanceof Matrix)
				res = new Ui.Point(
					this.x * value.a + this.y * value.c + value.e,
					this.x * value.b + this.y * value.d + value.f
				);
			else
				res = this;
			return res;
		}

		divide(value: number | Matrix): Point {
			let res;
			if (typeof (value) === 'number')
				res = new Ui.Point(this.x / value, this.y / value);
			else if (value instanceof Matrix) {
				value = value.inverse();
				res = new Ui.Point(
					this.x * value.a + this.y * value.c + value.e,
					this.x * value.b + this.y * value.d + value.f
				);
			}
			else
				res = this;
			return res;
		}

		add(value: number | Point): Point {
			let res;
			if (typeof (value) === 'number')
				res = new Point(this.x + value, this.y + value);
			else if (value instanceof Point)
				res = new Point(this.x + value.x, this.y + value.y);
			else
				res = this;
			return res;
		}

		substract(value: number | Point): Point {
			let res;
			if (typeof (value) === 'number')
				res = new Point(this.x - value, this.y - value);
			else if (value instanceof Point)
				res = new Point(this.x - value.x, this.y - value.y);
			else
				res = this;
			return res;
		}

		setPoint(point) {
			this.x = point.x;
			this.y = point.y;
		}

		getX(): number {
			return this.x;
		}

		setX(x: number) {
			this.x = x;
		}

		getY(): number {
			return this.y;
		}

		setY(y: number) {
			this.y = y;
		}

		getLength(): number {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}

		clone(): Point {
			return new Point(this.x, this.y);
		}

		toString(): string {
			return 'point(' + this.x.toFixed(4) + ', ' + this.y.toFixed(4) + ')';
		}
	}	
}

