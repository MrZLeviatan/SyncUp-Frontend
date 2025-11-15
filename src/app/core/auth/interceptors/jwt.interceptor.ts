import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.services';

/**
 * @description
 * Interceptor funcional que se encarga de interceptar
 * todas las solicitudes HTTP salientes y automáticamente adjuntar el token JWT
 * de autenticación en el encabezado `Authorization`.
 *
 * Esto es esencial para acceder a recursos protegidos en el backend.
 *
 * @param {HttpRequest<unknown>} req - La solicitud HTTP saliente a interceptar.
 * @param {HttpHandlerFn} next - La función para manejar la siguiente operación en la cadena de interceptores.
 * @returns {Observable<HttpEvent<unknown>>} Un observable que emite el evento de respuesta HTTP.
 */
export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyecta el servicio TokenService usando la función `inject()` de Angular.
  const tokenService = inject(TokenService);
  // Obtiene el token JWT del almacenamiento local.
  const token = tokenService.getToken();

  // Verifica si un token válido está presente.
  if (token) {
    // Clona la solicitud original para poder modificarla (las peticiones HTTP son inmutables).
    const authReq = req.clone({
      // Establece los nuevos encabezados.
      setHeaders: {
        // Añade el encabezado 'Authorization' con el esquema 'Bearer'.
        Authorization: `Bearer ${token}`,
      },
    });
    // Envía la solicitud CLONADA (con el token) a la cadena de interceptores siguiente.
    return next(authReq);
  }

  // Si no hay token, simplemente pasa la solicitud original sin modificar.
  return next(req);
};
