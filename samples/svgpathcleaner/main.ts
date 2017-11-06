/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    pathTextField: Ui.TextAreaField;
    cleanedPathTextField: Ui.TextAreaField;
    statusLabel: Ui.Label;
    sourceIcon: Ui.Shape;
    destIcon: Ui.Shape;
    scaleField: Ui.TextField;
    decimalField: Ui.TextField;

    constructor() {
        super();

        let vbox = new Ui.VBox();
        vbox.padding = 10; vbox.spacing = 10;
		this.setContent(vbox);

        let text = new Ui.Text();
        text.text = 'Icon SVG path';
		vbox.append(text);

		let hbox = new Ui.HBox();
		vbox.append(hbox, true);

		let scroll = new Ui.ScrollingArea();
		hbox.append(scroll, true);

		this.pathTextField = new Ui.TextAreaField();
		this.connect(this.pathTextField, 'change', this.onPathTextFieldChanged);
		scroll.setContent(this.pathTextField);

        this.sourceIcon = new Ui.Shape();
        this.sourceIcon.width = 192;
        this.sourceIcon.height = 192;
        this.sourceIcon.scale = 4;
		hbox.append(this.sourceIcon);

		hbox = new Ui.HBox();
		vbox.append(hbox);

        let button = new Ui.Button();
        button.setText('Clean');
		this.connect(button, 'press', this.onCleanPressed);
		hbox.append(button);

        this.decimalField = new Ui.TextField();
        this.decimalField.width = 40;
        this.decimalField.value = '2';
		hbox.append(this.decimalField);

        this.scaleField = new Ui.TextField();
        this.scaleField.width = 40;
        this.scaleField.value = '1';
		hbox.append(this.scaleField);

        hbox = new Ui.HBox();
        hbox.spacing =10;
		vbox.append(hbox, true);

		scroll = new Ui.ScrollingArea();
		hbox.append(scroll, true);

        this.cleanedPathTextField = new Ui.TextAreaField();
        this.cleanedPathTextField.setDisabled(true);
		scroll.setContent(this.cleanedPathTextField);

        this.destIcon = new Ui.Shape();
        this.destIcon.width = 192;
        this.destIcon.height = 192;
        this.destIcon.scale = 4;
		hbox.append(this.destIcon);

		this.statusLabel = new Ui.Label();
		vbox.append(this.statusLabel);
	}

	testPath(path: string) {
		let svgDrawing = document.createElementNS(svgNS, 'svg') as SVGSVGElement;
		let ctx = new Core.SVG2DContext(svgDrawing);
		try {
			ctx.svgPath(path);
		}
		catch(e) {
			return false;
		}
		return true;
	}

	onPathTextFieldChanged() {
		let path = this.pathTextField.value;
		if(this.testPath(path)) {
			this.sourceIcon.fill = undefined;
			this.sourceIcon.path = path;
		}
		else {
			this.sourceIcon.fill = 'red';
			this.sourceIcon.path = Ui.Icon.getPath('deny');
		}
	}

	onCleanPressed() {
		let svgParser = new Ui.SvgParser(this.pathTextField.value);
		let lastIsValue = false;
		let lastCmd = '';
		let res = '';
		svgParser.next();
		while(!svgParser.isEnd()) {
			if(svgParser.isCmd()) {
				if(svgParser.getCmd() !== lastCmd) {
					res += svgParser.getCmd();
					lastCmd = svgParser.getCmd();
					lastIsValue = false;
				}
			}
			else {
				let roundScale = Math.pow(10, parseInt(this.decimalField.value));

				let valNum = Math.round(svgParser.getCurrent() * parseInt(this.scaleField.value) * roundScale);
				let val = (valNum / roundScale).toString();

				if(val.substring(0,2) === '0.')
					val = '.'+val.substring(2);
				if(val.substring(0,3) === '-0.')
					val = '-.'+val.substring(3);
				if((val[0] !== '-') && (lastIsValue))
					res += ' ';
				res += val;
				lastIsValue = true;
			}
			svgParser.next();
		}
		this.cleanedPathTextField.value = res;

		if(this.testPath(res)) {
			this.destIcon.fill = undefined;
			this.destIcon.path = res;
		}
		else {
			this.destIcon.fill = 'red';
			this.destIcon.path = Ui.Icon.getPath('deny');
		}

		let ratio = res.length / this.pathTextField.value.length;
		this.statusLabel.text = 'ratio: '+Math.round(ratio * 100)+'%, saved: '+(100-Math.round(ratio * 100))+'%';
	}
}

new App();