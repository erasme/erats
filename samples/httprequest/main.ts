/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let vbox = new Ui.VBox();
		this.content = vbox;
		
		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);
		
		let request: Core.HttpRequest;
		
		let sendButton = new Ui.Button({ text: 'send' });
		toolbar.append(sendButton);
		this.connect(sendButton, 'press', () => {
			request = new Core.HttpRequest({ url: 'service.php' });
			this.connect(request, 'done', () => text.text = request.responseText);
			request.send();
		});
		
		let text = new Ui.Text();
		vbox.append(text, true);
	}
}

new App();
