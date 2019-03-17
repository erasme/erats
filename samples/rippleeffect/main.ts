/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox().assign({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 5 });
		this.content = vbox;
		
        let rectangle = new Ui.Rectangle().assign({
            width: 100, height: 100, fill: 'lightblue', horizontalAlign: 'center'
        });

		let pressable = new Ui.Pressable().assign({ horizontalAlign: 'center' });
		let ripple = new Ui.RippleEffect(pressable);

		pressable.assign({
			onpressed: (e) => {
				if (e.x && e.y) {
					let p = pressable.pointFromWindow(new Ui.Point(e.x, e.y));
					ripple.press(p.x, p.y);
				}
				else
					ripple.press();
			},
			ondowned: (e) => {
				if (e.x && e.y) {
					let p = pressable.pointFromWindow(new Ui.Point(e.x, e.y));
					ripple.down(p.x, p.y);
				}
				else
					ripple.down();
			},
			onupped: () => ripple.up(),
			content: rectangle
		});
		vbox.append(pressable);
	}	
}

new App();

