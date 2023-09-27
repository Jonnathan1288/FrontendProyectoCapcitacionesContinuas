import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  //Método para mostrar todos los programas -- new

  public findByAllCurseFinally(): Observable<CourseFilter[]> {
    return this.http.get<CourseFilter[]>(environment.apiuri + '/curso/findAll/course/finally');
  }

  public findFilterCoursesByUsuarioDocente(idUser: number): Observable<CourseFilter[]> {
    return this.http.get<CourseFilterDocente[]>(environment.apiuri + '/curso/findFilterCoursesByUsuarioDocente/' + idUser);
  }

  public findByIdUsuarioEstadoCursoFinalizado(idUser: number): Observable<CourseFilter[]> {
    return this.http.get<CourseFilterDocente[]>(environment.apiuri + '/curso/findByIdUsuarioEstadoCursoFinalizado/' + idUser);
  }

  public findByAllPaginator(page: number, size: number, sort: string[]): Observable<Curso[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort.join(','))
    console.log(params);
    return this.http.get<Curso[]>(environment.apiuri + '/curso/pageable', { params });
  }

  public findByCapacitadorUsuarioIdUsuarioPageable(idUser: number, page: number, size: number, sort: string[]): Observable<Curso[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort.join(','))
    console.log(params);
    return this.http.get<Curso[]>(environment.apiuri + '/curso/findByCapacitadorUsuarioIdUsuarioPageable/' + idUser, { params });
  }
}