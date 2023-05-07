import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';

import { HorarioCurso } from '../models/horario-curso';

@Injectable({
  providedIn: 'root'
})
export class HorarioCursoService {

  constructor(private http: HttpClient) { }

  public obtenerHorarioCurso():Observable<HorarioCurso[]>{
    return this.http.get<HorarioCurso[]>(environment.apiuri+'/horarioCurso/listar');
  }

  public getModalidadCursoById(idHorarioCurso: number):Observable<HorarioCurso>{
    return this.http.get<HorarioCurso>(environment.apiuri+'/horarioCurso/findbyId/'+idHorarioCurso);
  }

  public crearHorarioCurso(horarioCurso: HorarioCurso):Observable<HorarioCurso>{
    return this.http.post<HorarioCurso>(environment.apiuri+'/horarioCurso/crear', horarioCurso);
  }

  public updateHorarioCurso(idHorarioCurso:number, horarioCurso: HorarioCurso):Observable<HorarioCurso>{
    return this.http.put<HorarioCurso>(environment.apiuri+'/horarioCurso/update/'+idHorarioCurso, horarioCurso);
  }

}
