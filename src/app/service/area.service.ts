import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Area } from '../models/area';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(private http: HttpClient) { }

  public listArea():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/area/list');
  }

  public getAreaById(id_area: number):Observable<Area>{
    return this.http.get<Area>(environment.apiuri+'/area/findbyId/'+id_area);
  }

  public saveArea(listaNecesidadCurso: Area):Observable<Area>{
    return this.http.post<Area>(environment.apiuri+'/area/save', listaNecesidadCurso);
  }
}
