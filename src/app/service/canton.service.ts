import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Canton } from '../models/canton';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CantonService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getAllCantonByIdProvincia(idProvincia: number):Observable<Canton[]>{
    return this.http.get<Canton[]>(environment.apiuri+'/canton/findbyIdProvincia/'+idProvincia, { headers: this.storageService.returnToken()});
  }

  public getCantonById(idCanton: number):Observable<Canton>{
    return this.http.get<Canton>(environment.apiuri+'/canton/findbyId/'+idCanton, { headers: this.storageService.returnToken()});
  }

  public saveProvincia(canton: Canton):Observable<Canton>{
    return this.http.post<Canton>(environment.apiuri+'/canton/save', canton, { headers: this.storageService.returnToken()});
  }

}
