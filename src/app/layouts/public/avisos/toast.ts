import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

/**
 * @description
 * Componente de presentación para las notificaciones 'toast'.
 *
 * Se encarga de renderizar la lista de notificaciones obtenidas del {@link ToastService}
 * en el template asociado, aplicando los estilos CSS definidos.
 *
 * @export
 * @class Toast
 */
@Component({
  selector: 'app-toast', // El selector HTML usado para incrustar el componente: <app-toast></app-toast>.
  standalone: true, // Indica que este es un componente "standalone" (no requiere NgModules).
  imports: [CommonModule], // Permite usar directivas comunes de Angular como *ngFor en el template.
  templateUrl: './toast.html', // La ruta al archivo HTML del template (donde se usa el *ngFor).
  styleUrl: './toast.css', // La ruta al archivo CSS para los estilos del contenedor y de las notificaciones.
})
export class Toast {
  /**
   * @description
   * El constructor inyecta el {@link ToastService}.
   *
   * Al declarar 'public' en el constructor, Angular automáticamente crea y asigna
   * una propiedad de instancia llamada 'toastService', haciéndola accesible directamente
   * desde el template del componente.
   *
   * @param {ToastService} toastService - Servicio que gestiona el estado y la lista de toasts activos.
   */
  constructor(public toastService: ToastService) {}
}
