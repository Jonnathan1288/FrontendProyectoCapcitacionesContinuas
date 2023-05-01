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

  public saveInscrioParaCurso(inscrito: Inscrito):Observable<Inscrito>{
    return this.http.post<Inscrito>(environment.apiuri+'/inscritocurso/crear', inscrito);
  }


  

}
