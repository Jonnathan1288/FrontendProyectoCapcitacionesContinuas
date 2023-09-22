import { Injectable } from '@angular/core';
import { Capacitador } from '../models/capacitador';
import { environment } from 'src/environment/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CapacitadorService {

  constructor(private http: HttpClient, private storageService: StorageService) {}
  
  public getAllCapacitador(): Observable<Capacitador[]> {
    return this.http.get<Capacitador[]>(environment.apiuri + '/capacitador/list');
  }

  public getCapacitadorById(idCapacitador: number): Observable<Capacitador> {
    return this.http.get<Capacitador>(environment.apiuri + '/capacitador/findbyId/' + idCapacitador);
  }

  public getCapacitadorByUsuarioIdUsuario(idUsuario: number): Observable<Capacitador> {
    return this.http.get<Capacitador>(environment.apiuri + '/capacitador/findbyIdUsuario/' + idUsuario);
  }

  public saveCapacitador(capacitador: Capacitador):Observable<Capacitador>{
    return this.http.post<Capacitador>(environment.apiuri+'/capacitador/save', capacitador);
  }

  public updateCapacitador(idCapacitador: number, capacitador: Capacitador):Observable<Capacitador>{
    return this.http.put<Capacitador>(environment.apiuri+'/capacitador/actualizar/'+idCapacitador, capacitador);
  }

  public existsCapacitadorByUsuarioIdUsuario(idUsuario: number):Observable<Boolean>{
    return this.http.get<Boolean>(environment.apiuri+'/capacitador/exists/findbyIdUsuario/'+idUsuario);
  }

  //PARA PETICIONES PUBLICAS DE VALIDACIONES--------------------------------------------------------------------------

}
