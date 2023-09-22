import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { DisenioCurriculares } from '../models/disenio-curriculares';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DisenioCurricularService {

  
  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listDisenioCurricular():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/disenioCurricular/list');
  }

  public getDisenioCurricularById(idDisenioCurricular: number):Observable<DisenioCurriculares>{
    return this.http.get<DisenioCurriculares>(environment.apiuri+'/disenioCurricular/findbyId/'+idDisenioCurricular);
  }

  public saveDisenioCurricular(listDisenioCurricular: DisenioCurriculares):Observable<DisenioCurriculares>{
    return this.http.post<DisenioCurriculares>(environment.apiuri+'/disenioCurricular/save',listDisenioCurricular);
  }

  public updateDisenioCurricular(idDisenioCurricular: number, disenioCurricular: DisenioCurriculares): Observable<DisenioCurriculares> {
    return this.http.put<DisenioCurriculares>(`${environment.apiuri}/disenioCurricular/actualizar/${idDisenioCurricular}`, disenioCurricular);
  }
  
  public getDisenioCurricularValidacion(idSilabo:number){
    return this.http.get<boolean>(environment.apiuri+'/disenioCurricular/findbyIdSilabo/'+idSilabo);
  }
  public getDisenioCurricularByIdPorSilabo(id_silabo: number):Observable<DisenioCurriculares>{
    return this.http.get<DisenioCurriculares>(environment.apiuri+'/disenioCurricular/findbyIdSilaboPorDisenioCurricular/'+id_silabo);
  }

  public getDisenioCurricularPorSilaboCursoById(id_silabo: number):Observable<DisenioCurriculares>{
    return this.http.get<DisenioCurriculares>(environment.apiuri+'/disenioCurricular/findbyIdSilaboCurso/'+id_silabo);
  }
  
}