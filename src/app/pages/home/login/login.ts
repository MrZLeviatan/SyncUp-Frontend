import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginDto } from '../../../core/models/dto/login.dto';
import { RegistrarUsuarioDto } from '../../../core/models/dto/usuario/registrar-usuario.dto';
import { ToastService } from '../../../components/toast/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponente {
  mostrarLogin: boolean = true;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService
  ) {
    // Inicializar login form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // Inicializar register form
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  showLogin() {
    this.mostrarLogin = true;
  }

  showRegister() {
    this.mostrarLogin = false;
  }

  // LOGIN con Toast
  onLogin() {
    if (this.loginForm.invalid) {
      this.toast.show('Debe llenar todos los campos', 'info');
      return;
    }

    const loginDto: LoginDto = this.loginForm.value;
    this.authService.login(loginDto).subscribe({
      next: (res) => {
        this.toast.show('Login exitoso', 'success');
        localStorage.setItem('token', res.mensaje.token);
        // Aquí podrías redirigir al dashboard
      },
      error: (err) => {
        this.toast.show('Usuario o contraseña incorrectos', 'error');
        console.error(err);
      },
    });
  }

  // REGISTRO con validación y Toast
  onRegister() {
    if (this.registerForm.invalid) {
      this.toast.show('Debe llenar todos los campos', 'info');
      return;
    }

    const registerDto: RegistrarUsuarioDto = this.registerForm.value;
    this.authService.registrarUsuario(registerDto).subscribe({
      next: (res) => {
        this.toast.show('Usuario registrado con éxito', 'success');
        this.registerForm.reset(); // Limpiar campos
        this.showLogin();
      },
      error: (err) => {
        this.toast.show('No se pudo registrar el usuario', 'error');
        console.error(err);
      },
    });
  }
}
