/// <reference path="../../era/era.d.ts" />

//
// Play with styles
//

/*let styles = [{
	types: [
		{
			type: Ui.Button,
			foreground: 'rgb(100,0,100)',
			borderWidth: 2,
			background: 'rgb(204,0,204)',
			backgroundBorder: 'rgb(100,0,100)'
		},
		{
			type: Ui.ToolBar,
			types: [
				{
					type: Ui.Button,
					background: 'rgb(240,240,240)'
				}
			]
		}
	]
}];*/

let styles = [
	{
		types: [
			{
				type: Ui.Button,
				foreground: 'rgb(100,0,100)',
				borderWidth: 2,
				background: 'rgb(204,0,204)',
				backgroundBorder: 'rgb(100,0,100)'
			}
		]
	},
	{
		types: [
			{
				type: Ui.ToolBar,
				types: [
					{
						type: Ui.Button,
						background: 'rgb(240,240,240)'
					}
				]
			},
			{
				type: Ui.Button,
				background: 'rgb(28,142,255)'
			}
		]
	},
	{
		types: [
			{
				type: Ui.Button,
				background: 'rgb(241,177,249)',
				radius: 20
			}
		]
	},
	{
		types: [
			{
				type: Ui.ToolBar,
				types: [
					{
						type: Ui.Button,
						background: 'rgb(45,173,255)',
						radius: 0
					}
				]
			},
			{
				type: Ui.Button,
				background: 'rgb(255,173,45)'
			}
		]
	}
];


class App extends Ui.App {
	constructor() {
		super();

		let content = new Ui.VBox();
		this.setContent(content);

		let toolbar = new Ui.ToolBar();
		toolbar.append(new Ui.Button({ text: 'button1' }));
		toolbar.append(new Ui.Element(), true);
		toolbar.append(new Ui.Label({ text: 'The Title', fontWeight: 'bold' }));
		toolbar.append(new Ui.Element(), true);
		toolbar.append(new Ui.Button({ text: 'button2' }));
		content.append(toolbar);

		let vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 10 });
		content.append(vbox, true);

		let button = new Ui.Button({ text: 'default', width: 200 });
		vbox.append(button);
		this.connect(button, 'press', () => this.setStyle(undefined));

		for (let i = 0; i < styles.length; i++) {
			let style = styles[i];
			let button = new Ui.Button({ text: `style${i}`, width: 200 });
			vbox.append(button);
			this.connect(button, 'press', () => this.setStyle(style));
		}
	}
}

new App();
