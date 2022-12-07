import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }

  getProductsAll(): Observable<any> {
    return this.http.get(`${baseUrl}/Produtos`);
  }

  createPedido(value: any): Observable<any> {
    return this.http.post(`${baseUrl}/Pedidos`, value);
  }

  updatePedido(id: any, value: any): Observable<any> {
    return this.http.put(`${baseUrl}/Pedidos/${id}`, value);
  }

  deletePedido(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/Pedidos/${id}`);
  }

  getPedido(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/Pedidos/${id}`);
  }

  getPedidoAll(): Observable<any> {
    return this.http.get(`${baseUrl}/Pedidos`);
  }

}
