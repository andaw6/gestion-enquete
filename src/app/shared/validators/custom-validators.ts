import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';

      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

      return !passwordValid ? {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasSpecialChar
        }
      } : null;
    };
  }

  static matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceControl = control.root.get(matchTo);

      if (sourceControl && control.value !== sourceControl.value) {
        return { mismatch: true };
      }

      return null;
    };
  }

  static dateNotInPastValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const inputDate = new Date(control.value);
      const now = new Date();
      now.setHours(0, 0, 0, 0); // On ignore l'heure

      return inputDate < now ? { dateInPast: true } : null;
    };
  }
}
