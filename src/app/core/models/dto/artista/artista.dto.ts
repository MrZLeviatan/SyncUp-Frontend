/**
 * @interface ArtistaDto
 * @description Data Transfer Object (DTO) utilizado para la transferencia de información básica de un Artista
 * desde la API al cliente. Se usa comúnmente en listados o referencias sencillas.
 */
export interface ArtistaDto {
  id: number;
  nombreArtistico: string;
}
