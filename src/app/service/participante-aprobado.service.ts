import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { ParticipantesAprobados } from '../models/participantes-aprobados';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { ParticipantesMatriculados } from '../models/participantesMatriculados';
import { ParticipantsApproved } from '../models/references/participants-approved';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteAprobadoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getParticipantesAprobadosById(idPatAprovado: number): Observable<ParticipantesAprobados> {
    return this.http.get<ParticipantesAprobados>(environment.apiuri + '/participantesAprobados/findbyId/' + idPatAprovado);
  }

  public saveParticipantesAprobados(participantesAprobados: ParticipantesAprobados): Observable<ParticipantesAprobados> {
    return this.http.post<ParticipantesAprobados>(environment.apiuri + '/participantesAprobados/crear', participantesAprobados);
  }

  public getAllParticipantesAprobadosByIdCurso(idCurso: number): Observable<ParticipantesAprobados[]> {
    return this.http.get<ParticipantesAprobados[]>(environment.apiuri + '/participantesAprobados/findbyIdCurso/' + idCurso);
  }

  public saveParticipantesAprobadosParacodigoSenecyt(idCurso: number): Observable<ParticipantesAprobados[]> {
    return this.http.get<ParticipantesAprobados[]>(environment.apiuri + '/participantesAprobados/save/findbyIdCurso/' + idCurso);
  }

  public updateParticipantesAprobados(idParticipantesAprobados: number, participantesAprobados: ParticipantesAprobados): Observable<ParticipantesAprobados> {
    return this.http.put<ParticipantesAprobados>(environment.apiuri + '/participantesAprobados/actualizar/' + idParticipantesAprobados, participantesAprobados);
  }

  public updateParticipantesAprobadosLista(listaParticipantesA: ParticipantesAprobados[]): Observable<ParticipantesAprobados[]> {
    return this.http.put<ParticipantesAprobados[]>(environment.apiuri + '/participantesAprobados/actualizar/lista', listaParticipantesA);
  }


  //NEW METHODS-------------------
  public findALlParticipantesAprovadosAndUpdateByIdCursos(courses: number[]): Observable<ParticipantesAprobados[]> {
    return this.http.post<ParticipantesAprobados[]>(environment.apiuri + '/all/participantesAprovados/andupdate/findbyIdCourse', courses, { headers: this.storageService.returnToken() });
  }

  //IMPLEMENTACION PARA EL CERTIFICADO DE CONSULTA PUBLICO----------------------------
  public getParticipantesAprobadosidCursoAndIdenitificacion(idCurso: number, identificacion: String): Observable<ParticipantesAprobados> {
    return this.http.get<ParticipantesAprobados>(environment.apiUriSecurity + '/participantesAprobados/findbyIdIdCursoAndUsuario/' + idCurso + '/' + identificacion);
  }


  //IMPLEMENTACION PARA EL CERTIFICADO DE CONSULTA PUBLICO----------------------------
  public getParticipantesAprobadosByDocenteIdCurso(idCurso: number): Observable<ParticipantsApproved[]> {
    return this.http.get<ParticipantsApproved[]>(environment.apiuri + '/participantesAprobados/findby/docente/IdCurso/' + idCurso);
    // return this.http.get<ParticipantsApproved[]>(environment.apiuri + '/participantesAprobados/findby/docente/IdCurso/' + idCurso);
  }
}
