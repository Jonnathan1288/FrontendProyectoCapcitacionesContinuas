import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { ParticipantesAprobados } from '../models/participantes-aprobados';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteAprobadoService {

  constructor(private http: HttpClient) { }

  public getParticipantesAprobadosById(idPatAprovado: number):Observable<ParticipantesAprobados>{
    return this.http.get<ParticipantesAprobados>(environment.apiuri+'/participantesAprobados/findbyId/'+idPatAprovado);
  }

  public saveParticipantesAprobados(participantesAprobados: ParticipantesAprobados):Observable<ParticipantesAprobados>{
    return this.http.post<ParticipantesAprobados>(environment.apiuri+'/participantesAprobados/crear', participantesAprobados);
  }

  public getAllParticipantesAprobadosByIdCurso(idCurso: number):Observable<ParticipantesAprobados[]>{
    return this.http.get<ParticipantesAprobados[]>(environment.apiuri+'/participantesAprobados/findbyIdCurso/'+idCurso);
  }

  public saveParticipantesAprobadosParacodigoSenecyt(idCurso: number): Observable<ParticipantesAprobados[]>{
    return this.http.get<ParticipantesAprobados[]>(environment.apiuri+'/participantesAprobados/save/findbyIdCurso/'+idCurso);
  }

  public updateParticipantesAprobados(idParticipantesAprobados:number, participantesAprobados: ParticipantesAprobados):Observable<ParticipantesAprobados>{
    return this.http.put<ParticipantesAprobados>(environment.apiuri +'/participantesAprobados/actualizar/' + idParticipantesAprobados , participantesAprobados);
  }

  public updateParticipantesAprobadosLista(listaParticipantesA: ParticipantesAprobados[]):Observable<ParticipantesAprobados[]>{
    return this.http.put<ParticipantesAprobados[]>(environment.apiuri +'/participantesAprobados/actualizar/lista' , listaParticipantesA);
  }
}
