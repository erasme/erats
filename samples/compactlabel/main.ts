/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

let compactlabel = new Ui.CompactLabel();
compactlabel.verticalAlign = Ui.VerticalAlign.center;
compactlabel.horizontalAlign = Ui.HorizontalAlign.center;
compactlabel.textAlign = 'center';
compactlabel.maxLine = 4;
compactlabel.width = 100;
compactlabel.text = `very long piece of text withsuperunsplittedword to see
 what happend when text is too long really too long`;

app.setContent(compactlabel);
