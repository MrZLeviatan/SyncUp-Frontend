import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../app.config';
import { UsuarioDto } from '../models/dto/usuario/usuario.dto';
import { EditarUsuarioDto } from '../models/dto/usuario/editar-usuario.dto';
import { EditarPasswordDto } from '../models/dto/usuario/editar-password.dto';
import { map } from 'rxjs/operators';
import { MensajeDto } from '../models/dto/mensaje.dto';
import { SugerenciaUsuariosDto } from '../models/dto/usuario/sugerencia-usuario.dto';
import { UsuarioConexionDto } from '../models/dto/usuario/usuario.conexion.dto';

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
    return this.http
      .get<MensajeDto<UsuarioDto>>(`${this.apiUrl}/${idUsuario}`)
      .pipe(map((resp) => resp.mensaje));
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

  /**
   * @method seguirUsuario
   * @description Permite que un usuario siga a otro enviando los IDs correspondientes.
   *
   * @param dto DTO con los IDs del usuario principal y del usuario a seguir {@link UsuarioConexionDto}.
   * @returns Un {@link Observable} que emite la respuesta del backend.
   */
  seguirUsuario(dto: UsuarioConexionDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/seguir`, dto);
  }

  /**
   * @method dejarDeSeguirUsuario
   * @description Permite que un usuario deje de seguir a otro enviando los IDs correspondientes.
   *
   * @param dto DTO con los IDs del usuario principal y del usuario a dejar de seguir {@link UsuarioConexionDto}.
   * @returns Un {@link Observable} que emite la respuesta del backend.
   */
  dejarDeSeguirUsuario(dto: UsuarioConexionDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/dejar-de-seguir`, dto);
  }

  /**
   * @method obtenerSugerencias
   * @description Obtiene sugerencias de usuarios a seguir para un usuario dado.
   *
   * @param idUsuario ID del usuario para el cual se generan las sugerencias.
   * @returns Un {@link Observable} que emite un array de {@link SugerenciaUsuariosDto}.
   */
  obtenerSugerencias(idUsuario: number): Observable<UsuarioDto[]> {
    return this.http
      .get<{ error: boolean; mensaje: SugerenciaUsuariosDto[] }>(
        `${this.apiUrl}/sugerencias/${idUsuario}`
      )
      .pipe(
        // mapeamos cada sugerencia a UsuarioDto
        map((res) =>
          res.mensaje.map(
            (sugerencia): UsuarioDto => ({
              id: sugerencia.id,
              nombre: sugerencia.nombre,
              username: sugerencia.username,
              password: '', // password por defecto vacío (no viene del backend)
              fotoPerfilUrl: sugerencia.fotoPerfilUrl,
            })
          )
        )
      );
  }

  /**
   * @method obtenerUsuariosSeguidos
   * @description Obtiene la lista de usuarios que el usuario especificado está siguiendo.
   *
   * @param idUsuario ID del usuario que realiza la consulta.
   * @returns Un {@link Observable} que emite un array de {@link UsuarioDto}.
   */
  obtenerUsuariosSeguidos(idUsuario: number): Observable<UsuarioDto[]> {
    return this.http
      .get<{ error: boolean; mensaje: UsuarioDto[] }>(`${this.apiUrl}/seguidos/${idUsuario}`)
      .pipe(map((res) => res.mensaje));
  }

  /**
   * @method obtenerCantidadSeguidores
   * @description Obtiene la cantidad de seguidores de un usuario específico.
   *
   * @param idUsuario ID del usuario a consultar.
   * @returns Un {@link Observable} que emite la cantidad de seguidores (number).
   */
  obtenerCantidadSeguidores(idUsuario: number): Observable<number> {
    return this.http.get<MensajeDto<number>>(`${this.apiUrl}/seguidores/${idUsuario}`).pipe(
      map((resp) => resp.mensaje) // Extraemos solo el número de seguidores
    );
  }
}
