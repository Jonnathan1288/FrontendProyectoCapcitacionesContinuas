import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';

import { HorarioCurso } from '../models/horario-curso';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class HorarioCursoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public obtenerHorarioCurso():Observable<HorarioCurso[]>{
    return this.http.get<HorarioCurso[]>(environment.apiuri+'/horarioCurso/listar', { headers: this.storageService.returnToken()});
  }

  public getModalidadCursoById(idHorarioCurso: number):Observable<HorarioCurso>{
    return this.http.get<HorarioCurso>(environment.apiuri+'/horarioCurso/findbyId/'+idHorarioCurso, { headers: this.storageService.returnToken()});
  }

  public crearHorarioCurso(horarioCurso: HorarioCurso):Observable<HorarioCurso>{
    return this.http.post<HorarioCurso>(environment.apiuri+'/horarioCurso/crear', horarioCurso, { headers: this.storageService.returnToken()});
  }

  public updateHorarioCurso(idHorarioCurso:number, horarioCurso: HorarioCurso):Observable<HorarioCurso>{
    return this.http.put<HorarioCurso>(environment.apiuri+'/horarioCurso/update/'+idHorarioCurso, horarioCurso, { headers: this.storageService.returnToken()});
  }

}
