import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../app.config';
import { UsuarioDto } from '../../models/dto/usuario/usuario.dto';
import { EditarUsuarioDto } from '../../models/dto/usuario/editar-usuario.dto';
import { EditarPasswordDto } from '../../models/dto/usuario/editar-password.dto';
import { map } from 'rxjs/operators';

/**
 * @injectable
 * @description Servicio de Angular encargado de gestionar las operaciones del perfil de un Usuario,
 * incluyendo las funcionalidades CRUD básicas, edición de contraseña y listados.
 */
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // URL base para los endpoints de usuario
  private apiUrl = `${API_URL.baseUrl}/api/usuario`;

  /**
   * @constructor
   * @param http Cliente HTTP de Angular inyectado para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * @method editarUsuario
   * @description Envía una petición PUT para actualizar la información básica del usuario (ej. el nombre).
   *
   * @param dto DTO que contiene el ID del usuario y los campos a modificar {@link EditarUsuarioDto}.
   * @returns Un {@link Observable} que emite la respuesta del backend.
   */
  editarUsuario(dto: EditarUsuarioDto): Observable<any> {
    // Petición PUT al endpoint: /api/usuario/editar
    return this.http.put(`${this.apiUrl}/editar`, dto);
  }

  /**
   * @method editarPassword
   * @description Envía una petición PUT para cambiar la contraseña de un usuario.
   *
   * Requiere el ID del usuario, la contraseña anterior para validación y la nueva contraseña.
   *
   * @param dto DTO con las credenciales necesarias para el cambio de contraseña {@link EditarPasswordDto}.
   * @returns Un {@link Observable} que emite la respuesta del backend.
   */
  editarPassword(dto: EditarPasswordDto): Observable<any> {
    // Petición PUT al endpoint: /api/usuario/editar-password
    return this.http.put(`${this.apiUrl}/editar-password`, dto);
  }

  /**
   * @method eliminarUsuario
   * @description Envía una petición DELETE para eliminar permanentemente la cuenta de un usuario.
   *
   * @param idUsuario ID único del usuario a eliminar.
   * @returns Un {@link Observable} que emite la respuesta del backend.
   */
  eliminarUsuario(idUsuario: number): Observable<any> {
    // Petición DELETE al endpoint: /api/usuario/eliminar/{idUsuario}
    return this.http.delete(`${this.apiUrl}/eliminar/${idUsuario}`);
  }

  /**
   * @method obtenerUsuarioPorId
   * @description Obtiene la información completa de un usuario utilizando su ID único.
   *
   * @param idUsuario ID del usuario a consultar.
   * @returns Un {@link Observable} que emite el objeto {@link UsuarioDto}.
   */
  obtenerUsuarioPorId(idUsuario: number): Observable<UsuarioDto> {
    // Petición GET al endpoint: /api/usuario/{idUsuario}
    return this.http.get<UsuarioDto>(`${this.apiUrl}/${idUsuario}`);
  }

  /**
   * @method obtenerUsuarioPorUsername
   * @description Obtiene la información de un usuario utilizando su nombre de usuario (username).
   *
   * @param username El nombre de usuario (string) a buscar.
   * @returns Un {@link Observable} que emite el objeto {@link UsuarioDto}.
   */
  obtenerUsuarioPorUsername(username: string): Observable<UsuarioDto> {
    // Petición GET al endpoint: /api/usuario/username/{username}
    return this.http.get<UsuarioDto>(`${this.apiUrl}/username/${username}`);
  }

  /**
   * @method listarUsuarios
   * @description Obtiene una lista de todos los usuarios registrados en el sistema.
   *
   * Este método suele estar restringido solo a administradores en el backend.
   *
   * @returns Un {@link Observable} que emite un array de {@link UsuarioDto}.
   */
  listarUsuarios(): Observable<UsuarioDto[]> {
    return this.http.get<any>(`${this.apiUrl}/listar`).pipe(
      map((resp) => resp.mensaje) // ← EXTRAEMOS SOLO LA LISTA
    );
  }
}
