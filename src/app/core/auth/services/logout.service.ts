import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../layouts/public/avisos/toast.service';

/**
 * @description
 * Servicio encargado de gestionar el proceso de cierre de sesión del usuario.
 *
 * Se ocupa de:
 * 1. Limpiar las credenciales de autenticación (token) del almacenamiento local.
 * 2. Redirigir al usuario a la página de inicio/login.
 * 3. Notificar al usuario sobre el éxito del cierre de sesión.
 *
 * @export
 * @class LogoutService
 */
@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  /**
   * @param {Router} router - Router de Angular para la navegación.
   * @param {ToastService} toastr - Servicio para mostrar notificaciones de éxito/error al usuario.
   */
  constructor(private router: Router, private toastr: ToastService) {}

  /**
   * @description
   * Ejecuta el proceso completo de cierre de sesión.
   *
   * Realiza la limpieza del almacenamiento, la redirección y la notificación.
   */
  logout(): void {
    // --- 1. Limpiar la sesión y el token ---

    // Borra todas las claves en el localStorage, asegurando que no quede ningún dato sensible o de sesión.
    localStorage.clear();

    // Línea de seguridad adicional: asegura que la clave específica del token sea eliminada.
    // Dependerá de la clave que se use en TokenService (ej: 'token' o 'authToken').
    localStorage.removeItem('token');

    // --- 2. Redirigir al login o página de inicio ---

    // Navega a la ruta raíz ('/'). El flag 'replaceUrl: true' reemplaza la URL actual
    // en el historial del navegador para que el usuario no pueda volver a la página protegida
    // con el botón de atrás.
    this.router.navigate(['/'], { replaceUrl: true });

    // Desplaza la vista al inicio de la página para una mejor experiencia de usuario.
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // --- 3. Notificación de éxito ---
    // Muestra un mensaje de éxito al usuario usando el servicio de notificaciones.
    this.toastr.show('Cierre de sesión exitoso.', 'success');
  }
}
