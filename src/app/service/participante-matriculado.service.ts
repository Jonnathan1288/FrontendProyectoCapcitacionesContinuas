import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { ParticipantesMatriculados } from '../models/participantesMatriculados';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { ListApproved } from '../models/references/list-approved';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteMatriculadoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getParticipantesMatriculadosById(idPatMatriculado: number): Observable<ParticipantesMatriculados> {
    return this.http.get<ParticipantesMatriculados>(environment.apiuri + '/participantesMatriculados/findbyId/' + idPatMatriculado, { headers: this.storageService.returnToken() });
  }

  public saveParticipantesMatriculados(participantesMatriculados: ParticipantesMatriculados): Observable<ParticipantesMatriculados> {
    return this.http.post<ParticipantesMatriculados>(environment.apiuri + '/participantesMatriculados/crear', participantesMatriculados, { headers: this.storageService.returnToken() });
  }

  public getParticipantesMatriculadosByIdCurso(idCurso: number): Observable<ParticipantesMatriculados[]> {
    return this.http.get<ParticipantesMatriculados[]>(environment.apiuri + '/participantesMatriculados/findbyIdCursoMatriculados/' + idCurso, { headers: this.storageService.returnToken() });
  }

  public pasarEstudiantesMatriculados(idCurso: number) {
    return this.http.get(environment.apiuri + '/participantesMatriculados/aceptarInicioCurso/' + idCurso, { headers: this.storageService.returnToken() });
  }

  public updateParticipantesMatriculados(idPatMatriculado: number, participantesMatriculados: ParticipantesMatriculados): Observable<ParticipantesMatriculados> {
    return this.http.put<ParticipantesMatriculados>(environment.apiuri + '/participantesMatriculados/actualizar/' + idPatMatriculado, participantesMatriculados, { headers: this.storageService.returnToken() });
  }

  //News methods

  public findALlParticipantesAprovadosByIdCursos(courses: number[]): Observable<ListApproved[]> {
    return this.http.post<ListApproved[]>(environment.apiuri + '/all/participantesAprovados/findbyIdCourse', courses, { headers: this.storageService.returnToken() });
  }

  //Reportes que va tener el admin..
  public getReportParticipantsApproved(courses: number[]): Observable<Blob> {
    return this.http.post(environment.apiuri + '/generate/exportExcel', courses, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

}

