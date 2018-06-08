namespace Ui {

    export class SVGIcon extends Ui.Element {
        static baseUrl = '';
        
        set fill(value: Ui.Color | string) {
            (<HTMLDivElement>this.drawing).style.fill = Ui.Color.create(value).getCssRgba();
        }
    
        set icon(value: string) {
            this.loadIcon(value);
        }
    
        async loadIcon(value: string) {
            if (!(value.indexOf('.svg') + 4 == value.length && value.length > 4))
                value = `${value}.svg`;
            let req = new Core.HttpRequest().assign({
                url: `${SVGIcon.baseUrl}/${value}`
            });
            await req.sendAsync();
            let drawing = <HTMLDivElement>this.drawing;
            if (req.status == 200) {
                drawing.innerHTML = req.responseText;
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
            else
                drawing.innerHTML = '';
        }
    }    
}