namespace Ui {

    export class SVGIcon extends Ui.Element {
        static baseUrl = '';
        static forceExternal: boolean = false;

        set fill(value: Ui.Color | string) {
            (<HTMLDivElement>this.drawing).style.fill = Ui.Color.create(value).getCssRgba();
        }

        set path(value: string) {
            let drawing = <HTMLDivElement>this.drawing;
            drawing.innerHTML =
                `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path d="${value}"/>
    </svg>`;
            this.normalize();
        }

        set icon(value: string) {
            if (SVGIcon.forceExternal)
                this.loadIcon(value);
            else {
                let path = Ui.Icon.getPath(value);
                if (path == undefined)
                    this.loadIcon(value);
                else
                    this.path = path;
            }
        }

        private async loadIcon(value: string) {
            if (!(value.indexOf('.svg') + 4 == value.length && value.length > 4))
                value = `${value}.svg`;
            let req = new Core.HttpRequest().assign({
                url: `${SVGIcon.baseUrl}/${value}`
            });
            await req.sendAsync();
            let drawing = <HTMLDivElement>this.drawing;
            if (req.status == 200) {
                drawing.innerHTML = req.responseText;
                this.normalize();
            }
            else
                drawing.innerHTML = '';
        }

        private normalize() {
            let child = (<HTMLDivElement>this.drawing).children.item(0);
            if (child instanceof SVGSVGElement) {
                let svgWidth = child.getAttribute('width');
                let svgHeight = child.getAttribute('height');
                let svgViewBox = child.getAttribute('viewBox');
                if (svgViewBox == null) {
                    if (svgWidth != null && svgHeight != null)
                        svgViewBox = `0 0 ${parseInt(svgWidth)} ${parseInt(svgHeight)}`;
                    else
                        svgViewBox = '0 0 48 48';
                    child.setAttribute('viewBox', svgViewBox);
                }
                child.style.width = '100%';
                child.style.height = '100%';
            }
        }
    }
}