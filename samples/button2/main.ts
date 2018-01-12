/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let iconName = 'exit';
		
		let vbox = new Ui.VBox();
		this.content = vbox;
		
		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);
		
		toolbar.append(new Ui.Button({
			text: 'vertical',
			onpressed: () => button.orientation = 'vertical'
		}));
		
		toolbar.append(new Ui.Button({
			text: 'horizontal',
			onpressed: () => button.orientation = 'horizontal'
		}));
		
		toolbar.append(new Ui.Button({
			text: 'text',
			onpressed: () => {
				button.text = 'click me';
				button.icon = undefined;
			}
		}));
		
		toolbar.append(new Ui.Button({
			text: 'icon',
			onpressed: () => {
				button.text = undefined;
				button.icon = iconName;
			}
		}));
		
		toolbar.append(new Ui.Button({
			text: 'text + icon',
			onpressed: () => {
				button.text = 'click me';
				button.icon = iconName;
			}
		}));
		
		toolbar.append(new Ui.Button({
			text: 'enable',
			onpressed: () => button.enable()
		}));
		
		toolbar.append(new Ui.Button({
			text: 'disable',
			onpressed: () => button.disable()
		}));

		toolbar.append(new Ui.Button({
			text: 'badge',
			onpressed: () => button.badge = '12'
		}));

		toolbar.append(new Ui.Button({
			text: 'marker',
			onpressed: () => {
				button.marker = new Ui.Icon({
					verticalAlign: 'center', horizontalAlign: 'center',
					icon: 'arrowbottom', width: 16, height: 16, marginRight: 5
				});
			}
		}));

		toolbar.append(new Ui.Button({
			text: '200 width',
			onpressed: () => button.width = 200
		}));

		toolbar.append(new Ui.Button({
			text: 'auto width',
			onpressed: () => button.width = undefined
		}));
		
		let toolbar2 = new Ui.ToolBar();
		vbox.append(toolbar2);
		
		toolbar2.append(new Ui.Button({
			text: 'default',
			onpressed: () => {
				button.style = undefined;
				toolbar2.style = undefined;
			}
		}));
		
		for (let i = 0; i < App.buttonStyles.length; i++) {
			let style = App.buttonStyles[i];
			let styleButton = new Ui.Button({
				text: style.name,
				onpressed: (e) => {
					button.style = (e.target as any)['Test.App.styleDef'];
				}
			});
			(styleButton as any)['Test.App.styleDef'] = style.style;
			styleButton.style = (styleButton as any)['Test.App.styleDef'];
			toolbar2.append(styleButton);
		};
		
		let button = new Ui.Button({
			icon: 'exit', text: 'click me', orientation: 'horizontal',
			verticalAlign: 'center', horizontalAlign: 'center',
			onpressed: () => Ui.Toast.send('button pressed')
		});
		vbox.append(button, true);
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

