import { Injectable } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';

import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  /* Constructor */
  constructor(private http: HttpClient, private router: Router) {}

  getClientes(page: number): Observable<any> {
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      }),
      map((response: any) => {
        (response.content as Cliente[]).map((cliente) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.apellido = cliente.apellido.toUpperCase();
          cliente.email = cliente.email.toUpperCase();

          //let datePipe = new DatePipe('es-MX');
          //cliente.createAt = datePipe.transform (cliente.createAt, 'EEEE dd, MMMM yyyy');
          // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');

          return cliente;
        });
        return response;
      }),
      tap((response) => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      })
    );
  }

  /*tap, el cual mira el valor de los observables, hace algo con estos valores y los pasa.
   * La llamada de vuelta de tap no modifica propiamente los valores.*/

  /*Mantienen al usuario en la misma ventana*/
  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post<Cliente>(this.urlEndPoint, cliente, { headers: this.httpHeaders })
      .pipe(
        catchError((e) => {
          /*La lectura del error la toma de la respuesta -- formato json*/
          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error.mensaje);
          swal.fire('Error al crear el cliente', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  /*Redirige el error a la url de /clientes*/
  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        if (e.status == 400) {
          return throwError(e);
        }

        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar...', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
  /*Mantienen al usuario en la misma ventana*/
  update(cliente: Cliente): Observable<Cliente> {
    return this.http
      .put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.error(e.error.mensaje);
          swal.fire('Error al editar al cliente', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.error(e.error.mensaje);
          swal.fire('Error al eliminar al cliente', e.error.mensaje, 'error');
          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    /**'archivo' - 'id'  son nombrados igual como fueron nombrados en el backend*/
    formData.append('archivo', archivo);
    formData.append('id', id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

  /** Cierre de la clase */
}
