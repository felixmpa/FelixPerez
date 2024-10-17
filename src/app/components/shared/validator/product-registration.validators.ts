import {AbstractControl, ValidationErrors, AsyncValidatorFn, ValidatorFn} from '@angular/forms';
import { Injectable } from '@angular/core';
import {from, map, Observable, of} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {ProductService} from '../../../../services/product.service';

/**
 * Custom Class Validator to Product Registration Form
 */
@Injectable({
  providedIn: 'root'
})
export class ProductRegistrationValidators {

  /**
   * Static validator to check if the product ID already exists
   * @param productService - Injected ProductService instance
   */
  public static productIdExistsValidator(productService: ProductService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const productId = control.value;

      // If no product ID is entered, don't trigger the validation error
      if (!productId) {
        return of(null);
      }

      return from(productService.getProductById(productId)).pipe(
        map(() => ({ productIdExists: true })),  // If product is found, return validation error
        catchError(() => of(null))  // Return null for 404 or any other error
      );
    };
  }



  /**
   * Validator to check if the revision date is at least one year after the release date
   */
  public static dateAfterTodayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      return selectedDate >= currentDate ? null : { dateBeforeToday: true };
    };
  }


  /**
   * Validator to check if the revision date is at least one year after the release date
   * @dateReleaseControl: AbstractControl)
   */
  public static dateOneYearAfterReleaseValidator(dateReleaseControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const releaseDate = new Date(dateReleaseControl.value);
      const revisionDate = new Date(control.value);

      // Set the release date + 1 year for comparison
      const minRevisionDate = new Date(releaseDate);
      minRevisionDate.setFullYear(releaseDate.getFullYear() + 1);

      return revisionDate >= minRevisionDate ? null : { dateBeforeOneYear: true };
    };
  }

}
