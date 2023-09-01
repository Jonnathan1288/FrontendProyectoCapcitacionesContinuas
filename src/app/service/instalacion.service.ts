import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Instalacion } from '../models/instalacion';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class InstalacionService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public findByOne(idInstalacion: number): Observable<Instalacion> {
    return this.http.get<Instalacion>(environment.apiuri + '/instalacion/findOne/' + idInstalacion);
  }

  public findByAll(): Observable<Instalacion[]> {
    return this.http.get<Instalacion[]>(environment.apiuri + '/instalacion/list');
  }

}
