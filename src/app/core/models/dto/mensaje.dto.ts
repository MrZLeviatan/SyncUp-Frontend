/**
 * @interface MensajeDto
 * @description Data Transfer Object (DTO) genérico utilizado para estandarizar la estructura de las respuestas
 * enviadas por la API al cliente, encapsulando el resultado de una operación.
 *
 * Utiliza un genérico <T> para permitir que el campo de contenido varíe según la respuesta del endpoint.
 *
 * @template T El tipo de dato que contiene el mensaje o la carga útil de datos (payload).
 */
export interface MensajeDto<T> {
  error: boolean;
  mensaje: T;
}
