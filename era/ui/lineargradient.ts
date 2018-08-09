namespace Ui {
    export interface GradientStop {
        offset: number;
        color: Color | string;
    }

    export class LinearGradient extends Core.Object {
        orientation: Orientation;
        stops: GradientStop[];
        image: any = undefined;

        constructor(stops?: GradientStop[], orientation: Orientation = 'vertical') {
            super();
            if (stops !== undefined)
                this.stops = stops;
            else
                this.stops = [
                    { offset: 0, color: new Ui.Color(1, 1, 1, 1) },
                    { offset: 1, color: new Ui.Color(0, 0, 0, 1) }];
            this.orientation = orientation;
            for (let i = 0; i < this.stops.length; i++)
                this.stops[i].color = Ui.Color.create(this.stops[i].color);
        }

        getBackgroundImage() {
            if (this.image !== undefined)
                return this.image;
            this.image = this.getCssGradient();
            return this.image;
        }

        getSVGGradient() {
            let gradient: any = document.createElementNS(svgNS, 'linearGradient');
            gradient.setAttributeNS(null, 'gradientUnits', 'objectBoundingBox');
            gradient.setAttributeNS(null, 'x1', 0);
            gradient.setAttributeNS(null, 'y1', 0);
            if (this.orientation == 'vertical') {
                gradient.setAttributeNS(null, 'x2', 0);
                gradient.setAttributeNS(null, 'y2', 1);
            }
            else {
                gradient.setAttributeNS(null, 'x2', 1);
                gradient.setAttributeNS(null, 'y2', 0);
            }
            for (let i = 0; i < this.stops.length; i++) {
                let stop = this.stops[i];
                let svgStop: any = document.createElementNS(svgNS, 'stop');
                svgStop.setAttributeNS(null, 'offset', stop.offset);
                svgStop.style.stopColor = (stop.color as Color).getCssHtml();
                svgStop.style.stopOpacity = (stop.color as Color).getRgba().a;
                gradient.appendChild(svgStop);
            }
            return gradient;
        }

        getCanvasGradient(context, width, height) {
            let gradient;
            if (this.orientation == 'vertical')
                gradient = context.createLinearGradient(0, 0, 0, height);
            else
                gradient = context.createLinearGradient(0, 0, width, 0);
            for (let i = 0; i < this.stops.length; i++) {
                let stop = this.stops[i];
                gradient.addColorStop(stop.offset, (stop.color as Color).getCssRgba());
            }
            return gradient;
        }

        getCssGradient() {
            let image = 'linear-gradient(';
            if (this.orientation == 'vertical')
                image += 'to bottom';
            else
                image += 'to right';
            for (let i = 0; i < this.stops.length; i++) {
                let stop = this.stops[i];
                image += `, ${Color.create(stop.color).getCssRgba()} ${Math.round(stop.offset * 100)}%`;
            }
            image += ')';
            return image;
        }
    }
}

