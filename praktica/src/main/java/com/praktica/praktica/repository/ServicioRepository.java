package com.praktica.praktica.repository;

import com.praktica.praktica.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServicioRepository extends JpaRepository<Servicio, Integer> {
    List<Servicio> findByEstado(String estado);
}