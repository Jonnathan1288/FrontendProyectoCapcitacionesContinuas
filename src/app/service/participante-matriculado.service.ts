import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { FichaMatricula } from '../models/fichaMatricula';
import { ParticipantesMatriculados } from '../models/participantesMatriculados';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteMatriculadoService {

  constructor(private http: HttpClient) { }

  public getParticipantesMatriculadosById(idPatMatriculado: number):Observable<ParticipantesMatriculados>{
    return this.http.get<ParticipantesMatriculados>(environment.apiuri+'/participantesMatriculados/findbyId/'+idPatMatriculado);
  }

  public saveParticipantesMatriculados(participantesMatriculados: ParticipantesMatriculados):Observable<ParticipantesMatriculados>{
    return this.http.post<ParticipantesMatriculados>(environment.apiuri+'/participantesMatriculados/crear', participantesMatriculados);
  }
}
