/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let vbox = new Ui.VBox();
		this.content = vbox;
		
		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);
		
		let text = new Ui.Text();

		toolbar.append(new Ui.Button({
			text: 'send',
			onpressed: async () => {
				let req = new Core.HttpRequest({ url: 'service.php' });
				await req.sendAsync();
				text.text = req.responseText;
			}
		}));

		vbox.append(text, true);
	}
}

new App();
