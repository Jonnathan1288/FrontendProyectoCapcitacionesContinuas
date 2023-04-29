import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { MaterialAudiovisuales } from '../models/material-audiovisuales';

@Injectable({
  providedIn: 'root'
})
export class MaterialAudiovisualService {

  constructor(private http: HttpClient) { }

  public listMaterialAudiovisuales():Observable<MaterialAudiovisuales[]>{
    return this.http.get<MaterialAudiovisuales[]>(environment.apiuri+'/materialAudiovisual/list');
  }

  public saveMaterialAudiovisuales(materialesAudiovisuales: MaterialAudiovisuales):Observable<MaterialAudiovisuales>{
    return this.http.post<MaterialAudiovisuales>(environment.apiuri+'/materialAudiovisual/save', materialesAudiovisuales);
  }

  public getMaterialAudiovisualesById(id: number):Observable<MaterialAudiovisuales>{
    return this.http.get<MaterialAudiovisuales>(environment.apiuri+'/materialAudiovisual/findbyId/'+id);
  }
  
}
