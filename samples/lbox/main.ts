/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
		let lbox = new Ui.LPBox();
		this.content = lbox;

        let r = new Ui.Rectangle({
            fill: 'orange', marginLeft: 40, marginTop: 40, marginBottom: 120, marginRight: 120
        });    
        lbox.prepend(r);
        
        r = new Ui.Rectangle({
            fill: 'pink', marginLeft: 60, marginTop: 60, marginBottom: 100, marginRight: 100
        });   
        lbox.prependAtLayer(r, 2);
        
        r = new Ui.Rectangle({
            fill: 'green', marginLeft: 80, marginTop: 80, marginBottom: 80, marginRight: 80
        });
        lbox.prepend(r);
        
        r = new Ui.Rectangle({
            fill: 'purple', marginLeft: 100, marginTop: 100, marginBottom: 60, marginRight: 60
        });
		lbox.prependAtLayer(r, 2);
	}
}

new App();

