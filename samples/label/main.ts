/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Label, the simplest text element
//

new Ui.App().assign({
    content: new Ui.Label().assign({
        text: 'hello world',
        verticalAlign: 'center',
        horizontalAlign: 'center'
    })
});

