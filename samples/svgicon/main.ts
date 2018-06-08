/// <reference path="../../era/era.d.ts" />

Ui.SVGIcon.baseUrl = 'icons/';

new Ui.App().assign({
    content: new Ui.HBox().assign({
        horizontalAlign: 'center', verticalAlign: 'center', spacing: 10,
        content: [
            new Ui.SVGIcon().assign({ width: 64, height: 64, icon: 'bell', fill: 'green' }),
            new Ui.SVGIcon().assign({ width: 64, height: 64, icon: 'add-person', fill: 'red' }),
            new Ui.SVGIcon().assign({ width: 64, height: 64, icon: 'backarrow', fill: 'blue' })
        ]
    })
})

