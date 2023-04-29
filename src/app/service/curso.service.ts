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

  public listCurso():Observable<Curso[]>{
    return this.http.get<Curso[]>(environment.apiuri+'/curso/list');
  }

  public saveCurso(curso: Curso):Observable<Curso>{
    return this.http.post<Curso>(environment.apiuri+'/curso/save', curso);
  }

  public getCursoById(id_curso: number):Observable<Curso>{
    return this.http.get<Curso>(environment.apiuri+'/curso/findbyId/'+id_curso);
  }

  public obtenerTodoslosCursosPorIdUsuario(idUsuario: number):Observable<Curso[]>{
    return this.http.get<Curso[]>(environment.apiuri+'/curso/findAllIdUsuario/'+idUsuario);
  }

  public updateCurso(id_curso: number, curso: Curso):Observable<Curso>{
    return this.http.put<Curso>(environment.apiuri+'/area/actualizar/'+id_curso, curso);
  }
}
