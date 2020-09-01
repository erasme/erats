"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let iconName = 'exit';
        let toolbar2 = new Ui.ToolBar().assign({
            content: [
                new Ui.Button().assign({
                    text: 'default',
                    onpressed: () => {
                        button.style = undefined;
                        toolbar2.style = undefined;
                    }
                })
            ]
        });
        let button = new Ui.Button().assign({
            resizable: true,
            icon: 'exit', text: 'click me', orientation: 'horizontal',
            verticalAlign: 'center', horizontalAlign: 'center',
            onpressed: () => Ui.Toast.send('button pressed')
        });
        this.content = new Ui.VBox().assign({
            content: [
                new Ui.ToolBar().assign({
                    content: [
                        new Ui.Button().assign({
                            text: 'vertical',
                            onpressed: () => button.orientation = 'vertical'
                        }),
                        new Ui.Button().assign({
                            text: 'horizontal',
                            onpressed: () => button.orientation = 'horizontal'
                        }),
                        new Ui.Button().assign({
                            text: 'text',
                            onpressed: () => {
                                button.text = 'click me';
                                button.icon = undefined;
                            }
                        }),
                        new Ui.Button().assign({
                            text: 'icon',
                            onpressed: () => {
                                button.text = undefined;
                                button.icon = iconName;
                            }
                        }),
                        new Ui.Button().assign({
                            text: 'text + icon',
                            onpressed: () => {
                                button.text = 'click me';
                                button.icon = iconName;
                            }
                        }),
                        new Ui.Button().assign({
                            text: 'enable',
                            onpressed: () => button.enable()
                        }),
                        new Ui.Button().assign({
                            text: 'disable',
                            onpressed: () => button.disable()
                        }),
                        new Ui.Button().assign({
                            text: 'badge',
                            onpressed: () => button.badge = '12'
                        }),
                        new Ui.Button().assign({
                            text: 'marker',
                            onpressed: () => {
                                button.marker = new Ui.Icon({
                                    verticalAlign: 'center', horizontalAlign: 'center',
                                    icon: 'arrowbottom', width: 16, height: 16, marginRight: 5
                                });
                            }
                        }),
                        new Ui.Button().assign({
                            text: '200 width',
                            onpressed: () => button.width = 200
                        }),
                        new Ui.Button().assign({
                            text: 'auto width',
                            onpressed: () => button.width = undefined
                        })
                    ]
                }),
                toolbar2,
                button
            ]
        });
        for (let i = 0; i < App.buttonStyles.length; i++) {
            let style = App.buttonStyles[i];
            let styleButton = new Ui.Button().assign({
                text: style.name,
                onpressed: (e) => {
                    button.style = e.target['Test.App.styleDef'];
                }
            });
            styleButton['Test.App.styleDef'] = style.style;
            styleButton.style = styleButton['Test.App.styleDef'];
            toolbar2.append(styleButton);
        }
        ;
    }
}
App.buttonStyles = [
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
            backgroundBorder: Ui.Color.createFromHsl(197, 1, 0.4),
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
];
new App();
