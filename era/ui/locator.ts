namespace Ui {

	export interface LocatorInit extends ContainerInit {
		path?: string;
		onchanged?: (event: { target: Locator, path: string, position: number }) => void;
	}

	export class Locator extends Container implements LocatorInit {
		private _path: string;
		private foregrounds: Array<Pressable>;
		private backgrounds: Array<Rectangle | LocatorRightArrow | LocatorLeftArrow | LocatorLeftRightArrow>;
		private border: Rectangle;
		private focusedPart: Pressable;
		readonly changed = new Core.Events<{ target: Locator, path: string, position: number }>();
	
		constructor(init?: LocatorInit) {
			super(init);
			this.focused.connect(() => this.updateColors());
			this.blurred.connect(() => this.updateColors());
			if (init) {
				if (init.path !== undefined)
					this.path = init.path;
				if (init.onchanged)
					this.changed.connect(init.onchanged);
			}
		}

		set path(path: string) {
			let spacing = this.getStyleProperty('spacing');
			let radius = this.getStyleProperty('radius');
			let padding = this.getStyleProperty('padding');

			this._path = path;
			// remove all children
			while (this.children.length > 0)
				this.removeChild(this.children[0]);

			this.border = new Rectangle({ fill: '#888888', radius: radius });
			this.appendChild(this.border);

			this.backgrounds = [];
			this.foregrounds = [];

			if (path == '/') {
				let bg = new Rectangle({ radius: radius - 1 });
				this.backgrounds.push(bg);
				this.appendChild(bg);

				let fg = new Ui.Pressable({
					padding: padding,
					onpressed: e => this.onPathPress(fg),
					ondowned: e => this.onPathDown(fg),
					onupped: e => this.onPathUp(fg),
					onfocused: e => this.onPathFocus(fg),
					onblurred: e => this.onPathBlur(fg)
				});
				(fg as any).locatorPath = '/';
				(fg as any).locatorPos = 0;

				let home = new Ui.Icon({
					icon: 'home', width: 24, height: 24,
					verticalAlign: 'center', horizontalAlign: 'center'
				});
				fg.appendChild(home);

				this.foregrounds.push(fg);
				this.appendChild(fg);
			}
			else {
				let paths = path.split('/');
				let cleanPaths = [];
				for (let i = 0; i < paths.length; i++) {
					if (paths[i] !== '')
						cleanPaths.push(paths[i]);
				}
				paths = cleanPaths;
			
				// create all bgs
				let bg = new LocatorRightArrow({ arrowLength: spacing, radius: radius - 1 });
				this.backgrounds.push(bg);
				this.appendChild(bg);

				for (let i = 0; i < paths.length; i++) {
					let bg: LocatorLeftArrow | LocatorLeftRightArrow;
					if (i == paths.length - 1)
						bg = new LocatorLeftArrow({ arrowLength: spacing, radius: radius - 1 });
					else
						bg = new LocatorLeftRightArrow({ arrowLength: spacing });
					this.backgrounds.push(bg);
					this.appendChild(bg);
				}

				let currentPath = '/';
				// handle pressable parts
				let fg = new Ui.Pressable({
					padding: padding,
					onpressed: e => this.onPathPress(fg),
					ondowned: e => this.onPathDown(fg),
					onupped: e => this.onPathUp(fg),
					onfocused: e => this.onPathFocus(fg),
					onblurred: e => this.onPathBlur(fg)
				});

				let home = new Icon({ icon: 'home', width: 24, height: 24 });
				home.verticalAlign = 'center';
				home.horizontalAlign = 'center';
				(fg as any).locatorPos = 0;
				(fg as any).locatorPath = '/';
				fg.appendChild(home);

				this.foregrounds.push(fg);
				this.appendChild(fg);
				for (let i = 0; i < paths.length; i++) {
					currentPath += paths[i];
					let fg = new Ui.Pressable({
						padding: padding,
						onpressed: e => this.onPathPress(fg),
						ondowned: e => this.onPathDown(fg),
						onupped: e => this.onPathUp(fg),
						onfocused: e => this.onPathFocus(fg),
						onblurred: e => this.onPathBlur(fg)	
					});
					(fg as any).locatorPos = i + 1;
					(fg as any).locatorPath = currentPath;
					fg.appendChild(new Ui.Label({ text: paths[i], verticalAlign: 'center' }));
					this.foregrounds.push(fg);
					this.appendChild(fg);
					currentPath += '/';
				}
			}
			this.updateColors();
		}

		get path(): string {
			return this._path;
		}

		private getBackground() {
			return Ui.Color.create(this.getStyleProperty('background'));
		}

		private getLightColor() {
			let yuv = this.getBackground().getYuv();
			let deltaY = 0;
			if (yuv.y < 0.4)
				return Color.createFromYuv(yuv.y - 0.15 + deltaY, yuv.u, yuv.v);
			else
				return Color.createFromYuv(yuv.y + 0.15 + deltaY, yuv.u, yuv.v);
		}

		private getBackgroundBorder() {
			let color;
			if ((this.focusedPart !== undefined) && !this.focusedPart.getIsMouseFocus())
				color = Ui.Color.create(this.getStyleProperty('focusBackgroundBorder'));
			else
				color = Ui.Color.create(this.getStyleProperty('backgroundBorder'));
			let yuv = color.getYuva();
			let deltaY = 0;
			return Color.createFromYuv(yuv.y + deltaY, yuv.u, yuv.v, yuv.a);
		}
	
		private getDownColor() {
			let yuv = this.getBackground().getYuv();
			let deltaY = -0.20;
			if (yuv.y < 0.4)
				return Color.createFromYuv(yuv.y - 0.15 + deltaY, yuv.u, yuv.v);
			else
				return Color.createFromYuv(yuv.y + 0.15 + deltaY, yuv.u, yuv.v);
		}

		private onPathPress(pathItem) {
			this.changed.fire({ target: this, path: pathItem.locatorPath, position: pathItem.locatorPos });
		}

		private onPathDown(pathItem) {
			this.backgrounds[pathItem.locatorPos].fill = this.getDownColor();
		}

		private onPathUp(pathItem) {
			this.backgrounds[pathItem.locatorPos].fill = this.getLightColor();
		}

		private onPathFocus(pressable: Pressable) {
			this.focusedPart = pressable;
			this.updateColors();
		}

		private onPathBlur(pressable: Pressable) {
			this.focusedPart = undefined;
			this.updateColors();
		}
	
		private updateColors() {
			let backgroundColor = this.getBackground();
			let focusBackgroundColor = Ui.Color.create(this.getStyleProperty('focusBackground'));
			this.border.fill = this.getBackgroundBorder();

			let focusPos = -1;
			if (this.focusedPart !== undefined) {
				for (let i = 0; (focusPos === -1) && (i < this.foregrounds.length); i++)
					if (this.foregrounds[i] === this.focusedPart)
						focusPos = i;
			}

			for (let i = 0; i < this.backgrounds.length; i++) {
				if (i === focusPos)
					this.backgrounds[i].fill = focusBackgroundColor;
				else
					this.backgrounds[i].fill = backgroundColor;
			}
		}

		protected measureCore(width: number, height: number) {
			console.log('locator.measureCore ');
			console.log(this.foregrounds);
			if (this.foregrounds.length === 0)
				return { width: 0, height: 0 };
			let i;
			for (i = 0; i < this.foregrounds.length; i++)
				this.foregrounds[i].measure(0, 0);
			for (i = 0; i < this.backgrounds.length; i++)
				this.backgrounds[i].measure(0, 0);
		
			this.border.measure(0, 0);

			if (this.foregrounds.length == 1)
				return { width: this.foregrounds[0].measureWidth + 2, height: this.foregrounds[0].measureHeight + 2 };
			else {
				let minWidth = 0;
				let minHeight = 0;
				for (i = 0; i < this.foregrounds.length; i++) {
					let child = this.foregrounds[i];
					if (child.measureHeight > minHeight)
						minHeight = child.measureHeight;
					minWidth += child.measureWidth;
				}
				let spacing = this.getStyleProperty('spacing');
				let borderWidth = this.getStyleProperty('borderWidth');
				minWidth += (this.foregrounds.length - 1) * (spacing + borderWidth);
				return { width: minWidth + (2 * borderWidth), height: minHeight + (2 * borderWidth) };
			}
		}

		protected arrangeCore(width: number, height: number) {
			let borderWidth = this.getStyleProperty('borderWidth');
			if (this.foregrounds.length == 1) {
				this.foregrounds[0].arrange(borderWidth, borderWidth, width - 2 * borderWidth, height - 2 * borderWidth);
				this.backgrounds[0].arrange(borderWidth, borderWidth, width - 2 * borderWidth, height - 2 * borderWidth);
				this.border.arrange(0, 0, width, height);
				return;
			}
			let spacing = this.getStyleProperty('spacing');

			let x = borderWidth;
			for (let i = 0; i < this.foregrounds.length; i++) {
				let bg = this.backgrounds[i];
				let fg = this.foregrounds[i];
				let fgWidth = fg.measureWidth;
				fg.arrange(x + 1, 0 + borderWidth, fgWidth, height - 2 * borderWidth);
				if (i === 0)
					bg.arrange(x, 0 + borderWidth, fgWidth + spacing, height - 2 * borderWidth);
				else if (i == this.foregrounds.length - 1)
					bg.arrange(x - spacing, 0 + borderWidth, fgWidth + spacing, height - 2 * borderWidth);
				else
					bg.arrange(x - spacing, 0 + borderWidth, fgWidth + spacing * 2, height - 2 * borderWidth);
				x += fgWidth + spacing + borderWidth;
			}
			this.border.arrange(0, 0, width, height);
		}
	
		protected onStyleChange() {
			let spacing = this.getStyleProperty('spacing');
			let padding = this.getStyleProperty('padding');
			let radius = this.getStyleProperty('radius');

			let borderWidth = this.getStyleProperty('borderWidth');
			for (let i = 0; i < this.backgrounds.length; i++) {
				let bg = this.backgrounds[i];
				if ('arrowLength' in bg)
					(bg as any).arrowLength = spacing;
				bg.radius = radius - borderWidth;
			}
			for (let i = 0; i < this.foregrounds.length; i++)
				this.foregrounds[i].padding = padding;
			this.border.radius = radius;
			this.updateColors();
		}

		protected onDisable() {
			super.onDisable();
			for (let i = 0; i < this.foregrounds.length; i++)
				this.foregrounds[i].opacity = 0.4;
		}

		protected onEnable() {
			super.onEnable();
			for (let i = 0; i < this.foregrounds.length; i++)
				this.foregrounds[i].opacity = 1;
		}

		static style: any = {
			background: 'rgba(250,250,250,1)',
			backgroundBorder: 'rgba(140,140,140,1)',
			focusBackground: '#07a0e5',
			focusBackgroundBorder: Color.createFromRgb(0.04, 0.43, 0.5),
			focusActiveBackgroundBorder: Color.createFromRgb(0.04, 0.43, 0.5),
			radius: 3,
			spacing: 10,
			padding: 8,
			borderWidth: 1
		}
	}
	
	export interface LocatorRightArrowInit extends CanvasElementInit {
	}

	export class LocatorRightArrow extends CanvasElement {
		private _radius: number = 8;
		private _length: number = 10;
		private _fill: Color = new Color();
	
		constructor(config) {
			super();
		}

		set radius(radius: number) {
			this._radius = radius;
			this.invalidateArrange();
		}
	
		set arrowLength(length: number) {
			this._length = length;
			this.invalidateArrange();
		}
	
		set fill(color: Color | string) {
			this._fill = Color.create(color);
			this.invalidateDraw();
		}

		protected updateCanvas(ctx) {
			let width = this.layoutWidth;
			let height = this.layoutHeight;
			let v1 = width - this._length;
			let v2 = height / 2;
			let v3 = height - this._radius;
			ctx.svgPath('M' + this._radius + ',0 L' + v1 + ',0 L' + width + ',' + v2 + ' L' + v1 + ',' + height + ' L' + this._radius + ',' + height + ' Q0,' + height + ' 0,' + v3 + ' L0,' + this._radius + ' Q0,0 ' + this._radius + ',0 z');
			ctx.fillStyle = this._fill.getCssRgba();
			ctx.fill();
		}
	}

	export interface LocatorLeftArrowInit extends ShapeInit {
		radius?: number;
		arrowLength?: number;
	}
	
	export class LocatorLeftArrow extends Shape implements LocatorLeftArrowInit {
		private _radius: number = 8;
		private _length: number = 10;

		constructor(init?: LocatorLeftArrowInit) {
			super(init);
			if (init) {
				if (init.radius !== undefined)
					this.radius = init.radius;
				if (init.arrowLength !== undefined)
					this.arrowLength = init.arrowLength;	
			}
		}

		set radius(radius: number) {
			this._radius = radius;
		}
	
		set arrowLength(length: number) {
			this._length = length;
			this.invalidateDraw();
		}

		protected arrangeCore(width: number, height: number) {
			super.arrangeCore(width, height);
			let v2 = width - this._radius;
			let v3 = height - this._radius;
			let v4 = height / 2;
			this.path = 'M0,0 L' + v2 + ',0 Q' + width + ',0 ' + width + ',' + this._radius + ' L' + width + ',' + v3 + ' Q' + width + ',' + height + ' ' + v2 + ',' + height + ' L0,' + height + ' L' + this._length + ',' + v4 + ' z';
		}
	}

	export interface LocatorLeftRightArrowInit extends ShapeInit {
		radius?: number;
		arrowLength?: number;
	}
	
	export class LocatorLeftRightArrow extends Shape implements LocatorLeftRightArrowInit {
		private _length: number = 10;

		constructor(init?: LocatorLeftRightArrowInit) {
			super(init);
			if (init) {
				if (init.radius !== undefined)
					this.radius = init.radius;
				if (init.arrowLength !== undefined)
					this.arrowLength = init.arrowLength;	
			}
		}

		set radius(radius: number) {
		}
	
		set arrowLength(length: number) {
			this._length = length;
			this.invalidateDraw();
		}

		protected arrangeCore(width: number, height: number) {
			super.arrangeCore(width, height);
			let v1 = width - this._length;
			let v2 = height / 2;
			this.path = 'M0,0 L' + v1 + ',0 L' + width + ',' + v2 + ' L' + v1 + ',' + height + ' L0,' + height + ' L' + this._length + ',' + v2 + ' z';
		}
	}
}	

