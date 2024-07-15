import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TaskListComponent } from '../task-list/task-list.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TaskListComponent, LoginComponent, SignupComponent, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isNavbarExpanded = false;
  constructor(public authService: AuthService, private router: Router) { }

  toggleNavbar(){
    this.isNavbarExpanded = !this.isNavbarExpanded;
  }

  logout() {
    this.authService.logout();
  }

  closeNavbar() {
    this.isNavbarExpanded = false;
  }
}
