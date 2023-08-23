import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { FaseTeorica } from '../models/fase-teorica';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class FaseTeoricaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public findByOne(idRecurso: number): Observable<FaseTeorica> {
    return this.http.get<FaseTeorica>(environment.apiuri + '/faseTeorica/findOne/' + idRecurso, { headers: this.storageService.returnToken() });
  }

  public findByAll(): Observable<FaseTeorica[]> {
    return this.http.get<FaseTeorica[]>(environment.apiuri + '/faseTeorica/list', { headers: this.storageService.returnToken() });
  }

  public save(faseTeorica: FaseTeorica): Observable<FaseTeorica> {
    return this.http.post<FaseTeorica>(environment.apiuri + '/faseTeorica/save', faseTeorica, { headers: this.storageService.returnToken() });
  }

  public update(faseTeorica: FaseTeorica, idFaseTeorica: number): Observable<FaseTeorica> {
    return this.http.put<FaseTeorica>(environment.apiuri + '/faseTeorica/update/' + idFaseTeorica, faseTeorica, { headers: this.storageService.returnToken() });
  }
}
