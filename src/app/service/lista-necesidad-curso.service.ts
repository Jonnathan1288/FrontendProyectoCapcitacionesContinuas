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

  public findByNecesidadCurso_IdNecesidadCurso(idPrograma: number):Observable<any>{
    return this.http.get<any>(environment.apiuri+'/listaNecesidadCurso/findbyIdNecesidad/'+idPrograma);
  }

  public saveListaNecesidadCurso(listaNecesidadCurso: ListaNecesidadCurso):Observable<ListaNecesidadCurso>{
    return this.http.post<ListaNecesidadCurso>(environment.apiuri+'/listaNecesidadCurso/save', listaNecesidadCurso);
  }

  public getListaNecesidadCursoById(idListNecesidadC: number):Observable<ListaNecesidadCurso>{
    return this.http.get<ListaNecesidadCurso>(environment.apiuri+'/listaNecesidadCurso/findbyId/'+idListNecesidadC);
  }
  
  public updateListaNecesidadCurso(idListaNecesidadCurso:number, listaNecesidadCurso: ListaNecesidadCurso):Observable<ListaNecesidadCurso>{
    return this.http.put<ListaNecesidadCurso>(environment.apiuri+'/listaNecesidadCurso/actualizar/'+idListaNecesidadCurso, listaNecesidadCurso);
  }

}
