import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provincia } from '../models/provincia';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  constructor(private http: HttpClient) { }

  public getlistProvincia():Observable<Provincia[]>{
    return this.http.get<Provincia[]>(environment.apiuri+'/provincia/list');
  }

  public getProvinciaById(idProvincia: number):Observable<Provincia>{
    return this.http.get<Provincia>(environment.apiuri+'/provincia/findbyId/'+idProvincia);
  }

  public saveProvincia(provincia: Provincia):Observable<Provincia>{
    return this.http.post<Provincia>(environment.apiuri+'/provincia/save', provincia);
  }

  public updateProvincia(idProvincia: number, provincia: Provincia):Observable<Provincia>{
    return this.http.put<Provincia>(environment.apiuri+'/provincia/actualizar/'+idProvincia, provincia);
  }
}
