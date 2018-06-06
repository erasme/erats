namespace Ui {
    export class Fade extends Transition {

        run(current: Element, next: Element, progress: number) {
            if (current !== undefined) {
                if (progress == 1) {
                    current.hide();
                    current.opacity = 1;
                }
                else
                    current.opacity = Math.min(1, Math.max(0, 1 - progress * 3));
            }
            if (next !== undefined)
                next.opacity = progress;
        }
    }
}	

Ui.Transition.register('fade', Ui.Fade);
