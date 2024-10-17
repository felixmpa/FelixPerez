import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../shared/navbar/navbar.component";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {ProductRegistrationValidators} from '../../shared/validator/product-registration.validators';
import {ProductService} from '../../../../services/product.service';
import {Product} from '../../../../interfaces/product';
import {NotificationComponent} from '../../shared/notification/notification.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgIconComponent, provideIcons} from '@ng-icons/core';
import {heroArrowUturnLeft} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NotificationComponent,
    NgIconComponent,
    RouterLink
  ],
  viewProviders: [provideIcons({heroArrowUturnLeft})],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss'
})
export class ProductsFormComponent implements OnInit {

  productRegistration!: FormGroup;
  formSubmitted: boolean = false;
  formSubmittedMessage: string = '';
  formSubmittedStatus: 'success' | 'error' = 'success';
  isEditMode: boolean = false;
  productId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productRegistrationValidators: ProductRegistrationValidators,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.prepareProductForEditMode();

    this.prepareProductRegistrationValidator();

    this.onDateReleaseChange();

    this.productRegistration.get('date_revision')?.setValidators([
      Validators.required,
      ProductRegistrationValidators.dateOneYearAfterReleaseValidator(this.productRegistration.get('date_release')!)
    ]);
  }

  prepareProductForEditMode() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if(this.productId) {
        this.isEditMode = true;
        this.productService.getProductById(this.productId).then(product => {
          if(product) {
            this.disableInput(['id'])
            this.productRegistration.patchValue(product);
          }
        }).catch(err => {
          this.formSubmittedMessage = 'Disculpe, producto no encontrado.';
          this.formSubmittedStatus = 'error';
          console.error('Something went wrong:', err);
        })
      }
    })
  }

  prepareProductRegistrationValidator() {
    this.productRegistration = this.formBuilder.group({
      id: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ],[
        ProductRegistrationValidators.productIdExistsValidator(this.productService)
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]),
      logo: new FormControl('', [
        Validators.required,
        Validators.pattern('^(https?|http):\\/\\/.+')
      ]),
      date_release: new FormControl('', [
        Validators.required,
        ProductRegistrationValidators.dateAfterTodayValidator()
      ]),
      date_revision: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ])
    })
  }

  isFieldInvalid(name: string): boolean | null {
    const control = this.productRegistration.controls[name];
    return control.invalid && (control.touched || this.formSubmitted) && !control.pending;
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.productRegistration.valid) {
      this.enableInput(['id','date_revision']);
      const product = this.productRegistration.value as Product;

      if(this.isEditMode && this.productId) {
        this.updateProduct(product);
        this.disableInput(['id','date_revision']);
      }else{
        this.createProduct(product)
        this.disableInput(['date_revision']);
      }

    }
  }


  createProduct(product: Product) {
    this.productService.createProduct(product).then(response => {
      this.formSubmittedMessage = '¡Registro exitoso! Para editar o visualizar su producto, regrese a la lista.';
      this.formSubmittedStatus = 'success';
      this.resetForm();
    }).catch(err => {
      this.formSubmittedMessage = 'Disculpe, ocurrió un error al procesar su registro.';
      this.formSubmittedStatus = 'error';
      console.error('Something went wrong:', err);
    })
  }

  updateProduct(product: Product) {
    this.productService.updateProduct(product).then(response => {
      this.formSubmittedMessage = '¡Actualización exitosa! El producto ha sido editado correctamente.';
      this.formSubmittedStatus = 'success';
    }).catch(err => {
      this.formSubmittedMessage = 'Error al actualizar el producto.';
      this.formSubmittedStatus = 'error';
      console.error('Something went wrong:', err);
    })
  }


  resetForm() {
    this.productRegistration.reset();
    this.formSubmitted = false;
  }

  showFieldCustomError(name: string): string {

    const control = this.productRegistration.controls[name];

    if (!control || !control.errors) {
      if (control?.pending) {
        return 'Validating...';  // Show a message while the async validator is running
      }
      return '';
    }

    const errors = control.errors;

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido.';
        case 'minlength':
          const requiredLength = errors['minlength'].requiredLength;
          return `El campo debe tener al menos ${requiredLength} caracteres.`;
        case 'maxlength':
          const maxLength = errors['maxlength'].requiredLength;
          return `El campo no debe exceder los ${maxLength} caracteres.`;
        case 'pattern':
          return 'El enlace (URL) no es válido.';
        case 'dateBeforeToday':
          return 'La fecha de liberación debe ser igual o mayor a la fecha actual.';
        case 'dateBeforeOneYear':
          return 'La fecha de revisión debe ser al menos 1 año posterior de la fecha de liberación.';
        case 'productIdExists':
          return 'El ID del producto ya existe.';
        default:
          return '';
      }
    }
    return '';
  }

  onDateReleaseChange() {
    const dateReleaseControl = this.productRegistration.get('date_release');

    if (dateReleaseControl) {
      dateReleaseControl.valueChanges.subscribe((releaseDate: any) => {
        if (releaseDate) {
          const releaseDateValue = new Date(releaseDate);

          // Add 1 year to the release date
          const revisionDate = new Date(releaseDateValue);
          revisionDate.setFullYear(revisionDate.getFullYear() + 1);

          // Format the date as 'YYYY-MM-DD' and set it in the date_revision control
          const formattedRevisionDate = revisionDate.toISOString().split('T')[0];
          this.productRegistration.get('date_revision')?.setValue(formattedRevisionDate, { emitEvent: false });

          this.productRegistration.get('date_revision')?.markAsTouched();
        }
      });
    }
  }


  toggleInputState(names: string[], enable: boolean) {
    names.forEach(name => {
      const control = this.productRegistration.get(name);
      if (control) {
        enable ? control.enable() : control.disable();
      }
    });
  }

  enableInput(names: string[]) {
    this.toggleInputState(names, true);
  }

  disableInput(names: string[]) {
    this.toggleInputState(names, false);
  }

}
