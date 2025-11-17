import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../app.config';
import { RadioDto } from '../../models/dto/playList/radio.dto';
import { PlayListDto } from '../../models/dto/playList/play-list.dto';

/**
 * @injectable
 * @description Servicio de Angular encargado de interactuar con el motor de **recomendaciones**
 * del sistema.
 *
 * Proporciona métodos para generar flujos de reproducción dinámicos (Radio) y listas de
 * reproducción personalizadas (Descubrimiento Semanal).
 */
@Injectable({
  providedIn: 'root', // El servicio está disponible en toda la aplicación
})
export class RecomendacionService {
  // URL base del endpoint de recomendaciones en el backend.
  private apiUrl = `${API_URL.baseUrl}/api/recomendacion`;

  /**
   * @constructor
   * @param http Cliente HTTP de Angular inyectado para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * @method iniciarRadio
   * @description Inicia una "Radio" o cola de reproducción algorítmica basada en una
   * canción semilla.
   *
   * @param cancionId ID de la canción base a partir de la cual se generan las sugerencias.
   * @returns Un {@link Observable} que emite el objeto {@link RadioDto} que contiene la cola de reproducción.
   */
  iniciarRadio(cancionId: number): Observable<RadioDto> {
    // Petición GET al endpoint: /api/recomendacion/radio/{cancionId}
    return this.http
      .get<{ error: boolean; mensaje: RadioDto }>(`${this.apiUrl}/radio/${cancionId}`)
      .pipe(map((res) => res.mensaje));
  }

  /**
   * @method generarDescubrimientoSemanal
   * @description Genera una lista de reproducción personalizada basada en el historial y
   * preferencias de un usuario.
   *
   * @param idUsuario ID del usuario para el cual se genera la lista.
   * @returns Un {@link Observable} que emite el objeto {@link PlayListDto} con las canciones sugeridas.
   */
  generarDescubrimientoSemanal(idUsuario: number): Observable<PlayListDto> {
    // Petición GET al endpoint: /api/recomendacion/descubrimiento/{idUsuario}
    return this.http
      .get<{ error: boolean; mensaje: PlayListDto }>(`${this.apiUrl}/descubrimiento/${idUsuario}`)
      .pipe(map((res) => res.mensaje));
  }
}
