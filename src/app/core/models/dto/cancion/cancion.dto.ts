import { GeneroMusical } from './../../enum/genero-musical.enum';

/**
 * @interface CancionDto
 * @description Data Transfer Object (DTO) utilizado para la transferencia de la información completa de una Canción
 * desde la API al cliente.
 */
export interface CancionDto {
  id: number;
  titulo: string;
  generoMusical: GeneroMusical;
  fechaLanzamiento: string; // Se representa como una cadena de fecha ISO (YYYY-MM-DD).
  urlCancion: string;
  urlPortada: string;
  duracion: string;
  idArtista: number;
}
