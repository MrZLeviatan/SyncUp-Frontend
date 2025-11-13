import { GeneroMusical } from '../../enum/genero-musical.enum';

/**
 * @interface RegistrarCancionDto
 * @description Data Transfer Object (DTO) utilizado para enviar la información necesaria para **registrar una nueva Canción**
 * en el sistema, incluyendo sus archivos binarios asociados.
 *
 * NOTA: Los campos de tipo 'File' generalmente se envían al backend utilizando un formulario FormData,
 * no como JSON tradicional.
 */
export interface RegistrarCancionDto {
  titulo: string;
  generoMusical: GeneroMusical;
  fechaLanzamiento: string;
  archivoCancion: File;
  imagenPortada: File;
  artistaId: number;
}
