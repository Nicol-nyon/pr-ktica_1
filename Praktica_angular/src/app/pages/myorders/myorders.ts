import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-myorders',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './myorders.html',
  styleUrls: ['./myorders.css'],
})
export class MisSolicitudesComponent implements OnInit {
  usuario: any;
  menuAbierto = false;
  userMenuAbierto = false;

  modalAbierto = false;
  modalDetalleAbierto = false;
  modalConfirmarAbierto = false;

  ordenSeleccionada: any = null;
  ordenEdit: any = {};
  ordenes: any[] = [];
  ordenesFiltradas: any[] = [];

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
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.renderer.setStyle(document.body, 'overflow', 'auto');
    this.renderer.setStyle(document.documentElement, 'overflow', 'auto');
    if (this.usuario) this.cargarOrdenes();
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
    if (!target.closest('.logo')) this.userMenuAbierto = false;
  }

  cargarOrdenes(): void {
    const idUsuario = this.usuario?.id_usuario || this.usuario?.idUsuario;
    this.http.get<any[]>(`http://localhost:8080/api/ordenes/usuario/${idUsuario}`).subscribe({
      next: (data) => {
        this.ordenes = data.map(o => ({
          id_orden: o.idOrden ?? o.id_orden,
          tipo_pedido: o.tipoPedido ?? o.tipo_pedido,
          cantidad: o.cantidad,
          fecha_entrega_estimada: o.fechaEntregaEstimada ?? o.fecha_entrega_estimada,
          estado: o.estado,
          fecha_creacion: o.fechaCreacion ?? o.fecha_creacion,
          descripcion: o.descripcion,
          nombre_cliente: o.nombreCliente ?? o.nombre_cliente
        }));
        this.ordenesFiltradas = [...this.ordenes];
      },
      error: (err) => {
        console.error('Error al cargar órdenes:', err);
      }
    });
  }

  filtrarOrdenes(event: any): void {
    const filtro = event.target.value.toLowerCase();
    this.ordenesFiltradas = this.ordenes.filter(o =>
      o.tipo_pedido?.toLowerCase().includes(filtro) ||
      o.estado?.toLowerCase().includes(filtro) ||
      o.id_orden?.toString().includes(filtro)
    );
  }

  acortarDescripcion(texto: string, maxPalabras: number): string {
    if (!texto) return '';
    const palabras = texto.split(' ');
    return palabras.length > maxPalabras
      ? palabras.slice(0, maxPalabras).join(' ') + '...'
      : texto;
  }

  verDetalles(orden: any): void {
    this.ordenSeleccionada = orden;
    this.modalDetalleAbierto = true;
  }

  cerrarModalDetalle(): void {
    this.modalDetalleAbierto = false;
    this.ordenSeleccionada = null;
  }

  editarOrden(orden: any): void {
    if (orden.estado !== 'pendiente') return;
    this.ordenSeleccionada = { ...orden };
    this.ordenEdit = {
      descripcion: orden.descripcion || '',
      cantidad: orden.cantidad,
      fecha_entrega_estimada: orden.fecha_entrega_estimada?.split('T')[0] || ''
    };
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.ordenSeleccionada = null;
  }

  guardarCambios(): void {
    if (!this.ordenSeleccionada) return;
    const { descripcion, cantidad, fecha_entrega_estimada } = this.ordenEdit;
    this.actualizarOrden(
      this.ordenSeleccionada.id_orden,
      descripcion,
      cantidad,
      fecha_entrega_estimada
    );
    this.modalAbierto = false;
  }

  actualizarOrden(idOrden: number, descripcion?: string, cantidad?: number, fechaEntrega?: string): void {
    const idUsuario = this.usuario?.id_usuario || this.usuario?.idUsuario;
    const params = new URLSearchParams();
    params.set('idUsuario', idUsuario);
    if (descripcion) params.set('descripcion', descripcion);
    if (cantidad !== undefined) params.set('cantidad', cantidad.toString());
    if (fechaEntrega) params.set('fechaEntregaEstimada', fechaEntrega);
    params.set('motivo', 'Edición manual de orden');

    this.http.put(`http://localhost:8080/api/ordenes/${idOrden}/detalles?${params.toString()}`, {}).subscribe({
      next: () => this.cargarOrdenes(),
      error: (err) => console.error('Error al actualizar la orden:', err)
    });
  }

  cancelarOrden(orden: any): void {
    this.ordenSeleccionada = orden;
    this.modalConfirmarAbierto = true;
  }

  cerrarModalConfirmar(): void {
    this.modalConfirmarAbierto = false;
    this.ordenSeleccionada = null;
  }

  confirmarCancelacion(): void {
    if (!this.ordenSeleccionada) return;
    this.http.put(`http://localhost:8080/api/ordenes/${this.ordenSeleccionada.id_orden}/estado?estado=cancelado`, {}).subscribe({
      next: () => {
        this.modalConfirmarAbierto = false;
        this.ordenSeleccionada = null;
        this.cargarOrdenes();
      },
      error: (err) => console.error('Error al cancelar orden:', err)
    });
  }
}
