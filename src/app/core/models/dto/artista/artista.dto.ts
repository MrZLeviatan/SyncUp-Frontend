/**
 * @interface ArtistaDto
 * @description Data Transfer Object (DTO) utilizado para transferir la información completa de un Artista
 * desde la API al cliente. Incluye datos básicos y la lista de miembros.
 */
export interface ArtistaDto {
  id: number;
  nombreArtistico: string;
  urlImagen: string;
  descripcion: string;
  seguidores: number;
  miembros: string[]; // lista de nombres de los integrantes
}
