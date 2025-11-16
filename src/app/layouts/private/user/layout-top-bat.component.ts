import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopBarAdmin } from '../../../components/top-bar-admin/top-bar-admin';
import { TopBarUsuarios } from '../../../components/top-bar-usuarios/top-bar-usuarios';

@Component({
  selector: 'app-layout-publico',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopBarUsuarios],
  templateUrl: './layout-top-bar.component.html',
})
export class LayoutTopBarUsuario {}
