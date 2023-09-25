import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { CourseFilter } from '../models/references/course-filter';
import { CourseFilterDocente } from '../models/references/course-filter-by-docente';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(private http: HttpClient, private storageService: StorageService) {
  }

  public listCurso(): Observable<Curso[]> {
    return this.http.get<Curso[]>(environment.apiuri + '/curso/list');
  }

  public listCursoDisponibles(): Observable<Curso[]> {
    return this.http.get<Curso[]>(environment.apiuri + '/curso/cursoDisponibles/list');
  }

  public listCursoDelParticipante(idUsuarioParticipante: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(environment.apiuri + '/curso/cursosDelParticipante/list/' + idUsuarioParticipante);
  }

  public saveCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(environment.apiuri + '/curso/save1', curso);
  }

  public getCursoById(id_curso: number): Observable<Curso> {
    return this.http.get<Curso>(environment.apiuri + '/curso/findbyId/' + id_curso);
  }

  public obtenerTodoslosCursosPorIdUsuario(idUsuario: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(environment.apiuri + '/curso/findAllIdUsuario/' + idUsuario);
  }

  public updateCurso(id_curso: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(environment.apiuri + '/curso/update1/' + id_curso, curso);
  }

  //Metodo para mostrar todos los programas

  public findByAllCurseFinally(): Observable<CourseFilter[]> {
    return this.http.get<CourseFilter[]>(environment.apiuri + '/curso/findAll/course/finally');
  }

  public findFilterCoursesByUsuarioDocente(idUser: number): Observable<CourseFilter[]> {
    return this.http.get<CourseFilterDocente[]>(environment.apiuri + '/curso/findFilterCoursesByUsuarioDocente/' + idUser);
  }
}