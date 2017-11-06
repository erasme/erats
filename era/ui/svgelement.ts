namespace Ui {
	export interface SVGElementInit extends ElementInit {
	}

	export class SVGElement extends Element implements SVGElementInit {
		renderSVG(svg) {
		}

		protected renderDrawing() {
			let svg = document.createElementNS(svgNS, 'svg') as SVGSVGElement;
			svg.setAttribute('focusable', 'false');
			let content = this.renderSVG(svg);
			if (content !== undefined)
				svg.appendChild(content as any);
			return svg;
		}
	}
}	

