import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { IndexComponent } from './pages/index/index';
import { LandingComponent } from './pages/landing/landing';
import { AuthGuard } from './guards/auth-guard';
import { NoAuthGuard } from './guards/no-auth-guard';
import { SolicitarComponent } from './pages/solicitude/solicitude';
import { ChatComponent } from './pages/chat/chat';
import { MisSolicitudesComponent } from './pages/myorders/myorders';
import { SoporteComponent } from './pages/helper/helper';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'index', component: IndexComponent, canActivate: [AuthGuard] },
  { path: 'solicitar', component: SolicitarComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'mis-solicitudes', component: MisSolicitudesComponent, canActivate: [AuthGuard] },
  { path: 'soporte', component: SoporteComponent, canActivate: [AuthGuard] },
  { path: 'landing', component: LandingComponent },
];
