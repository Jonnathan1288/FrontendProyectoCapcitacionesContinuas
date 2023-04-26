import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { NececidadCurso } from '../models/nececidad-curso';

@Injectable({
  providedIn: 'root'
})
export class NecesidadCursoService {

  constructor(private http: HttpClient) { }

  public obtenerNecesidadCurso():Observable<NececidadCurso[]>{
    return this.http.get<NececidadCurso[]>(environment.apiuri+'/necesidadCurso/listar');
  }

  public crearNecesidadCurso(necesidadCurso: NececidadCurso):Observable<NececidadCurso>{
    return this.http.post<NececidadCurso>(environment.apiuri+'/necesidadCurso/crear', necesidadCurso);
  }

  public getNecesidadCursoById(id_curso: number):Observable<NececidadCurso>{
    return this.http.get<NececidadCurso>(environment.apiuri+'/necesidadCurso/findbyId/'+id_curso);
  }
}
