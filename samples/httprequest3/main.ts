/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let vbox = new Ui.VBox();
		this.content = vbox;
		
		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);
		
		let sendButton = new Ui.Button({ text: 'send' });
		toolbar.append(sendButton);

		let text = new Ui.Text();
		vbox.append(text, true);

		this.connect(sendButton, 'press', async () => {
			let req = new Core.HttpRequest({ url: 'service.php' });
			await req.sendAsync();
			text.text = req.responseText;
		});		
	}
}

new App();
