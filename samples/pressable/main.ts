/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 5 });
		this.content = vbox;

		let count = 0;
		let activateCount = 0;
		let delayedCount = 0;
		
        let label = new Ui.Label({ text: 'press count: 0' });
        vbox.append(label);

        let label2 = new Ui.Label({ text: 'activate count: 0' });
		vbox.append(label2);

		let label3 = new Ui.Label({ text: 'delayed press count: 0' });
		vbox.append(label3);

        let rectangle = new Ui.Rectangle({
            width: 100, height: 100, fill: 'lightblue', horizontalAlign: 'center'
        });

		let pressable = new Ui.Pressable({
			onpressed: () => label.text = `press count: ${++count}`,
			onactivated: () => label2.text = `activate count: ${++activateCount}`,
			ondelayedpress: () => label3.text = `delayed press count: ${++delayedCount}`,
			ondowned: () => rectangle.fill = 'blue',
			onupped: () => rectangle.fill = 'lightblue',
			content: rectangle
		});
		vbox.append(pressable);
	}	
}

new App();

