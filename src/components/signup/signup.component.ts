import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    username: '',
    email : '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  signup() {
    this.authService.signup(this.user).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
