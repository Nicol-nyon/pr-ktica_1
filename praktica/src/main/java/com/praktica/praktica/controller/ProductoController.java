package com.praktica.praktica.controller;

import com.praktica.praktica.service.ProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public Map<String, Object> listarProductos() {
        Map<String, Object> response = new HashMap<>();
        try {
            response = productoService.obtenerProductos();
            response.put("status", "ok");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("mensaje", e.getMessage());
        }
        return response;
    }
}
