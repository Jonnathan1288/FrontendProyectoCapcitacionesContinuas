import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { DisenioCurriculares } from '../models/disenio-curriculares';

@Injectable({
  providedIn: 'root'
})
export class DisenioCurricularService {

  
  constructor(private http: HttpClient) { }

  public listDisenioCurricular():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/disenioCurricular/list');
  }

  public getDisenioCurricularById(idCDisenioCurricular: number):Observable<DisenioCurriculares>{
    return this.http.get<DisenioCurriculares>(environment.apiuri+'/disenioCurricular/findbyId/'+idCDisenioCurricular);
  }

  public saveDisenioCurricular(listDisenioCurricular: DisenioCurriculares):Observable<DisenioCurriculares>{
    return this.http.post<DisenioCurriculares>(environment.apiuri+'/disenioCurricular/save',listDisenioCurricular);
  }

  public updateDisenioCurricular(idCDisenioCurricular: number, disenioCurricular: DisenioCurriculares): Observable<DisenioCurriculares> {
    return this.http.put<DisenioCurriculares>(`${environment.apiuri}/disenioCurricular/update/${idCDisenioCurricular}`, disenioCurricular);
  }
  
  
}
