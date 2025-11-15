/**
 * @interface RegistrarArtistasDto
 * @description Data Transfer Object (DTO) utilizado exclusivamente para enviar la información
 * necesaria para **registrar un nuevo Artista** en el sistema.
 *
 * Contiene únicamente el campo requerido para la creación de la entidad.
 */
export interface RegistrarArtistasDto {
  nombreArtistico: string;
}
