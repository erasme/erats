/// <reference path="../../era/era.d.ts" />

new Ui.App({
    content: new Ui.Flow({
        spacing: 10,
        content: [
            new Ui.Rectangle({ width: 150, height: 150, fill: 'pink' }),
            new Ui.Rectangle({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }),
            new Ui.Rectangle({ width: 150, height: 150, fill: 'brown' }),
            new Ui.Rectangle({ width: 200, height: 15, fill: 'orange' }),
            new Ui.Rectangle({ width: 150, height: 150, fill: 'lightblue' })
        ]
    })
});

