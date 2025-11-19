import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../app.config';
import { RegistrarCancionDto } from '../models/dto/cancion/registrar-cancion.dto';
import { EditarCancionDto } from '../models/dto/cancion/editar-cancion.dto';
import { CancionDto } from '../models/dto/cancion/cancion.dto';

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
    formData.append('titulo', dto.titulo); // Título de la canción
    formData.append('generoMusical', dto.generoMusical); // Debe coincidir con el nombre del DTO backend
    formData.append('fechaLanzamiento', dto.fechaLanzamiento); // Fecha exacta enviada como string
    formData.append('artistaId', dto.artistaId.toString()); // ID del artista

    // 2. Añadir los archivos binarios (File) solo si están presentes.
    formData.append('archivoCancion', dto.archivoCancion); // Archivo de audio
    formData.append('imagenPortada', dto.imagenPortada); // Imagen de portada

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
    return this.http
      .get<{ error: boolean; mensaje: CancionDto[] }>(`${this.apiUrl}/favoritas/${idUsuario}`)
      .pipe(map((res) => res.mensaje));
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

  /**
   * @method autocompletarCanciones
   * @description Realiza una búsqueda rápida de canciones cuyos títulos coinciden con el prefijo dado.
   *
   * Utiliza la funcionalidad de autocompletado implementada con un Trie en el backend.
   *
   * @param prefijo Texto parcial ingresado por el usuario.
   * @returns Un {@link Observable} que emite una lista de {@link CancionDto}s coincidentes.
   */
  autocompletarCanciones(prefijo: string): Observable<CancionDto[]> {
    const url = `${this.apiUrl}/autocompletar`;
    // Configura el parámetro de consulta 'prefijo'.
    const params = new HttpParams().set('prefijo', prefijo);
    // Petición GET al endpoint: /api/cancion/autocompletar?prefijo={prefijo}
    return this.http.get<CancionDto[]>(url, { params });
  }

  /**
   * @method listarCancionesFiltro
   * @description Obtiene una lista de canciones aplicando filtros dinámicos y paginación.
   *
   * Los filtros se combinan con lógica AND y OR en el backend.
   *
   * @param artista (Opcional) Nombre del artista para filtrar.
   * @param genero (Opcional) Género musical para filtrar.
   * @param anioLanzamiento (Opcional) Año de lanzamiento para filtrar.
   * @param pagina Número de página a recuperar (por defecto 0).
   * @param size Cantidad de elementos por página (por defecto 10).
   * @returns Un {@link Observable} que emite una lista de {@link CancionDto}s filtradas.
   */
  listarCancionesFiltro(
    artista?: string,
    genero?: string,
    anioLanzamiento?: number,
    pagina: number = 0,
    size: number = 10
  ): Observable<CancionDto[]> {
    // 1. Inicializa los parámetros de consulta con los valores de paginación.
    let params = new HttpParams().set('pagina', pagina.toString()).set('size', size.toString());

    // 2. Agrega los filtros opcionales si están presentes.
    if (artista) params = params.set('artista', artista);
    if (genero) params = params.set('genero', genero);
    if (anioLanzamiento) params = params.set('anioLanzamiento', anioLanzamiento.toString());

    const url = `${this.apiUrl}/filtrar`;

    // 3. Petición GET al endpoint: /api/cancion/filtrar?param1=valor1&...
    return this.http.get<CancionDto[]>(url, { params });
  }

  /**
   * @method descargarReporteFavoritos
   * @description Envía una petición GET para descargar el reporte CSV de las canciones favoritas de un usuario.
   *
   * @param usuarioId ID único del usuario del cual se generará el reporte.
   * @returns Un {@link Observable} que emite el contenido del archivo como un objeto {@link Blob}.
   */
  descargarReporteFavoritos(usuarioId: number): Observable<Blob> {
    const url = `${this.apiUrl}/reporte-favoritos/${usuarioId}`;
    // Se especifica responseType: 'blob' para recibir datos binarios (el archivo CSV).
    return this.http.get(url, { responseType: 'blob' });
  }

  /**
   * @method descargarReporteGeneralCanciones
   * @description Envía una petición GET para descargar el reporte TXT de todas las canciones registradas.
   *
   * @returns Un {@link Observable} que emite el contenido del archivo como un objeto {@link Blob}.
   */
  descargarReporteGeneralCanciones(): Observable<Blob> {
    const url = `${this.apiUrl}/reporte-general`;
    // Se especifica responseType: 'blob' para recibir datos binarios (el archivo TXT).
    return this.http.get(url, { responseType: 'blob' });
  }

  /**
   * @method descargarArchivo
   * @description Función auxiliar para iniciar la descarga de un archivo en el navegador
   * a partir de un objeto Blob y un nombre de archivo.
   *
   * @param data El objeto {@link Blob} que contiene el contenido binario del archivo.
   * @param filename El nombre de archivo que se le asignará al archivo descargado (ej: reporte.csv).
   */
  descargarArchivo(data: Blob, filename: string): void {
    // 1. Crea un nuevo Blob, asegurando el tipo de contenido.
    const blob = new Blob([data], { type: data.type });

    // 2. Crea una URL temporal del objeto Blob.
    const url = window.URL.createObjectURL(blob);

    // 3. Crea un elemento <a> invisible en el documento.
    const a = document.createElement('a');

    // 4. Configura el enlace con la URL temporal y el nombre de archivo.
    a.href = url;
    a.download = filename;

    // 5. Simula un clic en el enlace para iniciar la descarga.
    a.click();

    // 6. Libera la URL temporal para liberar recursos del navegador.
    window.URL.revokeObjectURL(url);
  }
}
