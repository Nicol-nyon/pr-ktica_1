import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  user = {
    nombre: '',
    apellido: '',
    email: '',
    empresa: '',
    contrasena: '',
    confirmPassword: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.user.contrasena !== this.user.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const body = {
      nombre: this.user.nombre,
      apellido: this.user.apellido,
      email: this.user.email,
      empresa: this.user.empresa,
      contrasena: this.user.contrasena
    };

    this.http.post('http://localhost:8080/api/usuarios/registro', body)
      .subscribe({
        next: (usuario: any) => {
          alert('Usuario registrado correctamente');
          console.log('Usuario devuelto por el backend:', usuario);

          localStorage.setItem('usuario', JSON.stringify(usuario));

          this.router.navigate(['/index']);
        },
        error: (err) => {
          if (err.status === 409) {
            alert('El correo ya está registrado');
          } else {
            alert('Error al registrar usuario');
          }
          console.error('Error en registro:', err);
        }
      });
  }
}
