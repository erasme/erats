/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
		let lbox = new Ui.LPBox();
		this.setContent(lbox);

        let r = new Ui.Rectangle();
        r.fill = 'orange'; r.marginLeft = 40; r.marginTop = 40; r.marginBottom = 120; r.marginRight = 120;
        lbox.prepend(r);
        
        r = new Ui.Rectangle();
        r.fill = 'pink'; r.marginLeft = 60; r.marginTop = 60; r.marginBottom = 100; r.marginRight = 100;
        lbox.prependAtLayer(r, 2);
        
        r = new Ui.Rectangle();
        r.fill = 'green'; r.marginLeft = 80; r.marginTop = 80; r.marginBottom = 80; r.marginRight = 80;
        lbox.prepend(r);
        
        r = new Ui.Rectangle();
        r.fill = 'purple'; r.marginLeft = 100; r.marginTop = 100; r.marginBottom = 60; r.marginRight = 60;
		lbox.prependAtLayer(r, 2);
	}
}

new App();

