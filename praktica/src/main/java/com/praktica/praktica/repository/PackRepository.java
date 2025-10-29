package com.praktica.praktica.repository;

import com.praktica.praktica.model.Pack;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PackRepository extends JpaRepository<Pack, Integer> {
    List<Pack> findByEstado(String estado);
}
