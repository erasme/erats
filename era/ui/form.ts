namespace Ui {
	export interface FormInit extends LBoxInit {
	}

	export class Form extends LBox implements FormInit {
		readonly submited = new Core.Events<{ target: Form }>();

		constructor(init?: FormInit) {
			super(init);
			this.drawing.addEventListener('submit', (e) => this.onSubmit(e));
		}
	
		protected onSubmit(event) {
			event.preventDefault();
			event.stopPropagation();
			this.submited.fire({ target: this });
		}

		submit() {
			this.drawing.submit();
		}

		renderDrawing() {
			let drawing;
			drawing = document.createElement('form');

			// create an input type submit button. Else
			// the form might never raise submit event
			let submit = document.createElement('input');
			submit.type = 'submit';
			submit.style.visibility = 'hidden';
			drawing.appendChild(submit);

			let container = document.createElement('div');
			this.containerDrawing = container;
			drawing.appendChild(container);
			return drawing;
		}
	}
}	
