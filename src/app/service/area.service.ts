import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Area } from '../models/area';
import { PruebaPdf } from '../models/pdf';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listArea():Observable<any>{
    return this.http.get<any>(environment.apiuri+'/area/list', { headers: this.storageService.returnToken()});
  }

  public getAreaById(idArea: number):Observable<Area>{
    return this.http.get<Area>(environment.apiuri+'/area/findbyId/'+idArea, { headers: this.storageService.returnToken()});
  }

  public saveArea(area: Area):Observable<Area>{
    return this.http.post<Area>(environment.apiuri+'/area/save', area, { headers: this.storageService.returnToken()});
  }

  public updateArea(idArea:number, area: Area):Observable<Area>{
    return this.http.put<Area>(environment.apiuri+'/area/actualizar/'+idArea, area, { headers: this.storageService.returnToken()});
  }


  //Pruebas de pdf
  public savepdf(pdf: PruebaPdf):Observable<PruebaPdf>{
    return this.http.post<PruebaPdf>(environment.apiuri+'/pdf/save', pdf, { headers: this.storageService.returnToken()});
  }

  public getpdf(id: number):Observable<PruebaPdf>{
    return this.http.get<PruebaPdf>(environment.apiuri+'/pdf/findbyId/'+id, { headers: this.storageService.returnToken()});
  }

}
