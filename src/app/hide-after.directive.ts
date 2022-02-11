import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

class HideAfterDirectiveContext {
  get $implicit(): any {
    return this.appHideAfter;
  }

  appHideAfter: number = 0;
  counter: number = 0;
}

@Directive({
  selector: '[appHideAfter]'
})
export class HideAfterDirective implements OnInit {
  @Input('appHideAfter')
  set delay(delay: number | null) {
    this._delay = delay ?? 0;
    this._context.appHideAfter = this._context.counter = this._delay / 1000;
  }


  @Input('appHideAfterThen')
  placeholder: TemplateRef<any> | null = null;

  private _delay: number = 0;
  private _context: HideAfterDirectiveContext = new HideAfterDirectiveContext();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) { }

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.templateRef, this._context);

    const intervalId = setInterval(() => {
      this._context.counter--;
    }, 1000);

    setTimeout(() => {
      this.viewContainerRef.clear();

      if ( this.placeholder ) {
        this.viewContainerRef.createEmbeddedView(this.placeholder);
      }

      clearInterval(intervalId);
    }, this._delay);
  }

  static ngTemplateContextGuard(dir: HideAfterDirective, ctx: any): ctx is HideAfterDirectiveContext {
    return true;
  }

}
