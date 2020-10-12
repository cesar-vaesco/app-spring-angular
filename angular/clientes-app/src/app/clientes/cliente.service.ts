import { Injectable } from '@angular/core';
import { DatePipe, formatDate, registerLocaleData} from '@angular/common';
import localEs from '@angular/common/locales/es-MX';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable, throwError }from 'rxjs';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

/* Constructor */
  constructor( private http: HttpClient, private router:Router ) { }

  getClientes() : Observable<Cliente[]>{
   //return of(CLIENTES);
   //return this.http.get<Cliente[]>(this.urlEndPoint);
   return this.http.get(this.urlEndPoint).pipe(
     map(response => {
       
      let clientes = response as Cliente[];

      return clientes.map(cliente  => {
        cliente.nombre = cliente.nombre.toUpperCase();
        cliente.apellido = cliente.apellido.toUpperCase();
        cliente.email = cliente.email.toUpperCase();

        registerLocaleData(localEs, 'es');

        let datePipe = new DatePipe('es-MX'); 
        cliente.createAt = datePipe.transform (cliente.createAt, 'EEEE dd, MMMM yyyy');
      // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
        

        return cliente;
      });
    }
    )
   );
  }

  /*Mantienen al usuario en la misma ventana*/ 
  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        /*La lectura del error la toma de la respuesta -- formato json*/ 
        if(e.status == 400){
          return throwError(e); 
        }

        console.error(e.error.mensaje);
        swal.fire('Error al crear el cliente', e.error.mensaje,'error');
        return throwError(e);   
      })
    )
  }

  /*Redirige el error a la url de /clientes*/ 
  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {

        if(e.status == 400){
          return throwError(e); 
        }

        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
            swal.fire('Error al editar...', e.error.mensaje,'error');
            return throwError(e);
      })
    );
  }
/*Mantienen al usuario en la misma ventana*/ 
  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers:this.httpHeaders}).pipe(
      catchError(e=>{
        console.error(e.error.mensaje);
        swal.fire('Error al editar al cliente', e.error.mensaje,'error');
        return throwError(e);   
      })
    );
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.httpHeaders}).pipe(
      catchError(e=>{
        console.error(e.error.mensaje);
        swal.fire('Error al eliminar al cliente', e.error.mensaje,'error');
        return throwError(e);   
      })
    );
  }

  /** Cierre de la clase */
}
