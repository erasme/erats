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
            onpressed: () => carouselable.previous()
        });
        toolbar.append(previousButton);
        toolbar.append(new Ui.Element(), true);
        let nextButton = new Ui.Button({
            icon: 'arrowright',
            onpressed: () => carouselable.next()
        });
        toolbar.append(nextButton);
        let lbox = new Ui.LBox({
            verticalAlign: 'center', horizontalAlign: 'center',
            width: 400, height: 400
        });
        vbox.append(lbox, true);
        lbox.append(new Ui.Frame({ fill: 'orange', frameWidth: 4 }));
        let carouselable = new Ui.Carouselable({ margin: 4 });
        lbox.append(carouselable);
        carouselable.append(new Ui.Rectangle({ fill: 'lightgreen' }));
        carouselable.append(new Ui.Rectangle({ fill: 'lightblue' }));
        carouselable.append(new Ui.Rectangle({ fill: 'purple' }));
    }
}
new App();
