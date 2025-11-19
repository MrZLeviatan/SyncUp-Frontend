import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrarArtistasDto } from '../models/dto/artista/registrar-artista.dto';
import { MensajeDto } from '../models/dto/mensaje.dto';
import { ArtistaDto } from '../models/dto/artista/artista.dto';
import { API_URL } from '../../app.config';

/**
 * @injectable
 * @description Servicio de Angular para gestionar las operaciones relacionadas con la entidad Artista.
 *
 * Proporciona métodos para registrar nuevos artistas, consultar información por ID y
 * realizar búsquedas rápidas (autocompletado) de nombres artísticos.
 */
@Injectable({
  providedIn: 'root', // El servicio está disponible en toda la aplicación.
})
export class ArtistaService {
  // URL base del endpoint de artistas en el backend.
  private apiUrl = `${API_URL.baseUrl}/api/artistas`;

  /**
   * @constructor
   * @param http Cliente HTTP de Angular inyectado para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * @method registrarArtista
   * @description Envía una petición POST para registrar un nuevo artista en el sistema.
   *
   * Este endpoint requiere el rol 'ADMIN' en el backend.
   *
   * @param registrarArtistasDto Objeto DTO con el nombre artístico a registrar.
   * @returns Un {@link Observable} que emite la respuesta del backend, tipificada como {@link MensajeDto<string>}.
   */
  registrarArtista(registrarArtistasDto: RegistrarArtistasDto): Observable<MensajeDto<string>> {
    const formData = new FormData();
    formData.append('nombreArtistico', registrarArtistasDto.nombreArtistico);

    if (registrarArtistasDto.descripcion) {
      formData.append('descripcion', registrarArtistasDto.descripcion);
    }

    if (registrarArtistasDto.miembros) {
      registrarArtistasDto.miembros.forEach((m) => formData.append('miembros', m));
    }

    if (registrarArtistasDto.imagenPortada) {
      formData.append('imagenPortada', registrarArtistasDto.imagenPortada);
    }

    return this.http.post<MensajeDto<string>>(`${this.apiUrl}/registrar`, formData);
  }

  /**
   * @method obtenerArtistaPorId
   * @description Envía una petición GET para obtener la información básica de un artista por su ID.
   *
   * Este endpoint requiere el rol 'USUARIO' o 'ADMIN' en el backend.
   *
   * @param idArtista ID único del artista a consultar.
   * @returns Un {@link Observable} que emite la respuesta del backend, tipificada como {@link MensajeDto<ArtistaDto>}.
   */
  obtenerArtistaPorId(idArtista: number): Observable<MensajeDto<ArtistaDto>> {
    // Petición GET al endpoint: /api/artistas/{idArtista}
    return this.http.get<MensajeDto<ArtistaDto>>(`${this.apiUrl}/${idArtista}`);
  }

  /**
   * @method listarArtistas
   * @description Envía una petición GET para obtener la lista completa de artistas.
   *
   * Este endpoint requiere el rol 'USUARIO' o 'ADMIN' en el backend.
   *
   * @returns Un {@link Observable} que emite la lista de {@link ArtistaDto}s envuelta en {@link MensajeDto}.
   */
  listarArtistas(): Observable<MensajeDto<ArtistaDto[]>> {
    return this.http.get<MensajeDto<ArtistaDto[]>>(`${this.apiUrl}/listar-artistas`);
  }

  /**
   * @method autocompletarArtistas
   * @description Envía una petición GET para buscar artistas cuyos nombres artísticos coincidan con un prefijo.
   *
   * Utiliza un parámetro de consulta (`params: { prefijo }`) para enviar el texto de búsqueda.
   *
   * @param prefijo Texto parcial ingresado por el usuario para la función de autocompletado.
   * @returns Un {@link Observable} que emite la lista de {@link ArtistaDto}s coincidentes, envuelta en {@link MensajeDto}.
   */
  autocompletarArtistas(prefijo: string): Observable<MensajeDto<ArtistaDto[]>> {
    // Petición GET al endpoint: /api/artistas/autocompletar?prefijo={prefijo}
    return this.http.get<MensajeDto<ArtistaDto[]>>(`${this.apiUrl}/autocompletar`, {
      params: { prefijo },
    });
  }
}
