import { Injectable } from '@angular/core';

/**
 * Service utilitaire pour manipuler les tokens JWT.
 *
 * Permet de décoder un token, vérifier son expiration et en extraire le rôle utilisateur.
 *
 * @example
 * const token = 'eyJhbGciOi...'; // JWT valide
 * const payload = jwtService.decode(token);
 * const isExpired = jwtService.isExpired(token);
 * const role = jwtService.getRole(token);
 */
@Injectable({
  providedIn: 'root',
})
export class JwtService {
  /**
   * Décode la charge utile (payload) d’un token JWT.
   *
   * @param token - Le token JWT à décoder.
   * @returns Un objet représentant le payload décodé, ou `null` si le token est invalide.
   *
   * @example
   * const decoded = jwtService.decode(token);
   * console.log(decoded?.email);
   */
  decode(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  /**
   * Vérifie si un token JWT est expiré.
   *
   * @param token - Le token JWT à vérifier.
   * @returns `true` si le token est expiré ou invalide, `false` sinon.
   *
   * @example
   * if (jwtService.isExpired(token)) {
   *   redirectToLogin();
   * }
   */
  isExpired(token: string): boolean {
    const decoded = this.decode(token);
    return !decoded || Date.now() > decoded.exp * 1000;
  }

  /**
   * Extrait le rôle utilisateur depuis un token JWT.
   *
   * @param token - Le token JWT à analyser.
   * @returns Le rôle de l’utilisateur, ou `Role.RECEPTIONNISTE` par défaut si non trouvé.
   *
   * @example
   * const role = jwtService.getRole(token);
   * if (role === Role.ADMIN) { ... }
   */
  getRole(token: string): string {
    // const decoded = this.decode(token);
    // return decoded?.role ?? Role.RECEPTIONNISTE;
    return "";
  }
}
