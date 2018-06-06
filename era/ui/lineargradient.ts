namespace Ui
{
    export interface GradientStop {
        offset: number;
        color: Color | string;
    }

    export class LinearGradient extends Core.Object
    {
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
            let i; let stop; let gradient;
            if (this.image !== undefined)
                return this.image;

            if (Core.Navigator.isWebkit) {
                this.image = '-webkit-gradient(linear, 0% 0%, ';
                if (this.orientation == 'vertical')
                    this.image += '0% 100%';
                else
                    this.image += '100% 0%';
                for (i = 0; i < this.stops.length; i++) {
                    stop = this.stops[i];
                    this.image += ', color-stop(' + stop.offset + ', ' + stop.color.getCssRgba() + ')';
                }
                this.image += ')';
            }
            else if (Core.Navigator.isGecko) {
                this.image = '-moz-linear-gradient(';
                if (this.orientation == 'vertical')
                    this.image += '-90deg';
                else
                    this.image += '0deg';
                for (i = 0; i < this.stops.length; i++) {
                    stop = this.stops[i];
                    this.image += ', ' + stop.color.getCssRgba() + ' ' + Math.round(stop.offset * 100) + '%';
                }
                this.image += ')';
            }
            else if (Core.Navigator.supportCanvas) {
                let canvas: any = document.createElement('canvas');
                let context = canvas.getContext('2d');
                if (this.orientation == 'vertical') {
                    canvas.setAttribute('width', 1, null);
                    canvas.setAttribute('height', 100, null);
                    gradient = context.createLinearGradient(0, 0, 0, 100);
                    for (i = 0; i < this.stops.length; i++) {
                        stop = this.stops[i];
                        gradient.addColorStop(stop.offset, stop.color.getCssRgba());
                    }
                    context.fillStyle = gradient;
                    context.fillRect(0, 0, 1, 100);
                }
                else {
                    canvas.setAttribute('width', 100, null);
                    canvas.setAttribute('height', 1, null);
                    gradient = context.createLinearGradient(0, 0, 100, 0);
                    for (i = 0; i < this.stops.length; i++) {
                        stop = this.stops[i];
                        gradient.addColorStop(stop.offset, stop.color.getCssRgba());
                    }
                    context.fillStyle = gradient;
                    context.fillRect(0, 0, 100, 1);
                }
                this.image = 'url(' + canvas.toDataURL() + ')';
            }
            else {
                this.image = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAAAXNSR0IArs4c6QAAAAZiS0dEAO8AUQBRItXOlAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9gJDxcIBl8Z3A0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAC0lEQVQI12NgwAUAABoAASRETuUAAAAASUVORK5CYII%3D)';
            }
            return this.image;
        }

        getSVGGradient() {
            let gradient:any = document.createElementNS(svgNS, 'linearGradient');
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
                let svgStop:any = document.createElementNS(svgNS, 'stop');
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
    }
}

