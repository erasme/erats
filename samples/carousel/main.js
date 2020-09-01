"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;
        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        let previousButton = new Ui.Button({
            icon: 'arrowleft',
            onpressed: () => this.carousel.previous()
        });
        toolbar.append(previousButton);
        toolbar.append(new Ui.Element(), true);
        let nextButton = new Ui.Button({
            icon: 'arrowright',
            onpressed: () => this.carousel.next()
        });
        toolbar.append(nextButton);
        let lbox = new Ui.LBox({ verticalAlign: 'center', horizontalAlign: 'center', width: 400, height: 400 });
        vbox.append(lbox, true);
        lbox.append(new Ui.Frame({ fill: 'orange', frameWidth: 4, radius: 8 }));
        this.carousel = new Ui.Carousel({
            margin: 4, alwaysShowArrows: true,
            onchanged: e => Ui.Toast.send(`position ${e.position}`)
        });
        lbox.append(this.carousel);
        this.carousel.append(new Ui.Rectangle({ fill: 'lightgreen' }));
        this.carousel.append(new Ui.Rectangle({ fill: 'lightblue' }));
        this.carousel.append(new Ui.ScrollingArea({
            content: new Ui.Rectangle({ fill: 'orange', height: 600 })
        }));
        this.carousel.append(new Ui.ScrollingArea({
            content: new Ui.Image({ src: '6wind.jpg', width: 600, height: 600 })
        }));
        let complexcontent = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center' });
        complexcontent.append(new Ui.Button({ text: 'Button 1' }));
        complexcontent.append(new Ui.Button({ text: 'Button 2' }));
        this.carousel.append(complexcontent);
        this.carousel.append(new Ui.Text({ selectable: true, text: 'Thalassius vero ea tempestate praefectus praetorio praesens ipse ' +
                'quoque adrogantis ingenii, considerans incitationem eius ad multorum ' +
                'augeri discrimina, non maturitate vel consiliis mitigabat, ut aliquotiens ' +
                'celsae potestates iras principum molliverunt, sed adversando iurgandoque ' +
                'cum parum congrueret, eum ad rabiem potius evibrabat, Augustum actus eius ' +
                'exaggerando creberrime docens, idque, incertum qua mente, ne lateret adfectans. ' +
                'quibus mox Caesar acrius efferatus, velut contumaciae quoddam vexillum altius ' +
                'erigens, sine respectu salutis alienae vel suae ad vertenda opposita instar ' +
                'rapidi fluminis irrevocabili impetu ferebatur.'
        }));
        this.carousel.append(new Ui.Rectangle({ fill: 'green' }));
    }
}
new App();
