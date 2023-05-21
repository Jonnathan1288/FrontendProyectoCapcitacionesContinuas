import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { ParticipantesAprobados } from '../models/participantes-aprobados';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteAprobadoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getParticipantesAprobadosById(idPatAprovado: number):Observable<ParticipantesAprobados>{
    return this.http.get<ParticipantesAprobados>(environment.apiuri+'/participantesAprobados/findbyId/'+idPatAprovado, { headers: this.storageService.returnToken()});
  }

  public saveParticipantesAprobados(participantesAprobados: ParticipantesAprobados):Observable<ParticipantesAprobados>{
    return this.http.post<ParticipantesAprobados>(environment.apiuri+'/participantesAprobados/crear', participantesAprobados, { headers: this.storageService.returnToken()});
  }

  public getAllParticipantesAprobadosByIdCurso(idCurso: number):Observable<ParticipantesAprobados[]>{
    return this.http.get<ParticipantesAprobados[]>(environment.apiuri+'/participantesAprobados/findbyIdCurso/'+idCurso, { headers: this.storageService.returnToken()});
  }

  public saveParticipantesAprobadosParacodigoSenecyt(idCurso: number): Observable<ParticipantesAprobados[]>{
    return this.http.get<ParticipantesAprobados[]>(environment.apiuri+'/participantesAprobados/save/findbyIdCurso/'+idCurso, { headers: this.storageService.returnToken()});
  }

  public updateParticipantesAprobados(idParticipantesAprobados:number, participantesAprobados: ParticipantesAprobados):Observable<ParticipantesAprobados>{
    return this.http.put<ParticipantesAprobados>(environment.apiuri +'/participantesAprobados/actualizar/' + idParticipantesAprobados , participantesAprobados, { headers: this.storageService.returnToken()});
  }

  public updateParticipantesAprobadosLista(listaParticipantesA: ParticipantesAprobados[]):Observable<ParticipantesAprobados[]>{
    return this.http.put<ParticipantesAprobados[]>(environment.apiuri +'/participantesAprobados/actualizar/lista' , listaParticipantesA, { headers: this.storageService.returnToken()});
  }

  //IMPLEMENTACION PARA EL CERTIFICADO DE CONSULTA PUBLICO----------------------------
  public getParticipantesAprobadosidCursoAndIdenitificacion(idCurso: number, identificacion: String): Observable<ParticipantesAprobados>{
    return this.http.get<ParticipantesAprobados>(environment.apiUriSecurity+'/participantesAprobados/findbyIdIdCursoAndUsuario/'+idCurso+'/'+identificacion);
  }
}
