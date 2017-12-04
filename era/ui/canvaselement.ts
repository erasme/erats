namespace Ui
{
	export interface CanvasElementInit extends ContainerInit {
	}

	export class CanvasElement extends Container implements CanvasElementInit
	{
		private canvasEngine: any = 'svg';
		private _context: any = undefined;
		private svgDrawing: any = undefined;
		private dpiRatio: number = 1;

		constructor(init?: Partial<ContainerInit>) {
			super();
			this.selectable = false;
			if (init)
				this.assign(init);
		}

		//
		// Call this method when the canvas need to be redraw
		//
		update() {
			if (this.canvasEngine === 'canvas') {
				this._context.clearRect(0, 0, Math.ceil(this.layoutWidth * this.dpiRatio), Math.ceil(this.layoutHeight * this.dpiRatio));
				this._context.save();
				if (this.dpiRatio !== 1)
					this._context.scale(this.dpiRatio, this.dpiRatio);
				this.updateCanvas(this._context);
				this._context.restore();
			}
			else {
				if (this.svgDrawing !== undefined)
					this.drawing.removeChild(this.svgDrawing);
				let svgDrawing:any = document.createElementNS(svgNS, 'svg');
				svgDrawing.style.position = 'absolute';
				svgDrawing.style.top = '0px';
				svgDrawing.style.left = '0px';
				svgDrawing.style.width = this.layoutWidth + 'px';
				svgDrawing.style.height = this.layoutHeight + 'px';
				svgDrawing.setAttribute('focusable', 'false');
				svgDrawing.setAttribute('draggable', 'false');
				// very important, SVG elements cant take pointers events
				// because touch* events are captured by the initial element they
				// are raised over. If this element is remove from the DOM (like canvas redraw)
				// the following events (like touchmove, touchend) will never raised
				svgDrawing.setAttribute('pointer-events', 'none');
				let ctx = new Core.SVG2DContext(svgDrawing);
				this.updateCanvas(ctx);
				this.svgDrawing = svgDrawing;
				this.svgDrawing.appendChild(ctx.getSVG());
				this.drawing.appendChild(this.svgDrawing);
			}
		}

		//
		// Get the canvas context
		//
		get context() {
			return this._context;
		}

		//
		// Override this method to provide the Canvas rendering
		//
		protected updateCanvas(context) {
		}

		protected renderDrawing() {
			// verify compatibility with the browser
			if ((this.canvasEngine === 'canvas') && !Core.Navigator.supportCanvas)
				this.canvasEngine = 'svg';
			if ((this.canvasEngine === 'svg') && !Core.Navigator.supportSVG)
				this.canvasEngine = 'canvas';
		
			let drawing; let resourceDrawing;
			if (this.canvasEngine === 'canvas') {
				drawing = document.createElement('canvas');
				this._context = drawing.getContext('2d');
			}
			else {
				drawing = document.createElement('div');
				resourceDrawing = document.createElement('div');
				resourceDrawing.style.width = '0px';
				resourceDrawing.style.height = '0px';
				resourceDrawing.style.visibility = 'hidden';

				drawing.appendChild(resourceDrawing);
				this.containerDrawing = resourceDrawing;
				if (Core.Navigator.supportCanvas)
					drawing.toDataURL = this.svgToDataURL.bind(this);
			}
			return drawing;
		}

		svgToDataURL() {
			let drawing = document.createElement('canvas');
			let context = drawing.getContext('2d');
			drawing.setAttribute('width', Math.ceil(this.layoutWidth).toString());
			drawing.setAttribute('height', Math.ceil(this.layoutHeight).toString());
			this.updateCanvas(context);
			return drawing.toDataURL.apply(drawing, arguments);
		}

		protected arrangeCore(width: number, height: number) {
			// handle High DPI
			let devicePixelRatio = window.devicePixelRatio || 1;
			let backingStoreRatio = 1;
			if (this._context !== undefined) {
				backingStoreRatio = this._context.webkitBackingStorePixelRatio ||
					this._context.mozBackingStorePixelRatio ||
					this._context.msBackingStorePixelRatio ||
					this._context.oBackingStorePixelRatio ||
					this._context.backingStorePixelRatio || 1;
			}
			this.dpiRatio = devicePixelRatio / backingStoreRatio;
			this.drawing.setAttribute('width', Math.ceil(width * this.dpiRatio), null);
			this.drawing.setAttribute('height', Math.ceil(height * this.dpiRatio), null);

			if (this.isVisible && this.isLoaded)
				this.update();
		}

		protected drawCore() {
			// update only if the layout was done
			if ((this.layoutWidth !== 0) && (this.layoutHeight !== 0))
				this.update();
		}
	
		protected onInternalVisible() {
			super.onInternalVisible();
			this.invalidateDraw();
		}
	}
}

