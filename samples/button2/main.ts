/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let iconName = 'exit';
		
		let vbox = new Ui.VBox();
		this.content = vbox;
		
		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);
		
		let verticalButton = new Ui.Button({ text: 'vertical' });
		toolbar.append(verticalButton);
		this.connect(verticalButton, 'press', () => button.orientation = 'vertical');
		
		let horizontalButton = new Ui.Button({ text: 'horizontal' });
		toolbar.append(horizontalButton);
		this.connect(horizontalButton, 'press', () => button.orientation = 'horizontal');
		
		let textButton = new Ui.Button({ text: 'text' });
		toolbar.append(textButton);
		this.connect(textButton, 'press', () => {
			button.text = 'click me';
			button.icon = undefined;
		});
		
		let iconButton = new Ui.Button({ text: 'icon' });
		toolbar.append(iconButton);
		this.connect(iconButton, 'press', () => {
			button.text = undefined;
			button.icon = iconName;
		});
		
		let textIconButton = new Ui.Button({ text: 'text + icon' });
		toolbar.append(textIconButton);
		this.connect(textIconButton, 'press', () => {
			button.text = 'click me';
			button.icon = iconName;
		});
		
		let enableButton = new Ui.Button({ text: 'enable' });
		toolbar.append(enableButton);
		this.connect(enableButton, 'press', () => button.enable());
		
		let disableButton = new Ui.Button({ text: 'disable' });
		toolbar.append(disableButton);
		this.connect(disableButton, 'press', () => button.disable());
		
		let badgeButton = new Ui.Button({ text: 'badge' });
		toolbar.append(badgeButton);
		this.connect(badgeButton, 'press', () => button.badge = '12');
		
		
		let markerButton = new Ui.Button({ text: 'marker' });
		toolbar.append(markerButton);
		this.connect(markerButton, 'press', () => {
			button.marker = new Ui.Icon({
				verticalAlign: 'center', horizontalAlign: 'center',
				icon: 'arrowbottom', width: 16, height: 16, marginRight: 5
			});
		});

		let widthButton = new Ui.Button({ text: '200 width' });
		toolbar.append(widthButton);
		this.connect(widthButton, 'press', () => button.width = 200);

		let autoWidthButton = new Ui.Button({ text: 'auto width' });
		toolbar.append(autoWidthButton);
		this.connect(autoWidthButton, 'press', () => button.width = undefined);
		
		let toolbar2 = new Ui.ToolBar();
		vbox.append(toolbar2);
		
		let defaultButton = new Ui.Button({ text: 'default' });
		defaultButton.style = undefined;
		toolbar2.append(defaultButton);
		this.connect(defaultButton, 'press', () => {
			button.style = undefined;
			toolbar2.style = undefined;
		});
		
		for (let i = 0; i < App.buttonStyles.length; i++) {
			let style = App.buttonStyles[i];
			let styleButton = new Ui.Button({ text: style.name });
			(styleButton as any)['Test.App.styleDef'] = style.style;
			styleButton.style = (styleButton as any)['Test.App.styleDef'];
			this.connect(styleButton, 'press', (b: any) => {
				button.style = b['Test.App.styleDef'];
			});
			toolbar2.append(styleButton);
		};
		
		let button = new Ui.Button({
			icon: 'exit', text: 'click me', orientation: 'horizontal',
			verticalAlign: 'center', horizontalAlign: 'center'
		});
		vbox.append(button, true);
		
		this.connect(button, 'press', () => Ui.Toast.send('button pressed'));
	}

	static buttonStyles: any = [
		{
			name: 'blue',
			style: {
				textAlign: 'left',
				background: Ui.Color.createFromHsl(225, 0.76, 1),
				backgroundBorder: Ui.Color.createFromHsl(225, 0.76, 0.5),
				foreground: Ui.Color.createFromHsl(225, 0.76, 3)
			}
		},
		{
			name: 'green',
			style: {
				background: Ui.Color.createFromHsl(109, 0.76, 1),
				backgroundBorder: Ui.Color.createFromHsl(109, 0.76, 0.5),
				foreground: Ui.Color.createFromHsl(109, 0.76, 0.4)
			}
		},
		{
			name: 'red',
			style: {
				background: Ui.Color.createFromHsl(2, 0.76, 0.8),
				backgroundBorder: Ui.Color.createFromHsl(2, 0.76, 0.4),
				foreground: Ui.Color.createFromHsl(2, 0.76, 5)
			}
		},
		{
			name: 'white',
			style: {
				background: Ui.Color.createFromRgb(1, 1, 1)
			}
		},
		{
			name: 'black',
			style: {
				background: Ui.Color.createFromHsl(0, 0, 0.5),
				backgroundBorder: Ui.Color.createFromHsl(0, 0, 0),
				foreground: Ui.Color.createFromHsl(0, 0, 0.9)
			}
		},
		{
			name: 'laclasse',
			style: {
				background: Ui.Color.createFromHsl(197, 1, 0.87),
				backgroundBorder: Ui.Color.createFromHsl(197,1, 0.4),
				foreground: Ui.Color.createFromHsl(197, 1, 10)
			}
		},
		{
			name: 'dark blue',
			style: {
				background: Ui.Color.createFromHsl(225, 0.81, 0.45),
				backgroundBorder: Ui.Color.createFromHsl(225, 0.81, 0.1),
				foreground: Ui.Color.createFromHsl(225, 0.4, 1)
			}
		},
		{
			name: 'transparent',
			style: {
				background: Ui.Color.createFromHsl(0, 0, 1, 0),
				backgroundBorder: Ui.Color.createFromHsl(0, 0, 1, 0),
				foreground: Ui.Color.createFromHsl(0, 0, 0.4)
			}
		}
	]

}

new App();

