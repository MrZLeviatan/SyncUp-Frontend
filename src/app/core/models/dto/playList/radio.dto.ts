import { CancionDto } from '../cancion/cancion.dto';

/**
 * @interface RadioDto
 * @description Data Transfer Object (DTO) que representa una "Radio" o un flujo de reproducción sugerido
 * por el sistema.
 *
 * Se utiliza para iniciar una reproducción automática basada en una canción inicial,
 * donde el sistema genera el contenido subsecuente.
 */
export interface RadioDto {
  idCancionBase: number;
  colaReproduccion: CancionDto[]; // Lista ordenadas de CancionesDto
}