namespace Core {
	export class SVG2DPath extends Object {
		d: any = undefined;
		x: number = 0;
		y: number = 0;

		constructor() {
			super();
			this.d = '';
		}

		moveTo(x: number, y: number) {
			this.d += ' M ' + x + ' ' + y;
			this.x = x; this.y = y;
		}

		lineTo(x: number, y: number) {
			this.d += ' L ' + x + ' ' + y;
			this.x = x; this.y = y;
		}

		quadraticCurveTo(cpx, cpy, x, y) {
			this.d += ' Q ' + cpx + ' ' + cpy + ' ' + x + ' ' + y;
			this.x = x; this.y = y;
		}

		bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
			this.d += ' C ' + cp1x + ' ' + cp1y + ' ' + cp2x + ' ' + cp2y + ' ' + x + ' ' + y;
			this.x = x; this.y = y;
		}

		arcTo(x1, y1, x2, y2, radiusX, radiusY, angle) {
			let vx1 = this.x - x1;
			let vy1 = this.y - y1;
			let vx2 = x2 - x1;
			let vy2 = y2 - y1;
			let p = vx1 * vy2 - vy1 * vx2;
			if (angle === undefined) {
				angle = radiusY;
				radiusY = radiusX;
			}
			// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
			this.d += ' A ' + radiusX + ' ' + radiusY + ' ' + (angle * Math.PI / 180) + ' 0 ' + ((p < 0) ? 1 : 0) + ' ' + x2 + ' ' + y2;
			this.x = x2; this.y = y2;
		}
	
		closePath() {
			this.d += ' Z';
		}

		rect(x, y, w, h) {
			this.moveTo(x, y);
			this.lineTo(x + w, y);
			this.lineTo(x + w, y + h);
			this.lineTo(x, y + h);
		}

