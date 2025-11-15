import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../../core/auth/services/token.services';

/**
 * @description
 * Servicio encargado de la lógica de negocio post-login. Su función principal
 * es validar la existencia y la expiración del token de autenticación
 * y redirigir al usuario a la ruta correspondiente basada en su rol.
 *
 * @export
 * @class ValidadorLoginService
 */
@Injectable({
  providedIn: 'root',
})
export class ValidadorLoginService {
  /**
   * @param {TokenService} tokenService - Servicio para acceder y decodificar el token JWT.
   * @param {Router} router - Router de Angular para la navegación programática.
   */
  constructor(private tokenService: TokenService, private router: Router) {}

  /**
   * @description
   * Implementa la lógica de redirección post-autenticación.
   *
   * Realiza los siguientes pasos:
   * 1. Obtiene el token. Si no existe, redirige al inicio.
   * 2. Decodifica el token y verifica la presencia de datos esenciales (rol, expiración).
   * 3. Valida si el token ha expirado. Si es así, redirige al inicio.
   * 4. Almacena el rol del usuario en el {@code localStorage}.
   * 5. Redirige a la ruta específica según el rol (ADMIN, USUARIO, o inicio por defecto).
   */
  redirigirSegunRol(): void {
    // 1. Obtiene el token almacenado.
    const token = this.tokenService.getToken();

    if (!token) {
      this.router.navigate(['/']); // Redirige al inicio si no hay token.
      return;
    }

    // 2. Decodifica el token para extraer claims (rol, expiración, etc.).
    const decoded: any = this.tokenService.decodeToken(token);

    // Verifica que la decodificación sea exitosa y que contenga claims necesarios.
    if (!decoded || !decoded.rol || !decoded.exp) {
      this.router.navigate(['/']); // Redirige si el token está incompleto o malformado.
      return;
    }

    // 3. Validar expiración del token
    const ahora = Math.floor(Date.now() / 1000); // Tiempo actual en segundos (Unix timestamp).

    // Comprueba si el tiempo de expiración (exp) es menor o igual al tiempo actual.
    if (decoded.exp <= ahora) {
      this.router.navigate(['/']); // Redirige si el token ha expirado.
      return;
    }

    // 4. Guardar rol en el localStorage para acceso rápido en otras partes de la app.
    localStorage.setItem('rolUsuario', decoded.rol);

    // 5. Redirigir según rol (utilizando el rol decodificado)
    switch (decoded.rol) {
      case 'ROLE_USUARIO':
        this.router.navigate(['/usuario']); // Redirige a la ruta de usuario estándar.
        break;
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin']); // Redirige a la ruta de administrador.
        break;
      default:
        this.router.navigate(['/']); // Ruta por defecto si el rol no es reconocido.
    }
  }
}
