import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TaskListComponent } from '../task-list/task-list.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TaskListComponent, LoginComponent, SignupComponent, CommonModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent{

  constructor(public authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
  }
}
