import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[appEntityTemplate]',
  standalone: true,
})
export class EntityTemplateDirective<T = unknown> {
  constructor(public readonly template: TemplateRef<any>) {}

  // Indice de type (compile-time uniquement, aucune logique runtime)
  // Ex.: [appEntityTemplate]="(null as Vehicule | null)"
  @Input('appEntityTemplate') set typeHint(_: T | null) {}

  // ➜ Indique à Angular que le contexte du template est {$implicit: T | null}
  static ngTemplateContextGuard<T>(
    _dir: EntityTemplateDirective<T>,
    ctx: unknown
  ): ctx is { $implicit: T | null } {
    return true;
  }
}
