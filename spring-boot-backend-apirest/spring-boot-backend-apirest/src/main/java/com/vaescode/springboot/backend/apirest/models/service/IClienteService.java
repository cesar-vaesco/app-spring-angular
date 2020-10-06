package com.vaescode.springboot.backend.apirest.models.service;

import java.util.List;

import com.vaescode.springboot.backend.apirest.models.entity.Cliente;

public interface IClienteService {

	
	public List<Cliente> findAll();
}
