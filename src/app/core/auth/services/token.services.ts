import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

/**
 * @description
 * Servicio encargado de la gestión, almacenamiento, obtención, decodificación y
 * extracción de información clave (rol, ID, username) del token JWT en el almacenamiento local (localStorage).
 *
 * @export
 * @class TokenService
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  /**
   * @description
   * Clave usada para almacenar el token en localStorage.
   * @private
   * @readonly
   */
  private readonly TOKEN_KEY = 'token';

  /**
   * @description
   * Almacena el token JWT proporcionado en el almacenamiento local del navegador.
   *
   * @param {string} token - El token JWT a guardar.
   */
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * @description
   * Recupera el token JWT desde el almacenamiento local.
   *
   * @returns {string | null} El token JWT si existe, o `null` en caso contrario.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * @description
   * Decodifica el token para extraer y retornar el rol del usuario.
   *
   * @returns {string | null} El valor del claim 'rol' o `null` si no hay token o la decodificación falla.
   */
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Utiliza la librería jwt-decode para decodificar el payload.
      const decoded: any = jwtDecode(token);
      // Retorna el valor del claim 'rol'.
      return decoded.rol || null;
      // Si se encuentra algun error en el valor del claim
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }

  /**
   * @description
   * Decodifica el token para extraer y retornar el username del usuario.
   *
   * @returns {string | null} El valor del claim 'username' o `null` si no hay token o la decodificación falla.
   */
  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    // Usa el método interno decodeToken para obtener el payload.
    const decode: any = this.decodeToken(token);
    return decode ? decode.username : null;
  }

  /**
   * @description
   * Intenta extraer el ID del usuario del token JWT, buscando en claims comunes ('id', 'userId', 'sub').
   *
   * @returns {number | null} El ID del usuario como número, o `null` si no se encuentra o hay un error.
   */
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Divide el token JWT (header.payload.signature) y toma el payload (índice 1).
      const payload = token.split('.')[1];
      // Decodifica la base64 del payload y lo parsea a objeto JSON.
      const decoded = JSON.parse(atob(payload));
      // Retorna el ID, buscando en claims comunes utilizados por diferentes servidores JWT.
      return decoded.id || decoded.userId || decoded.sub || null;
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  /**
   * @description
   * Decodifica manualmente el payload (la segunda parte) de un token JWT.
   * *Nota: Usa {@link jwtDecode} para una decodificación más robusta cuando la validación no es crítica.*
   *
   * @param {string} token - El token JWT.
   * @returns {*} El objeto payload decodificado, o `null` si falla.
   */
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      // 'atob' es la función nativa para decodificar Base64.
      return JSON.parse(atob(payload));
    } catch (e) {
      // Captura cualquier error (ej. token mal formado) y retorna null.
      return null;
    }
  }

  /**
   * @description
   * Función de depuración para mostrar el contenido completo del token decodificado
   * en la consola del navegador, útil para desarrollo.
   */
  debugDecodedToken(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      // Usa la función de librería para una decodificación segura.
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Token decodificado:', decoded);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }
}
