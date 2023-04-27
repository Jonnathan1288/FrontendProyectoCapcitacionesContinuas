import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { MaterialConvencionales } from '../models/material-convencionales';

@Injectable({
  providedIn: 'root'
})
export class MaterialConvencionalService {

  constructor(private http: HttpClient) { }

  public listMaterialAudiovisuales():Observable<MaterialConvencionales[]>{
    return this.http.get<MaterialConvencionales[]>(environment.apiuri+'/materialConvencional/list');
  }

  public saveMaterialAudiovisuales(materialesConvecionales: MaterialConvencionales):Observable<MaterialConvencionales>{
    return this.http.post<MaterialConvencionales>(environment.apiuri+'/materialConvencional/save', materialesConvecionales);
  }

  public getMaterialAudiovisualesById(id: number):Observable<MaterialConvencionales>{
    return this.http.get<MaterialConvencionales>(environment.apiuri+'/materialConvencional/findbyId/'+id);
  }
  
}
