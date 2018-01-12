/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let popup = new Ui.Popup();
		
		let vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 5 });
		this.content = vbox;
		
		let selectable = new Ui.Pressable({
			content: [
				new Ui.Rectangle({ width: 50, height: 50, radius: 8, fill: 'lightgreen' }),
				new Ui.Label({ text: 'click' })
			],
			onpressed: e => {
				console.log(`open the menu: ${e.x}x${e.y}`);
				if (e.x && e.y)
					popup.openAt(e.x, e.y);
			}
		});
		vbox.append(selectable);
				
		
		let button = new Ui.Button({
			text: 'open popup',
			onpressed: e => popup.open()
		});
		vbox.append(button);
		
		popup.content = new Ui.VBox({
			spacing: 5, margin: 10,
			content: [
				new Ui.Label({ text: 'bonjour' }),
				new Ui.Separator(),
				new Ui.Label({ text: 'bonjour2' }),
				new Ui.Separator(),
				new Ui.Label({ text: 'bonjour3' }),
				new Ui.Separator(),
				new Ui.Button({ text: 'click me' }),
				new Ui.Separator(),
				new Ui.Button({
					text: 'popup',
					onpressed: () => {
						let newPopup = new Ui.Popup({ autoClose: true });
						let button = new Ui.Button({ text: 'click' });
						newPopup.content = button;
						newPopup.open();
					}
				})
			]
		});
		
		vbox.append(new Ui.Button({
			text: 'close popup',
			onpressed: () => popup.close()
		}));
				
		vbox.append(new Ui.Pressable({
			content: [
				new Ui.Rectangle({ width: 50, height: 50, radius: 8, fill: 'lightgreen' }),
				new Ui.Label({ text: 'click' })
			],
			onpressed: e => {
				console.log('open the menu at element');
				popup.openElement(e.target);
			}
		}));
	}
}

new App();
