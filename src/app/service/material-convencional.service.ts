import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { MaterialConvencionales } from '../models/material-convencionales';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialConvencionalService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listMaterialAudiovisuales():Observable<MaterialConvencionales[]>{
    return this.http.get<MaterialConvencionales[]>(environment.apiuri+'/materialConvencional/list');
  }

  public saveMaterialConvencional(materialesConvecionales: MaterialConvencionales):Observable<MaterialConvencionales>{
    return this.http.post<MaterialConvencionales>(environment.apiuri+'/materialConvencional/save', materialesConvecionales);
  }

  public getMaterialConvencionaleById(id: number):Observable<MaterialConvencionales>{
    return this.http.get<MaterialConvencionales>(environment.apiuri+'/materialConvencional/findbyId/'+id);
  }

  public getMaterialConvencionalesPorIdSilabo(id: number):Observable<MaterialConvencionales[]>{
    return this.http.get<MaterialConvencionales[]>(environment.apiuri+'/materialConvencionalPorSilabo/findbyId/'+id);
  }
  
  public updateMaterialConvencionales(id:number, materialesConvecionales: MaterialConvencionales):Observable<MaterialConvencionales>{
    return this.http.put<MaterialConvencionales>(environment.apiuri+'/materialConvencional/actualizar/'+id, materialesConvecionales);
  }
}
