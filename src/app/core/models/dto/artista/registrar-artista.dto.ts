/**
 * @interface RegistrarArtistasDto
 * @description DTO utilizado para enviar la información necesaria para registrar un nuevo Artista.
 *
 * Contiene todos los datos que se reciben en el backend desde el formulario, excepto el ID.
 */
export interface RegistrarArtistasDto {
  nombreArtistico: string;
  descripcion?: string;
  miembros?: string[]; // conjunto de integrantes opcional
  imagenPortada?: File; // para manejar la imagen seleccionada en el formulario
}
