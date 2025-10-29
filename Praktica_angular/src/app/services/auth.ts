import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('usuario');
  }

  getUsuario(): any {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('usuario');
  }
}
