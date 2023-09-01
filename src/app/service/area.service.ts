import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Area } from '../models/area';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listArea(): Observable<any> {
    return this.http.get<any>(environment.apiuri + '/area/list');
  }

  public getAreaById(idArea: number): Observable<Area> {
    return this.http.get<Area>(environment.apiuri + '/area/findbyId/' + idArea);
  }

  public saveArea(area: Area): Observable<Area> {
    return this.http.post<Area>(environment.apiuri + '/area/save', area);
  }

  public updateArea(idArea: number, area: Area): Observable<Area> {
    return this.http.put<Area>(environment.apiuri + '/area/actualizar/' + idArea, area);
  }


  //Pruebas de pdf

  public sendEmailCodigoSenescyt(idUsuario: number, idDocumetno: number): Observable<any> {
    return this.http.get<any>(environment.apiUriSecurity + '/email/sendEmailDocumentoSenescyt/' + idUsuario + '/' + idDocumetno);
  }

}
