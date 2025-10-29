package com.praktica.praktica.service;

import com.praktica.praktica.model.Usuario;
import com.praktica.praktica.model.Rol;
import com.praktica.praktica.repository.UsuarioRepository;
import com.praktica.praktica.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()) != null) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Rol rolCliente = rolRepository.findByNombreRol("cliente")
                .orElseThrow(() -> new RuntimeException("Rol 'cliente' no encontrado en la base de datos"));

        usuario.setRol(rolCliente);
        return usuarioRepository.save(usuario);
    }


    public Usuario loginUsuario(String email, String contrasena) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario != null && usuario.getContrasena().equals(contrasena)) {
            return usuario;
        }
        return null;
    }
}
