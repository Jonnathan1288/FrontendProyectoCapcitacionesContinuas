import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Recurso } from '../models/recurso';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public findByOne(idRecurso: number): Observable<Recurso> {
    return this.http.get<Recurso>(environment.apiuri + '/recurso/findOne/' + idRecurso, { headers: this.storageService.returnToken() });
  }

  public findByAll(): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(environment.apiuri + '/recurso/list', { headers: this.storageService.returnToken() });
  }
}
