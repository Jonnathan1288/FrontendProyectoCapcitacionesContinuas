import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { ParticipantesMatriculados } from '../models/participantesMatriculados';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { ListApproved } from '../models/references/list-approved';
import { MatriculadoReduce } from '../models/references/matriculado.reduce';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteMatriculadoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getParticipantesMatriculadosById(idPatMatriculado: number): Observable<ParticipantesMatriculados> {
    return this.http.get<ParticipantesMatriculados>(environment.apiuri + '/participantesMatriculados/findbyId/' + idPatMatriculado);
  }

  public saveParticipantesMatriculados(participantesMatriculados: ParticipantesMatriculados): Observable<ParticipantesMatriculados> {
    return this.http.post<ParticipantesMatriculados>(environment.apiuri + '/participantesMatriculados/crear', participantesMatriculados);
  }

  public getParticipantesMatriculadosByIdCurso(idCurso: number): Observable<ParticipantesMatriculados[]> {
    return this.http.get<ParticipantesMatriculados[]>(environment.apiuri + '/participantesMatriculados/findbyIdCursoMatriculados/' + idCurso);
  }

  public pasarEstudiantesMatriculados(idCurso: number) {
    return this.http.get(environment.apiuri + '/participantesMatriculados/aceptarInicioCurso/' + idCurso);
  }

  public updateParticipantesMatriculados(idPatMatriculado: number, participantesMatriculados: ParticipantesMatriculados): Observable<ParticipantesMatriculados> {
    return this.http.put<ParticipantesMatriculados>(environment.apiuri + '/participantesMatriculados/actualizar/' + idPatMatriculado, participantesMatriculados);
  }

  //News methods------------------
  public findALlParticipantesAprovadosByIdCursos(courses: number[]): Observable<ListApproved[]> {
    return this.http.post<ListApproved[]>(environment.apiuri + '/all/participantesAprovados/findbyIdCourse', courses);
  }

  //Reportes que va tener el admin..
  public getReportParticipantsApproved(courses: number[]): Observable<Blob> {
    return this.http.post(environment.apiuri + '/generate/exportExcel', courses, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  public findByAllMatriculadoCursoDocenteCapacitador(idCurso: number): Observable<MatriculadoReduce[]> {
    return this.http.get<MatriculadoReduce[]>(environment.apiuri + '/participantesMatriculados/findByAllMatriculadoCursoDocenteCapacitador/' + idCurso);
  }

}

