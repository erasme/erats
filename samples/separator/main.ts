/// <reference path="../../era/era.d.ts" />

new Ui.App({
    content: new Ui.VBox({
        verticalAlign: 'center',
        horizontalAlign: 'center',
        content: [
            new Ui.Label({ text: 'first line' }),
            new Ui.Separator(),
            new Ui.Label({ text: 'second line' })
        ]
    })
});


