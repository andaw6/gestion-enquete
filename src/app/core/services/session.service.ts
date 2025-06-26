import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // Méthode pour stocker les données
  saveData(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  // Méthode pour récupérer les données
  getData<T>(key: string): T | null {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) as T : null;
  }

  // Méthode pour supprimer les données
  clearData(key: string): void {
    sessionStorage.removeItem(key);
  }
}
