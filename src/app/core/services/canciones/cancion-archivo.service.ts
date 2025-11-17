import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../app.config';

/**
 * @injectable
 * @description Servicio de Angular encargado de gestionar las operaciones de **descarga de archivos de reporte**
 * relacionados con las canciones.
 *
 * Utiliza el tipo de respuesta 'blob' para manejar contenido binario (CSV, TXT) directamente desde el backend.
 */
@Injectable({
  providedIn: 'root', // El servicio está disponible en toda la aplicación.
})
@Injectable({
  providedIn: 'root',
})
export class CancionArchivoService {
  // URL base del endpoint de cancion en el backend.
  private apiUrl = `${API_URL.baseUrl}/api/canciones`;

  /**
   * @constructor
   * @param http Cliente HTTP de Angular inyectado para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

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
