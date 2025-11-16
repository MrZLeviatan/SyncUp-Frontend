import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../app.config';
import { RegistrarCancionDto } from '../../models/dto/cancion/registrar-cancion.dto';
import { EditarCancionDto } from '../../models/dto/cancion/editar-cancion.dto';
import { CancionDto } from '../../models/dto/cancion/cancion.dto';

/**
 * @injectable
 * @description Servicio de Angular encargado de gestionar las operaciones **CRUD** de la entidad Canción,
 * así como la gestión de **canciones favoritas** y la obtención de **métricas** estadísticas.
 */
@Injectable({
  providedIn: 'root',
})
export class CancionService {
  // Endpoint base para la API de Canción
  private apiUrl = `${API_URL.baseUrl}/api/cancion`;

  /**
   * @constructor
   * @param http Cliente HTTP de Angular inyectado para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * @method registrarCancion
   * @description Envía una petición POST para registrar una nueva canción, incluyendo archivos binarios.
   *
   * Utiliza **FormData** para enviar datos mixtos (JSON y archivos File) al backend
   * en formato `multipart/form-data`.
   *
   * @param dto DTO con los datos y archivos (audio y portada) de la nueva canción.
   * @returns Un {@link Observable} que emite la respuesta del backend.
   */
  registrarCancion(dto: RegistrarCancionDto): Observable<any> {
    const formData = new FormData();

    // 1. Añadir los campos de texto/número.
    formData.append('titulo', dto.titulo);
    formData.append('genero', dto.generoMusical);
    formData.append('anioLanzamiento', dto.fechaLanzamiento);
    formData.append('artistaId', dto.artistaId.toString());

    // 2. Añadir los archivos binarios (File) solo si están presentes.
    if (dto.archivoCancion) formData.append('archivoAudio', dto.archivoCancion);
    if (dto.imagenPortada) formData.append('portada', dto.imagenPortada);

    // Petición POST al endpoint: /api/cancion/registrar
    return this.http.post(`${this.apiUrl}/registrar`, formData);
  }

  /**
   * @method actualizarCancion
   * @description Envía una petición PUT para actualizar los datos de una canción.
   *
   * @param dto DTO que contiene el ID de la canción y los campos a modificar {@link EditarCancionDto}.
   * @returns Un {@link Observable} que emite la respuesta del backend.
   */
  actualizarCancion(dto: EditarCancionDto): Observable<any> {
    // Petición PUT al endpoint: /api/cancion/actualizar
    return this.http.put(`${this.apiUrl}/actualizar`, dto);
  }

  /**
   * @method eliminarCancion
   * @description Envía una petición DELETE para eliminar una canción por su ID.
   *
   * @param idCancion ID de la canción a eliminar.
   * @returns Un {@link Observable} que emite la respuesta del backend.
   */
  eliminarCancion(idCancion: number): Observable<any> {
    // Petición DELETE al endpoint: /api/cancion/eliminar/{idCancion}
    return this.http.delete(`${this.apiUrl}/eliminar/${idCancion}`);
  }

  /**
   * @method obtenerCancion
   * @description Obtiene los detalles de una canción por su ID.
   *
   * @param idCancion ID de la canción a obtener.
   * @returns Un {@link Observable} que emite el objeto {@link CancionDto}.
   */
  obtenerCancion(idCancion: number): Observable<CancionDto> {
    // Petición GET al endpoint: /api/cancion/{idCancion}
    return this.http.get<CancionDto>(`${this.apiUrl}/${idCancion}`);
  }

  /**
   * @method obtenerCancionesGeneral
   * @description Obtiene todas las canciones generales
   *
   * @returns Un {@link Observable} que emite una lista de {@link CancionDto}.
   */
  obtenerCancionesGeneral(): Observable<CancionDto[]> {
    return this.http.get<{ error: boolean; mensaje: CancionDto[] }>(`${this.apiUrl}/listar`).pipe(
      map((res) => res.mensaje) // solo retorna el array
    );
  }

  /**
   * @method listarFavoritasUsuario
   * @description Obtiene la lista de canciones favoritas de un usuario específico.
   *
   * @param idUsuario ID del usuario.
   * @returns Un {@link Observable} que emite una lista de {@link CancionDto}.
   */
  listarFavoritasUsuario(idUsuario: number): Observable<CancionDto[]> {
    // Petición GET al endpoint: /api/cancion/favoritas/{idUsuario}
    return this.http.get<CancionDto[]>(`${this.apiUrl}/favoritas/${idUsuario}`);
  }

  /**
   * @method agregarFavorita
   * @description Añade una canción a la lista de favoritos de un usuario.
   *
   * @param idUsuario ID del usuario.
   * @param idCancion ID de la canción a agregar.
   * @returns Un {@link Observable} que emite la respuesta del backend.
   */
  agregarFavorita(idUsuario: number, idCancion: number): Observable<any> {
    // Petición POST al endpoint: /api/cancion/favoritas/{idUsuario}/agregar/{idCancion} con cuerpo vacío.
    return this.http.post(`${this.apiUrl}/favoritas/${idUsuario}/agregar/${idCancion}`, {});
  }

  /**
   * @method quitarFavorita
   * @description Elimina una canción de la lista de favoritos de un usuario.
   *
   * @param idUsuario ID del usuario.
   * @param idCancion ID de la canción a quitar.
   * @returns Un {@link Observable} que emite la respuesta del backend.
   */
  quitarFavorita(idUsuario: number, idCancion: number): Observable<any> {
    // Petición DELETE al endpoint: /api/cancion/favoritas/{idUsuario}/quitar/{idCancion}
    return this.http.delete(`${this.apiUrl}/favoritas/${idUsuario}/quitar/${idCancion}`);
  }

  /**
   * @method obtenerMetricas
   * @description Obtiene un mapa de métricas y estadísticas relacionadas con las canciones.
   *
   * @returns Un {@link Observable} que emite un objeto Map tipificado.
   */
  obtenerMetricas(): Observable<Map<string, any>> {
    // Petición GET al endpoint: /api/cancion/metricas
    return this.http.get<Map<string, any>>(`${this.apiUrl}/metricas`);
  }
}
