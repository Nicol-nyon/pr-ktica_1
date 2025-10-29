import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-helper',
  imports: [CommonModule],
  templateUrl: './helper.html',
  styleUrls: ['./helper.css'],
  standalone: true,
})
export class SoporteComponent implements OnInit{
  usuario: any;
  menuAbierto = false;
  userMenuAbierto = false;

  menuItems = [
    { name: 'Catálogo', icon: 'bi bi-grid', route: '/index' },
    { name: 'Solicitar', icon: 'bi bi-pencil-square', route: '/solicitar' },
    { name: 'Chat', icon: 'bi bi-chat-dots', route: '/chat' },
    { name: 'Mis Solicitudes', icon: 'bi bi-list-check', route: '/mis-solicitudes' },
    { name: 'Soporte', icon: 'bi bi-headset', route: '/soporte' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();

    this.renderer.setStyle(document.body, 'overflow', 'auto');
    this.renderer.setStyle(document.documentElement, 'overflow', 'auto');
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleUserMenu() {
    this.userMenuAbierto = !this.userMenuAbierto;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(route: string, event: Event) {
    event.preventDefault();
    this.router.navigate([route]);
    this.menuAbierto = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.logo')) {
      this.userMenuAbierto = false;
    }
  }
}