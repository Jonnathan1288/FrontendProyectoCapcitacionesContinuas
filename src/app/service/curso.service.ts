import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(private http: HttpClient, private storageService: StorageService) { 
  }

  public listCurso():Observable<Curso[]>{
    return this.http.get<Curso[]>(environment.apiuri+'/curso/list', { headers: this.storageService.returnToken()});
  }

  public listCursoDisponibles():Observable<Curso[]>{
    return this.http.get<Curso[]>(environment.apiuri+'/cursoDisponibles/list', { headers: this.storageService.returnToken()});
  }

  public listCursoDelParticipante(idUsuarioParticipante:number):Observable<Curso[]>{
    return this.http.get<Curso[]>(environment.apiuri+'/cursosDelParticipante/list/'+idUsuarioParticipante, { headers: this.storageService.returnToken()});
  }

  public saveCurso(curso: Curso):Observable<Curso>{
    return this.http.post<Curso>(environment.apiuri+'/curso/save', curso, { headers: this.storageService.returnToken()});
  }

  public getCursoById(id_curso: number):Observable<Curso>{
    return this.http.get<Curso>(environment.apiuri+'/curso/findbyId/'+id_curso, { headers: this.storageService.returnToken()});
  }

  public obtenerTodoslosCursosPorIdUsuario(idUsuario: number):Observable<Curso[]>{
    return this.http.get<Curso[]>(environment.apiuri+'/curso/findAllIdUsuario/'+idUsuario, { headers: this.storageService.returnToken()});
  }

  public updateCurso(id_curso: number, curso: Curso):Observable<Curso>{
    return this.http.put<Curso>(environment.apiuri+'/curso/update/'+id_curso, curso, { headers: this.storageService.returnToken()});
  }

  //Metodo para mostrar todos los programas
}