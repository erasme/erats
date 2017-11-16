namespace Ui
{
	export interface FixedInit extends ContainerInit {
	}

	export class Fixed extends Container implements FixedInit
	{
		constructor(init?: Partial<FixedInit>) {
			super(init);
			this.addEvents('resize');
		}

		setPosition(item: Element, x: number, y: number) {
			if (x !== undefined)
				item['Ui.Fixed.x'] = x;
			if (y !== undefined)
				item['Ui.Fixed.y'] = y;
			this.updateItemTransform(item);
		}
	
		setRelativePosition(item: Element, x: number, y: number, absolute: boolean = false) {
			if (x !== undefined)
				item['Ui.Fixed.relativeX'] = x;
			if (y !== undefined)
				item['Ui.Fixed.relativeY'] = y;
			item['Ui.Fixed.relativeAbsolute'] = absolute === true;
			this.updateItemTransform(item);
		}

		append(child: Element, x: number, y: number) {
			child['Ui.Fixed.x'] = x;
			child['Ui.Fixed.y'] = y;
			this.appendChild(child);
		}

		remove(child: Element) {
			delete (child['Ui.Fixed.x']);
			delete (child['Ui.Fixed.y']);
			delete (child['Ui.Fixed.relativeX']);
			delete (child['Ui.Fixed.relativeY']);
			delete (child['Ui.Fixed.relativeAbsolute']);
			this.removeChild(child);
		}

		protected updateItemTransform(child: Element) {
			let x = 0;
			if (child['Ui.Fixed.x'] !== undefined)
				x = child['Ui.Fixed.x'];
			if (child['Ui.Fixed.relativeX'] !== undefined)
				x -= child['Ui.Fixed.relativeX'] * ((child['Ui.Fixed.relativeAbsolute'] === true) ? 1 : child.measureWidth);

			let y = 0;
			if (child['Ui.Fixed.y'] !== undefined)
				y = child['Ui.Fixed.y'];
			if (child['Ui.Fixed.relativeY'] !== undefined)
				y -= child['Ui.Fixed.relativeY'] * ((child['Ui.Fixed.relativeAbsolute'] === true) ? 1 : child.measureHeight);
		
			child.transform = Matrix.createTranslate(x, y);
		}

		protected measureCore(width: number, height: number): Size {
			for (let i = 0; i < this.children.length; i++)
				this.children[i].measure(width, height);
			return { width: 0, height: 0 };
		}

		protected arrangeCore(width: number, height: number) {
			this.fireEvent('resize', this, width, height);
			for (let i = 0; i < this.children.length; i++) {
				let child = this.children[i];
				child.arrange(0, 0, child.measureWidth, child.measureHeight);
				this.updateItemTransform(child);
			}
		}

		protected onChildInvalidateMeasure(child: Element, event) {
			if (event !== 'remove') {
				child.measure(this.layoutWidth, this.layoutHeight);
				child.arrange(0, 0, child.measureWidth, child.measureHeight);
				this.updateItemTransform(child);
			}
		}

		protected onChildInvalidateArrange(child: Element) {
			child.arrange(0, 0, child.measureWidth, child.measureHeight);
			this.updateItemTransform(child);
		}
	}
}	

