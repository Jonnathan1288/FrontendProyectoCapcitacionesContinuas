import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { ListaNecesidadCurso } from '../models/lista-necesidad-curso';

@Injectable({
  providedIn: 'root'
})
export class ListaNecesidadCursoService {

  constructor(private http: HttpClient) { }

  public listListaNecesidadCurso():Observable<ListaNecesidadCurso[]>{
    return this.http.get<ListaNecesidadCurso[]>(environment.apiuri+'/listaNecesidadCurso/list');
  }

  public saveListaNecesidadCurso(listaNecesidadCurso: ListaNecesidadCurso):Observable<ListaNecesidadCurso>{
    return this.http.post<ListaNecesidadCurso>(environment.apiuri+'/listaNecesidadCurso/save', listaNecesidadCurso);
  }

}
