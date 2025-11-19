import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../app.config';
import { AdminDto } from '../../models/dto/admin/admin.dto';
import { MensajeDto } from '../../models/dto/mensaje.dto';

/**
 * @injectable
 * @description Servicio de Angular para interactuar con los recursos de la entidad Administrador (Admin)
 * en el backend.
 *
 * Proporciona métodos para realizar operaciones de consulta específicas de los administradores.
 */
@Injectable({
  providedIn: 'root', // El servicio está disponible en toda la aplicación.
})
export class AdminService {
  // URL base del backend
  private apiUrl = `${API_URL.baseUrl}/api/admin`;

  /**
   * @constructor
   * @param http Cliente HTTP de Angular inyectado para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * @method obtenerAdminPorId
   * @description Envía una petición GET al backend para obtener la información básica de un administrador.
   *
   * Este endpoint requiere el rol 'ADMIN' en el backend.
   *
   * @param idAdmin ID único del administrador a consultar.
   * @returns Un {@link Observable} que emite la respuesta del backend, tipificada como {@link MensajeDto}
   * que contiene el objeto {@link AdminDto}.
   */
  obtenerAdminPorId(idAdmin: number): Observable<MensajeDto<AdminDto>> {
    return this.http.get<MensajeDto<AdminDto>>(`${this.apiUrl}/${idAdmin}`);
  }
}
