import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkModeSubject.asObservable();

  // Méthode pour changer le mode
  toggleDarkMode() {
    this.darkModeSubject.next(!this.darkModeSubject.value);
  }

  toggleTheme(){
    this.toggleDarkMode()
    localStorage.setItem("mode", this.getValue() ? "dark" : "light");
    if (this.getValue()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setValue(value: boolean) {
    this.darkModeSubject.next(value);
  }

  getValue(): boolean {
    return this.darkModeSubject.value;
  }
}
