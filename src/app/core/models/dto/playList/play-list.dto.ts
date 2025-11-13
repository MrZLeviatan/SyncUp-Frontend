import { CancionDto } from '../cancion/cancion.dto';

/**
 * @interface PlayListDto
 * @description Data Transfer Object (DTO) utilizado para la transferencia de información de una lista de reproducción (Playlist).
 *
 * Contiene el nombre de la lista y la colección de canciones que la componen.
 */
export interface PlayListDto {
  nombre: string;
  canciones: CancionDto[]; // Colección de objetos DTO que representan las canciones incluidas en esta lista
}
