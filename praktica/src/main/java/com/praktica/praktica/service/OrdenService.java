package com.praktica.praktica.service;

import com.praktica.praktica.model.HistorialCambiosOrden;
import com.praktica.praktica.model.Orden;
import com.praktica.praktica.repository.HistorialCambiosOrdenRepository;
import com.praktica.praktica.repository.OrdenRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenService {
    private final OrdenRepository ordenRepository;
    private final HistorialCambiosOrdenRepository historialRepository;

    public OrdenService(OrdenRepository ordenRepository, HistorialCambiosOrdenRepository historialRepository) {
        this.ordenRepository = ordenRepository;
        this.historialRepository = historialRepository;
    }

    public Orden crearOrden(Orden orden) {
        return ordenRepository.save(orden);
    }

    public List<Orden> listarPorUsuario(Long idUsuario) {
        return ordenRepository.findByIdUsuario(idUsuario);
    }

    public Orden buscarPorId(Long idOrden) {
        return ordenRepository.findById(idOrden).orElse(null);
    }

    public Orden actualizarEstado(Long idOrden, Orden.EstadoOrden nuevoEstado) {
        Optional<Orden> opt = ordenRepository.findById(idOrden);
        if (opt.isEmpty()) return null;

        Orden orden = opt.get();
        Orden.EstadoOrden anterior = orden.getEstado();
        orden.setEstado(nuevoEstado);
        Orden actualizada = ordenRepository.save(orden);

        registrarCambio(orden, "estado", anterior.name(), nuevoEstado.name(), "Actualización de estado");
        return actualizada;
    }

    public Orden actualizarDescripcion(Long idOrden, Long idUsuario, String nuevaDescripcion, String motivo) {
        Optional<Orden> opt = ordenRepository.findById(idOrden);
        if (opt.isEmpty()) return null;

        Orden orden = opt.get();
        String anterior = orden.getDescripcion();
        orden.setDescripcion(nuevaDescripcion);
        Orden actualizada = ordenRepository.save(orden);

        registrarCambio(orden, "descripcion", anterior, nuevaDescripcion, motivo);
        return actualizada;
    }

    public void registrarCambio(Orden orden, String campo, String valorAnterior, String valorNuevo, String motivo) {
        HistorialCambiosOrden h = new HistorialCambiosOrden();
        h.setIdOrden(orden.getIdOrden());
        h.setIdUsuario(orden.getIdUsuario());
        h.setCampoModificado(campo);
        h.setValorAnterior(valorAnterior);
        h.setValorNuevo(valorNuevo);
        h.setMotivo(motivo);
        historialRepository.save(h);
    }
}
