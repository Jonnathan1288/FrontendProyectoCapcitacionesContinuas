import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Inscrito } from '../models/inscrito';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';


@Injectable({
  providedIn: 'root'
})
export class inscritosService {

  constructor(private http: HttpClient) { }

  public getInscrioParaCursoById(idInscrito: number):Observable<Inscrito>{
    return this.http.get<Inscrito>(environment.apiuri+'/inscritocurso/findbyId/'+idInscrito);
  }

  public getInscritoByIdUsuario(idCurso:number,idUsario: number):Observable<Inscrito>{
    return this.http.get<Inscrito>(environment.apiuri+'/usuarioInscrito/findbyIdUsuario/'+idCurso+'/'+idUsario);
  }

  public saveInscrioParaCurso(inscrito: Inscrito):Observable<Inscrito>{
    return this.http.post<Inscrito>(environment.apiuri+'/inscritocurso/crear', inscrito);
  }

  public getInscritosPorCurso(idCurso: number):Observable<Inscrito[]>{
    return this.http.get<Inscrito[]>(environment.apiuri+'/inscritocursoPorCurso/findbyIdCurso/'+idCurso);
  }

  public aprbarOdesaprobarInscrito(id:number, inscrito: Inscrito):Observable<Inscrito>{
    return this.http.put<Inscrito>(environment.apiuri+'/inscritocurso/update/'+id, inscrito);
  }

  public getInscrioValidacion(idCurso:number,idUsario: number){
    return this.http.get<boolean>(environment.apiuri+'/validarCursoAplicadoUsuario/findbyIdCursoAndIdUsuario/'+idCurso+'/'+idUsario);
  }
}
