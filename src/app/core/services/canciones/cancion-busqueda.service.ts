import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../app.config';
import { CancionDto } from '../../models/dto/cancion/cancion.dto';

/**
 * @injectable
 * @description Servicio de Angular dedicado a la **búsqueda y filtrado avanzado** de canciones.
 *
 * Proporciona funcionalidad de autocompletado y un método versátil para filtrar canciones
 * por múltiples criterios (artista, género, año).
 */
@Injectable({
  providedIn: 'root', // El servicio está disponible en toda la aplicación.
})
export class CancionBusquedaService {
  // URL base del endpoint de cancion en el backend.
  private apiUrl = `${API_URL.baseUrl}/api/cancion`;

  /**
   * @constructor
   * @param http Cliente HTTP de Angular inyectado para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

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
}
