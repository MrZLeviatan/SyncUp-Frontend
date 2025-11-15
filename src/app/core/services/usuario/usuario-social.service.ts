import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../app.config';
import { UsuarioDto } from '../../models/dto/usuario/usuario.dto';
import { UsuarioConexionDto } from '../../models/dto/usuario/usuario.conexion.dto';
import { SugerenciaUsuariosDto } from '../../models/dto/usuario/sugerencia-usuario.dto';

/**
 * @injectable
 * @description Servicio de Angular encargado de gestionar las interacciones sociales entre usuarios,
 * incluyendo seguir, dejar de seguir y obtener sugerencias o listas de usuarios seguidos.
 */
@Injectable({
  providedIn: 'root',
})
export class UsuarioSocialService {
  // URL base para los endpoints de la lógica social
  private apiUrl = `${API_URL.baseUrl}/api/social`;

  /**
   * @constructor
   * @param http Cliente HTTP de Angular inyectado para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

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
  obtenerSugerencias(idUsuario: number): Observable<SugerenciaUsuariosDto[]> {
    return this.http.get<SugerenciaUsuariosDto[]>(`${this.apiUrl}/sugerencias/${idUsuario}`);
  }

  /**
   * @method obtenerUsuariosSeguidos
   * @description Obtiene la lista de usuarios que el usuario especificado está siguiendo.
   *
   * @param idUsuario ID del usuario que realiza la consulta.
   * @returns Un {@link Observable} que emite un array de {@link UsuarioDto}.
   */
  obtenerUsuariosSeguidos(idUsuario: number): Observable<UsuarioDto[]> {
    return this.http.get<UsuarioDto[]>(`${this.apiUrl}/seguidos/${idUsuario}`);
  }
}
