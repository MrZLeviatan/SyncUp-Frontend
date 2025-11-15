import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs'; // Necesitamos 'throwError' y tipar la salida de 'catchError'.
import { ToastService } from '../../../components/toast/toast.service';

/**
 * @description
 * Interceptor HTTP funcional que escucha todas las respuestas de la API.
 * Su principal función es manejar errores (status codes 4xx y 5xx) y mostrar
 * notificaciones 'toast' al usuario utilizando el {@link ToastService}.
 *
 * Se asume que los errores del backend devuelven un objeto con la estructura:
 * `{ error: true, mensaje: string }`.
 *
 * @param {HttpRequest<unknown>} req - La solicitud saliente.
 * @param {HttpHandlerFn} next - La función para manejar la siguiente operación.
 * @returns {Observable<HttpEvent<unknown>>} Observable que emite la respuesta HTTP.
 */
export const HttpToastInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  // Inyecta el servicio de notificaciones.
  const toastService = inject(ToastService);

  // Pasa la solicitud a la siguiente etapa de la cadena y aplica el operador 'pipe'.
  return next(req).pipe(
    // El operador 'catchError' intercepta cualquier error emitido por la solicitud HTTP.
    catchError((err) => {
      // Intenta acceder al cuerpo del error, donde se espera la respuesta del backend.
      const body = err.error;

      // Lógica de manejo de errores:
      // Solo mostramos toast si el backend envía la estructura de error esperada:
      if (body && 'error' in body && body.error && 'mensaje' in body) {
        // Si el formato es correcto, muestra el mensaje específico del backend.
        toastService.show(body.mensaje, 'error');
      } else {
        // Si el error no tiene el formato esperado (ej. error de red, 500 genérico sin cuerpo),
        // muestra un mensaje de error genérico.
        toastService.show('Ocurrió un error inesperado', 'error');
      }

      // Es crucial re-lanzar el error (throwError) para que el componente que realizó la
      // llamada original pueda manejarlo si es necesario (ej. actualizar formularios o estado).
      return throwError(() => err);
    })
  );
};
