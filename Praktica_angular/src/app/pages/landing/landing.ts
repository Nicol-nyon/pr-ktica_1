import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent implements OnInit {
  usuario: any;
  menuAbierto = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.usuario = this.authService.getUsuario();
  }

  ngOnInit() {
    this.renderer.setStyle(document.body, 'overflow', 'auto');
    this.renderer.setStyle(document.documentElement, 'overflow', 'auto');
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  scrollTo(sectionId: string, event: Event) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.menuAbierto = false;
  }

  irARegister() {
    this.router.navigate(['/register']);
  }
}
