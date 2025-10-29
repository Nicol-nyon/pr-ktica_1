import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { Router} from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.html',
  styleUrls: ['./index.css'],
  imports: [CommonModule],
})
export class IndexComponent implements OnInit {
  usuario: any;
  menuAbierto = false;

  menuItems = [
    { name: 'Catálogo', icon: 'bi bi-grid', route: '/index' },
    { name: 'Solicitar', icon: 'bi bi-pencil-square', route: '/solicitar' },
    { name: 'Chat', icon: 'bi bi-chat-dots', route: '/chat' },
    { name: 'Mis Solicitudes', icon: 'bi bi-list-check', route: '/mis-solicitudes' },
    { name: 'Soporte', icon: 'bi bi-headset', route: '/soporte' },
  ];


  radius = -120;

  catalogoItems = [
    { name: '', type: 'image', src: '/images/pan.png' },
    { name: '', type: 'image', src: '/images/papa.png' },
    { name: '', type: 'image', src: '/images/perrito.png' },
    { name: '', type: 'video', src: '/videos/mama.mp4' },
  ];

  modalOpen = false;
  selectedItem: any = null;

  carouselIndex = 0;
  itemsPerView = 3;

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
    this.updateItemsPerView();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateItemsPerView();
  }

  updateItemsPerView() {
    const width = window.innerWidth;
    if (width < 600) this.itemsPerView = 1;
    else if (width < 1024) this.itemsPerView = 2;
    else this.itemsPerView = 3;
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
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

  openModal(item: any) {
    this.selectedItem = item;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedItem = null;
  }

  get visibleItems() {
    const visible = [];
    for (let i = 0; i < this.itemsPerView; i++) {
      const index = (this.carouselIndex + i) % this.catalogoItems.length;
      visible.push(this.catalogoItems[index]);
    }
    return visible;
  }

  prevSlide() {
    this.carouselIndex =
      (this.carouselIndex - 1 + this.catalogoItems.length) %
      this.catalogoItems.length;
  }

  nextSlide() {
    this.carouselIndex =
      (this.carouselIndex + 1) % this.catalogoItems.length;
  }

  userMenuAbierto = false;

  toggleUserMenu() {
    this.userMenuAbierto = !this.userMenuAbierto;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.logo')) {
      this.userMenuAbierto = false;
    }
  }

}
