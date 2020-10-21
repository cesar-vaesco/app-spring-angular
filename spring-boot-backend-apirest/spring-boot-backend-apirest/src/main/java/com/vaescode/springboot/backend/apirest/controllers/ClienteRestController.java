package com.vaescode.springboot.backend.apirest.controllers;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.management.RuntimeErrorException;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.vaescode.springboot.backend.apirest.models.entity.Cliente;

import com.vaescode.springboot.backend.apirest.models.service.IClienteService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api")
public class ClienteRestController {

	private static final Logger log = LoggerFactory.getLogger(ClienteRestController.class);

	@Autowired
	private IClienteService clienteService;

	@GetMapping("/clientes")
	public List<Cliente> index() {
		return clienteService.findAll();
	}

	@GetMapping("/clientes/page/{page}")
	public Page<Cliente> index(@PathVariable Integer page) {
		Pageable pageable = PageRequest.of(page, 4);
		return clienteService.findAll(pageable);
	}

	/* http://localhost:8080/api/clientes/{id} */
	@GetMapping("/clientes/{id}")
	public ResponseEntity<?> show(@PathVariable Long id) {

		Cliente cliente = null;
		Map<String, Object> response = new HashMap<>();
		try {
			cliente = clienteService.findById(id);
		} catch (DataAccessException e) {
			response.put("mensaje", "Error al realizar la consulta en la base de datos !");
			response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		if (cliente == null) {

			response.put("mensaje", "El cliente ID: ".concat(id.toString().concat(" no existe en la base de datos!")));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		log.info("ID del cliente encontrado: " + cliente.getId());

		return new ResponseEntity<Cliente>(cliente, HttpStatus.OK);
	}

	/*
	 * @Valid valida las anotaciones de validación marcadas en los atributos de el
	 * Objeto Cliente.Java
	 */
	/**
	 * @param cliente
	 * @param result
	 * @return
	 */
	@PostMapping("/clientes")
	public ResponseEntity<?> create(@Valid @RequestBody Cliente cliente, BindingResult result) {

		Cliente clienteNew = null;
		Map<String, Object> response = new HashMap<>();

		if (result.hasErrors()) {

			/*
			 * List<String> errors = new ArrayList<>(); for(FieldError err:
			 * result.getFieldErrors()) { errors.add("El campo '"+err.getField()+"' " +
			 * err.getDefaultMessage()); }
			 */

			List<String> errors = result.getFieldErrors().stream()
					.map(err -> "El campo '" + err.getField() + "' " + err.getDefaultMessage())
					.collect(Collectors.toList());

			response.put("errors", errors);
			log.info("Log: error al validar el registro");
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}

		try {
			clienteNew = clienteService.save(cliente);
		} catch (DataAccessException e) {
			log.info("Log: error al crear el registro");
			response.put("mensaje", "Error al realizar el insert en la base de datos !");
			response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		log.info("Log: cliente creado " + clienteNew);
		response.put("mensaje", "El cliente ha sido creado con éxito!!");
		response.put("cliente", clienteNew);
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
	}

	@PutMapping("/clientes/{id}")
	public ResponseEntity<?> update(@Valid @RequestBody Cliente cliente, BindingResult result, @PathVariable Long id) {

		Cliente clienteActual = clienteService.findById(id);
		Cliente clienteUpdate = null;

		Map<String, Object> response = new HashMap<>();

		if (result.hasErrors()) {

			/*
			 * List<String> errors = new ArrayList<>(); for(FieldError err:
			 * result.getFieldErrors()) { errors.add("El campo '"+err.getField()+"' " +
			 * err.getDefaultMessage()); }
			 */

			List<String> errors = result.getFieldErrors().stream()
					.map(err -> "El campo '" + err.getField() + "' " + err.getDefaultMessage())
					.collect(Collectors.toList());

			response.put("errors", errors);
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
		}

		if (clienteActual == null) {

			response.put("mensaje", "Error: no se puede editar, el cliente ID: "
					.concat(id.toString().concat(" no existe en la base de datos!")));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}

		try {
			clienteActual.setNombre(cliente.getNombre());
			clienteActual.setApellido(cliente.getApellido());
			clienteActual.setEmail(cliente.getEmail());
			clienteActual.setCreateAt(cliente.getCreateAt());

			clienteUpdate = clienteService.save(clienteActual);
		} catch (DataAccessException e) {
			log.info("Log: error al actualizar el registro");
			response.put("mensaje", "Error al actualizar en la base de datos !");
			response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		response.put("mensaje", "El cliente ha sido actualizado con éxito!!");
		response.put("cliente", clienteUpdate);
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
	}

	/*
	 * http://localhost:8080/api/clientes/{id}
	 */
	@DeleteMapping("/clientes/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id) {
		Map<String, Object> response = new HashMap<>();
		try {
			Cliente cliente = clienteService.findById(id);
			String nombreFotoAnterior = cliente.getFoto();

			if (nombreFotoAnterior != null && nombreFotoAnterior.length() > 0) {
				Path rutaFotoAnterior = Paths.get("C:\\Users\\thece\\Pictures\\imagenes-proyecto")
						.resolve(nombreFotoAnterior).toAbsolutePath();
				File archivoFotoAnterior = rutaFotoAnterior.toFile();
				if (archivoFotoAnterior.exists() && archivoFotoAnterior.canRead()) {
					archivoFotoAnterior.delete();
				}
			}

			clienteService.delete(id);
		} catch (DataAccessException e) {
			log.info("Log: error al eliminar el registro");
			response.put("mensaje", "Error al eliminar el cliente en la base de datos !");
			response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		response.put("mensaje", "El cliente ha sido eliminado con éxito!!");

		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.OK);
	}

	@PostMapping("/clientes/upload")
	public ResponseEntity<?> upload(@RequestParam("archivo") MultipartFile archivo, @RequestParam("id") Long id) {
		Map<String, Object> response = new HashMap<>();

		Cliente cliente = clienteService.findById(id);

		if (!archivo.isEmpty()) {

			String nombreArchivo = UUID.randomUUID().toString() + "_" + archivo.getOriginalFilename().replace(" ", "");

			Path rutaArchivo = Paths.get("C:\\Users\\thece\\Pictures\\imagenes-proyecto").resolve(nombreArchivo)
					.toAbsolutePath();

			log.info(rutaArchivo.toString());

			try {
				Files.copy(archivo.getInputStream(), rutaArchivo);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				response.put("mensaje", "Error al subor la imagen del cliente " + nombreArchivo);
				response.put("error", e.getMessage().concat(": ").concat(e.getCause().getMessage()));
				return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
			}

			String nombreFotoAnterior = cliente.getFoto();

			if (nombreFotoAnterior != null && nombreFotoAnterior.length() > 0) {
				Path rutaFotoAnterior = Paths.get("C:\\Users\\thece\\Pictures\\imagenes-proyecto")
						.resolve(nombreFotoAnterior).toAbsolutePath();
				File archivoFotoAnterior = rutaFotoAnterior.toFile();
				if (archivoFotoAnterior.exists() && archivoFotoAnterior.canRead()) {
					archivoFotoAnterior.delete();
				}
			}

			cliente.setFoto(nombreArchivo);

			clienteService.save(cliente);
			response.put("cliente", cliente);
			response.put("mensaje", "Haz subido correctamente la imagen " + nombreArchivo);

		}

		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
	}

	/*
	 * POST -> http://localhost:8080/api/clientes/upload
	 * 
	 * Al probar en postman se requiere pasar una imagen y el ID del cliente que se
	 * va a actualizar
	 * 
	 * Postman - body - form-data key: archivo value: dirección de la imagen key: id
	 * value: registro a actualizar
	 * 
	 * archivo y id son requisitos de parametro
	 */

	@GetMapping("/uploads/img/{nombreFoto:.+}")
	public ResponseEntity<Resource> verFoto(@PathVariable String nombreFoto) {

		Path rutaArchivo = Paths.get("C:\\Users\\thece\\Pictures\\imagenes-proyecto").resolve(nombreFoto)
				.toAbsolutePath();
		log.info(rutaArchivo.toString());
		Resource recurso = null;
		try {
			recurso = new UrlResource(rutaArchivo.toUri());
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}

		// Validar la existencia del recurso
		if (!recurso.exists() && !recurso.isReadable()) {
			rutaArchivo = Paths.get("src/main/resources/static/images").resolve("no-usuario.png")
					.toAbsolutePath();
			try {
				recurso = new UrlResource(rutaArchivo.toUri());
			} catch (MalformedURLException e) {
				e.printStackTrace();
			}
			log.error("Error la intentar cargar la imagen: " + nombreFoto);
		}

		HttpHeaders cabecera = new HttpHeaders();
		cabecera.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename= \"" + recurso.getFilename() + "\"");

		return new ResponseEntity<Resource>(recurso, cabecera, HttpStatus.OK);
	}

}
