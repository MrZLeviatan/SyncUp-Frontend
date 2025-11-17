import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopBarAdmin } from '../../../components/top-bar-admin/top-bar-admin';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopBarAdmin],
  templateUrl: './layout-top-bat.component.html',
})
export class LayoutTopBarAdmin {}
