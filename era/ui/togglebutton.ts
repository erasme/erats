namespace Ui {

    export class ToggleButton extends Button {
        private _isToggled = false;
        readonly toggled = new Core.Events<{ target: ToggleButton }>();
        set ontoggled(value: (event: { target: ToggleButton }) => void) { this.toggled.connect(value); }
        readonly untoggled = new Core.Events<{ target: ToggleButton }>();
        set onuntoggled(value: (event: { target: ToggleButton }) => void) { this.untoggled.connect(value); }

        constructor() {
            super();
            this.role = 'checkbox';
            this.drawing.setAttribute('aria-checked', 'false');
            this.pressed.connect(() => this.onToggleButtonPress());
        }

        get isToggled(): boolean {
            return this._isToggled;
        }

        set isToggled(value: boolean) {
            if (value)
                this.onToggle();
            else
                this.onUntoggle();
        }

        protected onToggleButtonPress(): void  {
            if (!this.isToggled)
                this.onToggle();
            else
                this.onUntoggle();
        }

        protected onToggle(): void  {
            if (!this.isToggled) {
                this._isToggled = true;
                this.isActive = true;
                this.drawing.setAttribute('aria-checked', 'true');
                this.toggled.fire({ target: this });
            }
        }

        protected onUntoggle(): void  {
            if (this.isToggled) {
                this._isToggled = false;
                this.isActive = false;
                this.drawing.setAttribute('aria-checked', 'false');
                this.untoggled.fire({ target: this });
            }
        }

        toggle(): void {
            this.onToggle();
        }

        untoggle(): void  {
            this.onUntoggle();
        }
    }
}
