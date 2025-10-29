package com.praktica.praktica.service;

import com.praktica.praktica.repository.ServicioRepository;
import com.praktica.praktica.repository.PackRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ProductoService {
    private final ServicioRepository servicioRepository;
    private final PackRepository packRepository;

    public ProductoService(ServicioRepository servicioRepository, PackRepository packRepository) {
        this.servicioRepository = servicioRepository;
        this.packRepository = packRepository;
    }

    public Map<String, Object> obtenerProductos() {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("servicios", servicioRepository.findByEstado("activo"));
        respuesta.put("packs", packRepository.findByEstado("activo"));
        return respuesta;
    }
}