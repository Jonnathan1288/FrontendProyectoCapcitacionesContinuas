import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { MaterialAudiovisuales } from '../models/material-audiovisuales';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialAudiovisualService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listMaterialAudiovisuales():Observable<MaterialAudiovisuales[]>{
    return this.http.get<MaterialAudiovisuales[]>(environment.apiuri+'/materialAudiovisual/list');
  }

  public saveMaterialAudiovisuales(materialesAudiovisuales: MaterialAudiovisuales):Observable<MaterialAudiovisuales>{
    return this.http.post<MaterialAudiovisuales>(environment.apiuri+'/materialAudiovisual/save', materialesAudiovisuales);
  }

  public getMaterialAudiovisualesById(id: number):Observable<MaterialAudiovisuales>{
    return this.http.get<MaterialAudiovisuales>(environment.apiuri+'/materialAudiovisual/findbyId/'+id);
  }
  
  public getMaterialAudiovisualesPorIdSilabo(id: number):Observable<MaterialAudiovisuales[]>{
    return this.http.get<MaterialAudiovisuales[]>(environment.apiuri+'/materialAudiovisualPorSilabo/findbyId/'+id);
  }

  public updateEstadosMaterialAudio(id:number, materialesAudiovisuales: MaterialAudiovisuales):Observable<MaterialAudiovisuales>{
    return this.http.put<MaterialAudiovisuales>(environment.apiuri+'/materialAudiovisual/actualizar/'+id, materialesAudiovisuales);
  }
  
}