		arc(x, y, radius, startAngle, endAngle, anticlockwise) {
			this.ellipse(x, y, radius, radius, 0, startAngle, endAngle, anticlockwise);
		}

		ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
			// special case, full ellipse
			if ((rotation === 0) && (startAngle === 0) && (endAngle === Math.PI * 2)) {
				this.moveTo(x, y + radiusY);
				this.arcTo(x + radiusX, y + radiusY, x + radiusX, y, radiusX, radiusY, Math.PI / 2);
				this.arcTo(x + radiusX, y - radiusY, x, y - radiusY, radiusX, radiusY, Math.PI / 2);
				this.arcTo(x - radiusX, y - radiusY, x - radiusX, y, radiusX, radiusY, Math.PI / 2);
				this.arcTo(x - radiusX, y + radiusY, x, y + radiusY, radiusX, radiusY, Math.PI / 2);
			}
			else {
				let startX = x + Math.cos(startAngle) * radiusX;
				let startY = y + Math.sin(startAngle) * radiusY;
				let endX = x + Math.cos(endAngle) * radiusX;
				let endY = y + Math.sin(endAngle) * radiusY;

				this.moveTo(startX, startY);
				let largeArc = (((endAngle - startAngle) + Math.PI * 2) % (Math.PI * 2)) > Math.PI;
				if (anticlockwise)
					largeArc = !largeArc;

				// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
				this.d += ' A ' + radiusX + ' ' + radiusY + ' ' + ((endAngle - startAngle) * Math.PI / 180) + ' ' + (largeArc ? 1 : 0) + ' ' + (!anticlockwise ? 1 : 0) + ' ' + endX + ' ' + endY;
				this.x = endX; this.y = endY;
			}
		}
	
		roundRect(x, y, w, h, radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft, antiClockwise) {
			if (antiClockwise === true) {
				this.moveTo(x + radiusTopLeft, y);
				if (radiusTopLeft > 0)
					this.arcTo(x, y, x, y + radiusTopLeft, radiusTopLeft, radiusTopLeft, Math.PI / 4);
				this.lineTo(x, y + h - radiusBottomLeft);
				if (radiusBottomLeft > 0)
					this.arcTo(x, y + h, x + radiusBottomLeft, y + h, radiusBottomLeft, radiusBottomLeft, Math.PI / 4);
				this.lineTo(x + w - radiusBottomRight, y + h);
				if (radiusBottomRight > 0)
					this.arcTo(x + w, y + h, x + w, y + h - radiusBottomRight, radiusBottomRight, radiusBottomRight, Math.PI / 4);
				this.lineTo(x + w, y + radiusTopRight);
				if (radiusTopRight > 0)
					this.arcTo(x + w, y, x + w - radiusTopRight, y, radiusTopRight, radiusTopRight, Math.PI / 4);
			}
			else {
				this.moveTo(x, y + radiusTopLeft);
				if (radiusTopLeft > 0)
					this.arcTo(x, y, x + radiusTopLeft, y, radiusTopLeft, radiusTopLeft, Math.PI / 4);
				this.lineTo(x + w - radiusTopRight, y);
				if (radiusTopRight > 0)
					this.arcTo(x + w, y, x + w, y + radiusTopRight, radiusTopRight, radiusTopRight, Math.PI / 4);
				this.lineTo(x + w, y + h - radiusBottomRight);
				if (radiusBottomRight > 0)
					this.arcTo(x + w, y + h, x + w - radiusBottomRight, y + h, radiusBottomRight, radiusBottomRight, Math.PI / 4);
				this.lineTo(x + radiusBottomLeft, y + h);
				if (radiusBottomLeft > 0)
					this.arcTo(x, y + h, x, y + h - radiusBottomLeft, radiusBottomLeft, radiusBottomLeft, Math.PI / 4);
			}
		}

		getSVG() {
			let path = document.createElementNS(svgNS, 'path');
			path.setAttribute('d', this.d);
			return path;
		}
	}

	export class SVGGradient extends Object {

		static counter: number = 0;
		gradient: any = undefined;
		id: any = undefined;

		constructor(x0: number, y0: number, x1: number, y1: number) {
			super();
			this.gradient = document.createElementNS(svgNS, 'linearGradient');
			this.gradient.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');
			this.gradient.setAttributeNS(null, 'x1', x0);
			this.gradient.setAttributeNS(null, 'y1', y0);
			this.gradient.setAttributeNS(null, 'x2', x1);
			this.gradient.setAttributeNS(null, 'y2', y1);

			this.id = '_grad' + (++Core.SVGGradient.counter);
			this.gradient.setAttributeNS(null, 'id', this.id);
		}

		getId() {
			return this.id;
		}

		addColorStop(offset, color) {
			let svgStop:any = document.createElementNS(svgNS, 'stop');
			svgStop.setAttributeNS(null, 'offset', offset);
			svgStop.style.stopColor = color;
			color = Ui.Color.create(color);
			svgStop.style.stopOpacity = color.getRgba().a;
			this.gradient.appendChild(svgStop);
		}

		getSVG() {
			return this.gradient;
		}
	}
	
	export class SVG2DContext extends Object {
		fillStyle: any = 'black';
		strokeStyle: any = 'black';
		lineWidth: number = 1;
		lineDash: any = undefined;
		globalAlpha: number = 1;
		currentTransform: any = undefined;
		font: any = 'default 10px sans-serif';
		textAlign: any = 'start';
		textBaseline: any = 'alphabetic';
		direction: any = 'inherit';
		clipId: any = undefined;
	
		document: any = undefined;
		currentPath: any = undefined;
		g: any = undefined;
		defs: any = undefined;
		states: any = undefined;

		constructor(svgElement: SVGSVGElement) {
			super();
			this.document = svgElement;
			this.g = document.createElementNS(svgNS, 'g');
			this.currentTransform = this.document.createSVGMatrix();
			this.states = [];
			this.lineDash = [];

			this.defs = document.createElementNS(svgNS, 'defs');
			this.g.appendChild(this.defs);
		}

		beginPath() {
			this.currentPath = new Core.SVG2DPath();
		}

		moveTo(x: number, y: number) {
			this.currentPath.moveTo(x, y);
		}

		lineTo(x: number, y: number) {
			this.currentPath.lineTo(x, y);
		}

		quadraticCurveTo(cpx, cpy, x, y) {
			this.currentPath.quadraticCurveTo(cpx, cpy, x, y);
		}

		bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
			this.currentPath.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		}

		rect(x: number, y: number, w: number, h: number) {
			this.currentPath.rect(x, y, w, h);
		}

		arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean) {
			this.currentPath.arc(x, y, radius, startAngle, endAngle, anticlockwise);
		}

		ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean) {
			this.currentPath.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
		}

		roundRect(x: number, y: number, w: number, h: number, radiusTopLeft: number, radiusTopRight: number, radiusBottomRight: number, radiusBottomLeft: number, antiClockwise: boolean = false) {
			this.currentPath.roundRect(x, y, w, h, radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft, antiClockwise);
		}

		closePath() {
			this.currentPath.closePath();
		}

		fill() {
			let svg = this.currentPath.getSVG();
			if (this.fillStyle instanceof Core.SVGGradient) {
				let id = this.fillStyle.getId();
				this.defs.appendChild(this.fillStyle.getSVG());
				svg.style.fill = 'url(#' + id + ')';
			}
			else
				svg.style.fill = this.fillStyle;
			if (this.clipId !== undefined)
				svg.setAttributeNS(null, 'clip-path', 'url(#' + this.clipId + ')');
			svg.style.opacity = this.globalAlpha;
			svg.transform.baseVal.initialize(this.document.createSVGTransformFromMatrix(this.currentTransform));
			this.g.appendChild(svg);
		}

		stroke() {
			let svg = this.currentPath.getSVG();
			svg.style.stroke = this.strokeStyle;
			svg.style.fill = 'none';
			svg.style.opacity = this.globalAlpha;
			svg.style.strokeWidth = this.lineWidth;
			if (this.clipId !== undefined)
				svg.setAttributeNS(null, 'clip-path', 'url(#' + this.clipId + ')');
			if (this.lineDash.length !== 0)
				svg.setAttributeNS(null, 'stroke-dasharray', this.lineDash.join(','));
			svg.setAttributeNS(null, 'pointer-events', 'none');
			svg.transform.baseVal.initialize(this.document.createSVGTransformFromMatrix(this.currentTransform));
			this.g.appendChild(svg);
		}

		clip() {
			let clip = document.createElementNS(svgNS, 'clipPath');
			this.clipId = '_clip' + (++Core.SVG2DContext.counter);
			clip.setAttributeNS(null, 'id', this.clipId);
			clip.appendChild(this.currentPath.getSVG());
			this.defs.appendChild(clip);
		}

		resetClip() {
			this.clipId = undefined;
		}

		getLineDash() {
			return this.lineDash;
		}

		setLineDash(lineDash) {
			this.lineDash = lineDash;
		}

		// drawing images
		drawImage(image, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
			let img;
			let nw = image.naturalWidth;
			let nh = image.naturalHeight;
		
			if (sw === undefined) {
				dx = sx; dy = sy;
				sx = 0; sy = 0;
				sw = nw; sh = nh;
				dw = nw; dh = nh;
			}
			else if (dx === undefined) {
				dx = sx; dy = sy;
				dw = sw; dh = sh;
				sx = 0; sy = 0;
				sw = nw; sh = nh;
			}
		
			if ((sx === 0) && (sy === 0) && (sw === nw) && (sh == nh)) {
				img = document.createElementNS(svgNS, 'image');
				if (this.clipId !== undefined)
					img.setAttributeNS(null, 'clip-path', 'url(#' + this.clipId + ')');
				img.style.opacity = this.globalAlpha;
				// very important, SVG elements cant take pointers events
				// because touch* events are captured by the initial element they
				// are raised over. If this element is remove from the DOM (like canvas redraw)
				// the following events (like touchmove, touchend) will never raised
				img.setAttributeNS(null, 'pointer-events', 'none');
				img.href.baseVal = image.src;
				img.setAttributeNS(null, 'x', dx);
				img.setAttributeNS(null, 'y', dy);
				img.setAttributeNS(null, 'width', dw);
				img.setAttributeNS(null, 'height', dh);
				img.transform.baseVal.initialize(this.document.createSVGTransformFromMatrix(this.currentTransform));
				this.g.appendChild(img);
			}
			else {
				let pattern = document.createElementNS(svgNS, 'pattern');
				let id = '_pat' + (++Core.SVG2DContext.counter);
				pattern.setAttributeNS(null, 'id', id);
				pattern.setAttributeNS(null, 'patternUnits', 'userSpaceOnUse');
				pattern.setAttributeNS(null, 'x', dx.toString());
				pattern.setAttributeNS(null, 'y', dy.toString());
				pattern.setAttributeNS(null, 'width', dw.toString());
				pattern.setAttributeNS(null, 'height', dh.toString());

				img = document.createElementNS(svgNS, 'image');
				img.href.baseVal = image.src;
				img.setAttributeNS(null, 'x', -sx * dw / sw);
				img.setAttributeNS(null, 'y', -sy * dh / sh);
				img.setAttributeNS(null, 'width', nw * dw / sw);
				img.setAttributeNS(null, 'height', nh * dh / sh);
				pattern.appendChild(img);
				this.defs.appendChild(pattern);

				let path:any = document.createElementNS(svgNS, 'path');
				path.setAttributeNS(null, 'pointer-events', 'none');
				path.setAttributeNS(null, 'd', 'M ' + dx + ' ' + dy + ' L ' + (dx + dw) + ' ' + dy + ' L ' + (dx + dw) + ' ' + (dy + dh) + ' L ' + dx + ' ' + (dy + dh) + ' Z');
				path.style.fill = 'url(#' + id + ')';
				if (this.clipId !== undefined)
					path.setAttributeNS(null, 'clip-path', 'url(#' + this.clipId + ')');
				path.style.opacity = this.globalAlpha;
				path.transform.baseVal.initialize(this.document.createSVGTransformFromMatrix(this.currentTransform));
				this.g.appendChild(path);
			}
		}

		fillText(text: string, x: number, y: number, maxWidth: number) {
			let t:any = document.createElementNS(svgNS, 'text');
			let textNode = document.createTextNode(text);
			t.appendChild(textNode);

			t.style.fill = this.fillStyle;
			t.style.opacity = this.globalAlpha;
			t.setAttributeNS(null, 'pointer-events', 'none');
			t.transform.baseVal.initialize(this.document.createSVGTransformFromMatrix(this.currentTransform));
			if (this.textAlign == 'center')
				t.style.textAnchor = 'middle';
			else if (this.textAlign == 'end')
				t.style.textAnchor = 'end';
			else if (this.textAlign == 'right')
				t.style.textAnchor = 'end';
		
			let font = this.parseFont(this.font);
			t.style.fontFamily = font.family;
			t.style.fontWeight = font.weight;
			t.style.fontSize = font.size;
			t.style.fontStyle = font.style;

			if (!Core.Navigator.isWebkit) {
				let fontSize = font.size;
				if (this.textBaseline === 'top')
					y += fontSize * 0.8;
				else if (this.textBaseline === 'hanging')
					y += fontSize * 0.8;
				else if (this.textBaseline === 'middle')
					y += (fontSize * 0.8) / 2;
				else if (this.textBaseline === 'bottom')
					y += fontSize * -0.2;
			}
			else {
				if (this.textBaseline === 'top')
					t.style.alignmentBaseline = 'text-before-edge';
				else if (this.textBaseline === 'hanging')
					t.style.alignmentBaseline = 'text-before-edge';
				else if (this.textBaseline === 'middle')
					t.style.alignmentBaseline = 'central';
				else if (this.textBaseline === 'alphabetic')
					t.style.alignmentBaseline = 'alphabetic';
				else if (this.textBaseline === 'ideographic')
					t.style.alignmentBaseline = 'ideographic';
				else if (this.textBaseline === 'bottom')
					t.style.alignmentBaseline = 'text-after-edge';
			}
		
			t.setAttributeNS(null, 'x', x);
			t.setAttributeNS(null, 'y', y);

			this.g.appendChild(t);
		}

		strokeText(text: string, x: number, y: number, maxWidth: number) {
		}

		save() {
			let state = {
				fillStyle: this.fillStyle,
				strokeStyle: this.strokeStyle,
				lineWidth: this.lineWidth,
				lineDash: this.lineDash,
				globalAlpha: this.globalAlpha,
				matrix: {
					a: this.currentTransform.a, b: this.currentTransform.b,
					c: this.currentTransform.c, d: this.currentTransform.d,
					e: this.currentTransform.e, f: this.currentTransform.f
				},
				font: this.font,
				textAlign: this.textAlign,
				textBaseline: this.textBaseline,
				direction: this.direction,
				clipId: this.clipId
			};
			this.states.push(state);
		}

		restore() {
			if (this.states.length > 0) {
				let state = this.states.pop();
				this.fillStyle = state.fillStyle;
				this.strokeStyle = state.strokeStyle;
				this.lineWidth = state.lineWidth;
				this.lineDash = state.lineDash;
				this.globalAlpha = state.globalAlpha;
				this.currentTransform = this.document.createSVGMatrix();
				this.currentTransform.a = state.matrix.a;
				this.currentTransform.b = state.matrix.b;
				this.currentTransform.c = state.matrix.c;
				this.currentTransform.d = state.matrix.d;
				this.currentTransform.e = state.matrix.e;
				this.currentTransform.f = state.matrix.f;
				this.font = state.font;
				this.textAlign = state.textAlign;
				this.textBaseline = state.textBaseline;
				this.direction = state.direction;
				this.clipId = state.clipId;
			}
		}

		scale(x: number, y: number) {
			this.currentTransform = this.currentTransform.scaleNonUniform(x, (y === undefined) ? x : y);
		}

		rotate(angle: number) {
			this.currentTransform = this.currentTransform.rotate(angle * 180 / Math.PI);
		}

		translate(x: number, y: number) {
			this.currentTransform = this.currentTransform.translate(x, y);
		}

		transform(a, b, c, d, e, f) {
			let mulMatrix = this.document.createSVGMatrix();
			mulMatrix.a = a;
			mulMatrix.b = b;
			mulMatrix.c = c;
			mulMatrix.d = d;
			mulMatrix.e = e;
			mulMatrix.f = f;
			this.currentTransform = this.currentTransform.multiply(mulMatrix);
		}

		setTransform(a, b, c, d, e, f) {
			this.currentTransform.a = a;
			this.currentTransform.b = b;
			this.currentTransform.c = c;
			this.currentTransform.d = d;
			this.currentTransform.e = e;
			this.currentTransform.f = f;
		}

		resetTransform() {
			this.currentTransform = this.document.createSVGMatrix();
		}

		clearRect(x, y, w, h) {
		}

		fillRect(x, y, w, h) {
			this.beginPath();
			this.currentPath.rect(x, y, w, h);
			this.closePath();
			this.fill();
		}

		strokeRect(x, y, w, h) {
			this.beginPath();
			this.currentPath.rect(x, y, w, h);
			this.closePath();
			this.stroke();
		}

		createLinearGradient(x0, y0, x1, y1) {
			return new Core.SVGGradient(x0, y0, x1, y1);
		}

		measureText(text) {
			let font = this.parseFont(this.font);
			return Ui.Label.measureText(text, font.size, font.family, font.weight);
		}

		svgPath(path) {
			let x = 0; let y = 0;
			let x1; let y1; let x2; let y2; let x3; let y3;
			let beginX = 0; let beginY = 0;

			let parser = new Ui.SvgParser(path);
			parser.next();

			this.beginPath();

			while (!parser.isEnd()) {
				let cmd = parser.getCmd();
				if (parser.isCmd())
					parser.next();

				if (cmd === 'm') {
					parser.setCmd('l');
					x += parser.getCurrent(); parser.next();
					y += parser.getCurrent(); parser.next();
					beginX = x;
					beginY = y;
					this.moveTo(x, y);
				}
				else if (cmd === 'M') {
					parser.setCmd('L');
					x = parser.getCurrent(); parser.next();
					y = parser.getCurrent(); parser.next();
					beginX = x;
					beginY = y;
					this.moveTo(x, y);
				}
				else if (cmd === 'l') {
					x += parser.getCurrent(); parser.next();
					y += parser.getCurrent(); parser.next();
					this.lineTo(x, y);
				}
				else if (cmd === 'L') {
					x = parser.getCurrent(); parser.next();
					y = parser.getCurrent(); parser.next();
					this.lineTo(x, y);
				}
				else if (cmd === 'v') {
					y += parser.getCurrent(); parser.next();
					this.lineTo(x, y);
				}
				else if (cmd === 'V') {
					y = parser.getCurrent(); parser.next();
					this.lineTo(x, y);
				}
				else if (cmd === 'h') {
					x += parser.getCurrent(); parser.next();
					this.lineTo(x, y);
				}
				else if (cmd === 'H') {
					x = parser.getCurrent(); parser.next();
					this.lineTo(x, y);
				}
				else if (cmd === 'c') {
					x1 = x + parser.getCurrent(); parser.next();
					y1 = y + parser.getCurrent(); parser.next();
					x2 = x + parser.getCurrent(); parser.next();
					y2 = y + parser.getCurrent(); parser.next();
					x3 = x + parser.getCurrent(); parser.next();
					y3 = y + parser.getCurrent(); parser.next();
					x = x3; y = y3;
					this.bezierCurveTo(x1, y1, x2, y2, x, y);
					
				}
				else if (cmd === 'C') {
					x1 = parser.getCurrent(); parser.next();
					y1 = parser.getCurrent(); parser.next();
					x2 = parser.getCurrent(); parser.next();
					y2 = parser.getCurrent(); parser.next();
					x3 = parser.getCurrent(); parser.next();
					y3 = parser.getCurrent(); parser.next();
					x = x3; y = y3;
					this.bezierCurveTo(x1, y1, x2, y2, x, y);
				}
				else if (cmd === 's') {
					x1 = x + parser.getCurrent(); parser.next();
					y1 = y + parser.getCurrent(); parser.next();
					x2 = x1;
					y2 = y1;
					x3 = x + parser.getCurrent(); parser.next();
					y3 = y + parser.getCurrent(); parser.next();
					x = x3; y = y3;
					this.bezierCurveTo(x1, y1, x2, y2, x, y);
					this.lineTo(x, y);
				}
				else if (cmd === 'S') {
					x1 = parser.getCurrent(); parser.next();
					y1 = parser.getCurrent(); parser.next();
					x2 = x1;
					y2 = y1;
					x3 = parser.getCurrent(); parser.next();
					y3 = parser.getCurrent(); parser.next();
					x = x3; y = y3;
					this.bezierCurveTo(x1, y1, x2, y2, x, y);
				}
				else if (cmd === 'q') {
					x1 = x + parser.getCurrent(); parser.next();
					y1 = y + parser.getCurrent(); parser.next();
					x2 = x + parser.getCurrent(); parser.next();
					y2 = y + parser.getCurrent(); parser.next();
					x = x2; y = y2;
					this.quadraticCurveTo(x1, y1, x, y);
				}
				else if (cmd === 'Q') {
					x1 = parser.getCurrent(); parser.next();
					y1 = parser.getCurrent(); parser.next();
					x2 = parser.getCurrent(); parser.next();
					y2 = parser.getCurrent(); parser.next();
					x = x2; y = y2;
					this.quadraticCurveTo(x1, y1, x, y);
				}
				else if ((cmd === 'z') || (cmd === 'Z')) {
					x = beginX;
					y = beginY;
					this.closePath();
				}
				else {
					throw ('Invalid SVG path cmd: ' + cmd + ' (' + path + ')');
				}
			}
		}

		parseFont(font) {
			let tab = font.split(' ');
			if (tab.length === 1)
				return { style: 'default', weight: 'normal', size: 16, family: tab[0] };
			if (tab.length === 2)
				return { style: 'default', weight: 'normal', size: parseInt(tab[0]), family: tab[1] };
			else if (tab.length === 3)
				return { style: 'default', weight: tab[0], size: parseInt(tab[1]), family: tab[2] };
			else if (tab.length === 4)
				return { style: tab[0], weight: tab[1], size: parseInt(tab[2]), family: tab[3] };
		}

		roundRectFilledShadow(x, y, width, height, radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft, inner, shadowWidth, color) {
			this.save();
			let rgba = color.getRgba();
			for (let i = 0; i < shadowWidth; i++) {
				let opacity;
				if (inner) {
					if (shadowWidth == 1)
						opacity = 1;
					else {
						let tx = (i + 1) / shadowWidth;
						opacity = tx * tx;
					}
				}
				else
					opacity = (i + 1) / (shadowWidth + 1);

				color = new Ui.Color(rgba.r, rgba.g, rgba.b, rgba.a * opacity);
				this.fillStyle = color.getCssRgba();

				if (inner) {
					this.beginPath();
					this.roundRect(x, y, width, height, radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft);
					this.roundRect(x + shadowWidth - i, y + shadowWidth - i, width - ((shadowWidth - i) * 2), height - ((shadowWidth - i) * 2), radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft, true);
					this.closePath();
					this.fill();
				}
				else {
					this.beginPath();
					this.roundRect(x + i, y + i, width - i * 2, height - i * 2, radiusTopLeft, radiusTopRight, radiusBottomRight, radiusBottomLeft);
					this.closePath();
					this.fill();
				}
			}
			this.restore();
		}
	
		getSVG() {
			return this.g;
		}

		static counter: number = 0;
	}
}

if(Core.Navigator.supportCanvas) {
	CanvasRenderingContext2D.prototype['roundRect'] = Core.SVG2DPath.prototype.roundRect;
	CanvasRenderingContext2D.prototype['svgPath'] = Core.SVG2DContext.prototype.svgPath;
	CanvasRenderingContext2D.prototype['roundRectFilledShadow'] = Core.SVG2DContext.prototype.roundRectFilledShadow;
}
