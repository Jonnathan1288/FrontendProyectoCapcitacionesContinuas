import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Inscrito } from '../models/inscrito';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class inscritosService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getInscrioParaCursoById(idInscrito: number):Observable<Inscrito>{
    return this.http.get<Inscrito>(environment.apiuri+'/inscritocurso/findbyId/'+idInscrito, { headers: this.storageService.returnToken()});
  }

  public getInscritoByIdUsuario(idCurso:number,idUsario: number):Observable<Inscrito>{
    return this.http.get<Inscrito>(environment.apiuri+'/usuarioInscrito/findbyIdUsuario/'+idCurso+'/'+idUsario, { headers: this.storageService.returnToken()});
  }

  public saveInscrioParaCurso(inscrito: Inscrito):Observable<Inscrito>{
    return this.http.post<Inscrito>(environment.apiuri+'/inscritocurso/crear', inscrito, { headers: this.storageService.returnToken()});
  }

  public getInscritosPorCurso(idCurso: number):Observable<Inscrito[]>{
    return this.http.get<Inscrito[]>(environment.apiuri+'/inscritocursoPorCurso/findbyIdCurso/'+idCurso, { headers: this.storageService.returnToken()});
  }

  public aprbarOdesaprobarInscrito(id:number, inscrito: Inscrito):Observable<Inscrito>{
    return this.http.put<Inscrito>(environment.apiuri+'/inscritocurso/update/'+id, inscrito, { headers: this.storageService.returnToken()});
  }

  public getInscrioValidacion(idCurso:number,idUsario: number){
    return this.http.get<boolean>(environment.apiuri+'/validarCursoAplicadoUsuario/findbyIdCursoAndIdUsuario/'+idCurso+'/'+idUsario, { headers: this.storageService.returnToken()});
  }
}
