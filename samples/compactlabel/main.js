"use strict";
/// <reference path="../../era/era.d.ts" />
new Ui.App({
    content: new Ui.CompactLabel({
        verticalAlign: 'center',
        horizontalAlign: 'center',
        textAlign: 'center',
        maxLine: 4,
        width: 100,
        text: "very long piece of text withsuperunsplittedword to see\n what happend when text is too long really too long"
    })
});
