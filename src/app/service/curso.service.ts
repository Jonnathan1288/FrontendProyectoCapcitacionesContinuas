import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(private http: HttpClient) { }

  public listListaNecesidadCurso():Observable<Curso[]>{
    return this.http.get<Curso[]>(environment.apiuri+'/curso/list');
  }

  public saveListaNecesidadCurso(curso: Curso):Observable<Curso>{
    return this.http.post<Curso>(environment.apiuri+'/curso/save', curso);
  }

  public getCursoById(id_curso: number):Observable<Curso>{
    return this.http.get<Curso>(environment.apiuri+'/curso/findbyId/'+id_curso);
  }
}
