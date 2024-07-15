import { TaskListComponent } from '../components/task-list/task-list.component';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { LandingPageComponent } from '../components/landing-page/landing-page.component';
import { AuthGuard } from '../guards/auth.gaurd';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'landing', component: LandingPageComponent},
    { path: '**', redirectTo: '/landing' }
];

export class AppRoutingModule { }
