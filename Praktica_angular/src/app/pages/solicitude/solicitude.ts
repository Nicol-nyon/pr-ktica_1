import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-solicitar',
  standalone: true,
  templateUrl: './solicitude.html',
  styleUrls: ['./solicitude.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
})
export class SolicitarComponent implements OnInit {
  usuario: any = null;
  menuAbierto = false;
  userMenuAbierto = false;

  menuItems = [
    { name: 'Catálogo', icon: 'bi bi-grid', route: '/index' },
    { name: 'Solicitar', icon: 'bi bi-pencil-square', route: '/solicitar' },
    { name: 'Chat', icon: 'bi bi-chat-dots', route: '/chat' },
    { name: 'Mis Solicitudes', icon: 'bi bi-list-check', route: '/mis-solicitudes' },
    { name: 'Soporte', icon: 'bi bi-headset', route: '/soporte' },
  ];

  productos: any[] = [];
  productosFiltrados: any[] = [];
  productoSeleccionado: any = null;

  cantidad: number = 1;
  fechaEntrega: string = new Date().toISOString().split('T')[0];
  descripcion: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario() || JSON.parse(localStorage.getItem('usuario') || 'null');

    if (!this.usuario) {
      alert('No se encontró información del usuario. Vuelva a iniciar sesión.');
      this.router.navigate(['/login']);
      return;
    }

    console.log('Usuario cargado:', this.usuario);

    this.renderer.setStyle(document.body, 'overflow', 'auto');
    this.renderer.setStyle(document.documentElement, 'overflow', 'auto');

    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get('http://localhost:8080/api/productos').subscribe({
      next: (data: any) => {
        this.productos = [
          ...data.servicios.map((s: any) => ({
            tipo: 'servicio',
            id: s.id_servicio,
            nombre: s.nombre,
            descripcion: s.descripcion,
            precio: s.precio_base,
          })),
          ...data.packs.map((p: any) => ({
            tipo: 'pack',
            id: p.id_pack,
            nombre: p.nombre_pack,
            descripcion: p.descripcion,
            precio: p.precio_pack,
          })),
        ];
        this.productosFiltrados = [...this.productos];
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        alert('No se pudieron cargar los productos del servidor. Intente más tarde.');
      },
    });
  }

  filtrarProductos(event: any) {
    const filtro = event.target.value.toLowerCase();
    this.productosFiltrados = this.productos.filter((p) =>
      p.nombre.toLowerCase().includes(filtro)
    );
  }

  seleccionarProducto(prod: any) {
    this.productoSeleccionado = prod;
  }

  enviarSolicitud(form: any) {
    if (!form.valid) {
      alert('Complete todos los campos obligatorios.');
      return;
    }

    if (!this.productoSeleccionado) {
      alert('Seleccione un producto antes de enviar la solicitud.');
      return;
    }

    const idUsuario = this.usuario?.idUsuario || this.usuario?.id || this.usuario?.userId;

    if (!idUsuario) {
      alert('Error: El usuario no tiene un ID válido. Por favor, vuelva a iniciar sesión.');
      console.error('Usuario inválido:', this.usuario);
      return;
    }

    const solicitud = {
      idUsuario,
      nombreCliente: this.usuario?.nombre,
      dniCePasaporte: this.usuario?.dni,
      telefono: this.usuario?.telefono,
      tipoPedido: this.productoSeleccionado.tipo.toLowerCase(),
      idServicio: this.productoSeleccionado.tipo === 'servicio' ? this.productoSeleccionado.id : null,
      idPack: this.productoSeleccionado.tipo === 'pack' ? this.productoSeleccionado.id : null,
      cantidad: this.cantidad,
      fechaEntregaEstimada: this.fechaEntrega,
      descripcion: this.descripcion || this.productoSeleccionado.descripcion,
    };

    console.log('Solicitud enviada:', solicitud);

    this.http.post('http://localhost:8080/api/ordenes', solicitud).subscribe({
      next: (data) => {
        alert(`Solicitud enviada para: ${this.productoSeleccionado.nombre}`);
        this.productoSeleccionado = null;
        this.cantidad = 1;
        this.fechaEntrega = new Date().toISOString().split('T')[0];
        this.descripcion = '';
      },
      error: (err) => {
        console.error('Error al enviar la solicitud:', err);
        if (err.error?.message?.includes('idUsuario')) {
          alert('El usuario no tiene un ID válido (problablemente vacio). Vuelva a iniciar sesión.');
        } else {
          alert('No se pudo enviar la solicitud. Intente nuevamente.');
        }
      },
    });
  }

  toggleMenu() { this.menuAbierto = !this.menuAbierto; }
  toggleUserMenu() { this.userMenuAbierto = !this.userMenuAbierto; }
  logout() {
    this.authService.logout();
    localStorage.removeItem('usuario');
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
    if (!target.closest('.logo')) this.userMenuAbierto = false;
  }
}
