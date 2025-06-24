
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupérer le token depuis le SessionStorage
    const token = sessionStorage.getItem('token');


    console.log("auth interceptor", token)

    // Vérifier si un token est disponible
    if (token) {
      // Cloner la requête et y ajouter le token dans les headers
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Passer la requête modifiée à la suite du processus
    return next.handle(req);
  }
}
