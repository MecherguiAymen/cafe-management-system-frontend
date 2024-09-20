import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ModalComponent } from './modal.component';
import { Options } from './modal-options';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  newModalComponent!: ComponentRef<ModalComponent>;
  options!: Options | undefined;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private cfr: ComponentFactoryResolver
  ) {}

  open(
    vcrOrComponent: ViewContainerRef,
    content: TemplateRef<Element>,
    options?: Options
  ): void;

  open<C>(vcrOrComponent: Type<C>, options?: Options): void;

  open<C>(
    vcrOrComponent: ViewContainerRef | Type<C>,
    param2?: TemplateRef<Element> | Options,
    options?: Options
  ) {
    if (vcrOrComponent instanceof ViewContainerRef) {
      this.openWithTemplate(vcrOrComponent, param2 as TemplateRef<Element>);
      this.options = options;
    } else {
      this.openWithComponent(vcrOrComponent);
      this.options = param2 as Options | undefined;
    }
  }

  private openWithTemplate(
    vcr: ViewContainerRef,
    content: TemplateRef<Element>
  ) {
    vcr.clear();

    const innerContent = vcr.createEmbeddedView(content);

    const factory = this.cfr.resolveComponentFactory(ModalComponent);
    this.newModalComponent = vcr.createComponent(factory, 1, this.injector, [innerContent.rootNodes]);
  }

  private openWithComponent(component: Type<unknown>) {
    const factory = this.cfr.resolveComponentFactory(component);
    const newComponent = factory.create(this.injector);

    const modalFactory = this.cfr.resolveComponentFactory(ModalComponent);
    this.newModalComponent = modalFactory.create(this.injector, [[newComponent.location.nativeElement]]);

    document.body.appendChild(this.newModalComponent.location.nativeElement);

    // Attach views to the changeDetection cycle
    this.appRef.attachView(newComponent.hostView);
    this.appRef.attachView(this.newModalComponent.hostView);
  }

  close() {
    this.newModalComponent.instance.close();
  }
}