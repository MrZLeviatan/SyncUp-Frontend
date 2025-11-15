import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.services';

/**
 * @description
 * Guardian de ruta que implementa {@link CanActivate} para proteger rutas
 * y asegurar que solo usuarios con un token JWT válido y no expirado puedan acceder a ellas.
 *
 * @see {@link TokenService}
 * @export
 * @class AuthGuard
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   * @param {TokenService} tokenService - Servicio encargado de manejar y validar el token JWT.
   * @param {Router} router - Router de Angular para realizar redirecciones.
   */
  constructor(private tokenService: TokenService, private router: Router) {}

  /**
   * @description
   * Método principal del guard que se ejecuta antes de activar una ruta.
   *
   * 1. Verifica la presencia del token.
   * 2. Decodifica el token y verifica su tiempo de expiración (exp).
   * 3. Si el token es inválido o ha expirado, redirige a la ruta raíz ('/').
   *
   * @returns {boolean | UrlTree} Retorna `true` si la ruta puede ser activada, o un {@link UrlTree} para redirigir.
   */
  canActivate(): boolean | UrlTree {
    // Intenta obtener el token JWT almacenado.
    const token = this.tokenService.getToken();

    // --- 1. Verificación de presencia del token ---
    if (!token) {
      console.warn('Token ausente. Redirigiendo a inicio.');
      // Si el token no existe, crea un UrlTree para forzar la redirección a la ruta raíz.
      return this.router.createUrlTree(['/']);
    }

    // --- 2. Decodificación y Verificación de Expiración (EXP) ---
    // Decodifica el token para acceder a sus claims.
    const decoded: any = this.tokenService.decodeToken(token);
    // Obtiene el tiempo actual en segundos UNIX (formato estándar de 'exp').
    const ahora = Math.floor(Date.now() / 1000);

    // Comprueba:
    // a) Si la decodificación falló (!decoded).
    // b) Si el claim de expiración 'exp' no existe (!decoded.exp).
    // c) Si el tiempo actual es mayor o igual al tiempo de expiración (decoded.exp <= ahora).
    if (!decoded || !decoded.exp || decoded.exp <= ahora) {
      console.warn('Token inválido o expirado. Redirigiendo a inicio.');
      // Si el token no es válido o está expirado, redirige a la ruta raíz.
      return this.router.createUrlTree(['/']);
    }

    // --- 3. Acceso Permitido ---
    // Si todas las verificaciones pasan, permite el acceso a la ruta.
    return true;
  }
}
