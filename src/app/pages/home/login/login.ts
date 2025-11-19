import { TokenService } from './../../../core/auth/services/token.services';
import { ValidadorLoginService } from './service/validador-login.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginDto } from '../../../core/models/dto/login.dto';
import { RegistrarUsuarioDto } from '../../../core/models/dto/usuario/registrar-usuario.dto';
import { ToastService } from '../../../layouts/public/avisos/toast.service';

/**
 * @description
 * Componente principal para el manejo de la autenticación de usuarios,
 * permitiendo alternar entre la vista de Login y la vista de Registro.
 *
 * Utiliza formularios reactivos de Angular para la gestión de datos y validaciones.
 *
 * @export
 * @class LoginComponente
 */
@Component({
  selector: 'app-login', // Selector HTML usado para incrustar el componente: <app-login></app-login>.
  imports: [CommonModule, ReactiveFormsModule], // Módulos necesarios: CommonModule (directivas) y ReactiveFormsModule (formularios).
  standalone: true, // Componente autocontenido (no requiere declaración en NgModules).
  templateUrl: './login.html', // Ruta al archivo HTML del template.
  styleUrls: ['./login.css'], // Ruta al archivo CSS de estilos.
})
export class LoginComponente {
  /**
   * @description
   * Bandera booleana que controla qué formulario se muestra en el template.
   * Si es {@code true}, se muestra el formulario de Login; si es {@code false}, el de Registro.
   */
  mostrarLogin: boolean = true;

  /**
   * @description
   * Objeto {@link FormGroup} que representa el estado y validaciones del formulario de Login.
   */
  loginForm: FormGroup;

  /**
   * @description
   * Objeto {@link FormGroup} que representa el estado y validaciones del formulario de Registro.
   */
  registerForm: FormGroup;

  // Preview image / Vista previa de la imagen
  previewImage: string | null = null;

  /**
   * @description
   * Constructor que inyecta los servicios necesarios y inicializa los formularios reactivos.
   *
   * @param {FormBuilder} fb - Herramienta de Angular para construir formularios reactivos.
   * @param {AuthService} authService - Servicio para interactuar con la API de autenticación.
   * @param {ToastService} toast - Servicio para mostrar notificaciones al usuario.
   * @param {ValidadorLoginService} validadorLoginService - Servicio para lógica de redirección post-login.
   * @param {TokenService} tokenService - Servicio para gestionar el almacenamiento del token JWT.
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private validadorLoginService: ValidadorLoginService,
    private tokenService: TokenService
  ) {
    // Inicializar login form con campos 'username' y 'password', ambos requeridos.
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Inicializar register form con campos 'nombre', 'username' y 'password', todos requeridos.
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      fotoPerfil: [null], // campo necesario
    });
  }

  /**
   * @description
   * Establece la bandera {@code mostrarLogin} a {@code true} para mostrar la vista de Login.
   */
  showLogin(): void {
    this.mostrarLogin = true;

    // Resetear el formulario de login al cambiar de pestaña
    this.loginForm.reset();
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
  }

  /**
   * @description
   * Establece la bandera {@code mostrarLogin} a {@code false} para mostrar la vista de Registro.
   */
  showRegister(): void {
    this.mostrarLogin = false;

    // Resetear el formulario de registro al cambiar de pestaña
    this.registerForm.reset();
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();

    // Limpiar la vista previa de la imagen
    this.previewImage = null;
  }

  /**
   * @description
   * Maneja el envío del formulario de Login.
   *
   * 1. Verifica la validez del formulario.
   * 2. Si es válido, llama al método {@code login} del {@code AuthService}.
   * 3. En caso de éxito, guarda el token y redirige según el rol.
   * 4. Muestra notificaciones {@code Toast} según el resultado.
   */
  onLogin(): void {
    if (this.loginForm.invalid) {
      // Muestra un toast informativo si faltan campos.
      this.toast.show('Debe llenar todos los campos', 'info');
      return;
    }

    // Convierte el valor del formulario a un DTO de Login.
    const loginDto: LoginDto = this.loginForm.value;

    // Llama al servicio de autenticación y se suscribe al observable.
    this.authService.login(loginDto).subscribe({
      next: (res) => {
        // Manejo de éxito
        this.toast.show('Login exitoso', 'success');
        // Almacena el token JWT obtenido del cuerpo del mensaje de respuesta.
        this.tokenService.saveToken(res.mensaje.token);
        // Utiliza el validador para navegar a la ruta correspondiente al rol.
        this.validadorLoginService.redirigirSegunRol();
      },
      error: (err) => {
        // Manejo de error (ej. 401 Unauthorized)
        this.toast.show('Usuario o contraseña incorrectos', 'error');
        console.error(err); // Muestra el error en la consola para depuración.
      },
    });
  }

  /**
   * @description
   * Maneja el envío del formulario de Registro.
   *
   * 1. Verifica la validez del formulario.
   * 2. Si es válido, llama al método {@code registrarUsuario} del {@code AuthService}.
   * 3. En caso de éxito, notifica al usuario, limpia el formulario y cambia a la vista de Login.
   */
  onRegister(): void {
    // Verificar campos obligatorios del formulario
    if (this.registerForm.invalid) {
      this.toast.show('Debe llenar todos los campos', 'info');
      return;
    }

    // NUEVA VALIDACIÓN: Verificar que se haya seleccionado una imagen
    if (!this.registerForm.get('fotoPerfil')?.value) {
      this.toast.show('Debe seleccionar una imagen de perfil', 'info');
      return;
    }

    // Convierte el valor del formulario a un DTO de Registro
    const registerDto: RegistrarUsuarioDto = this.registerForm.value;

    // Llamar al servicio de registro
    this.authService.registrarUsuario(registerDto).subscribe({
      next: (res) => {
        this.toast.show('Usuario registrado con éxito', 'success');
        this.registerForm.reset(); // Limpiar formulario
        this.previewImage = null; // Limpiar preview de imagen
        this.showLogin(); // Cambiar a Login
      },
    });
  }

  // Image selection handler / Manejo de selección de imagen
  onImageSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    // Add file to form
    this.registerForm.patchValue({ fotoPerfil: file });

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
