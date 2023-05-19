import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { NececidadCurso } from '../models/nececidad-curso';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class NecesidadCursoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public obtenerNecesidadCurso():Observable<NececidadCurso[]>{
    return this.http.get<NececidadCurso[]>(environment.apiuri+'/necesidadCurso/listar', { headers: this.storageService.returnToken()});
  }

  public crearNecesidadCurso(necesidadCurso: NececidadCurso):Observable<NececidadCurso>{
    return this.http.post<NececidadCurso>(environment.apiuri+'/necesidadCurso/crear', necesidadCurso, { headers: this.storageService.returnToken()});
  }

  public getNecesidadCursoById(id_curso: number):Observable<NececidadCurso>{
    return this.http.get<NececidadCurso>(environment.apiuri+'/necesidadCurso/findbyId/'+id_curso, { headers: this.storageService.returnToken()});
  }

  public getNecesidadCursoByIdCurso(id_curso: number):Observable<NececidadCurso>{
    return this.http.get<NececidadCurso>(environment.apiuri+'/necesidadCurso/findbyIdCurso/'+id_curso, { headers: this.storageService.returnToken()});
  }

  public updateNecesidadCurso(idNecesidadCurso:number, necesidadCurso: NececidadCurso):Observable<NececidadCurso>{
    return this.http.put<NececidadCurso>(environment.apiuri+'/necesidadCurso/actualizar/'+idNecesidadCurso, necesidadCurso, { headers: this.storageService.returnToken()});
  }
}
