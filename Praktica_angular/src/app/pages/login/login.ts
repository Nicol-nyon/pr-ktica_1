import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post('http://localhost:8080/api/usuarios/login', this.credentials)
      .subscribe({
        next: (response: any) => {
          alert('Inicio de sesión exitoso');
          console.log(response);

          localStorage.setItem('usuario', JSON.stringify(response));
          this.router.navigate(['/index']);
        },
        error: (err) => {
          alert('Credenciales incorrectas o error al iniciar sesión');
          console.error(err);
        }
      });
  }
}
