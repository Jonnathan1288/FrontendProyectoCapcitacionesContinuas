import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { FasePractica } from '../models/fase-practica';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class FasePracticaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public findByOne(idRecurso: number): Observable<FasePractica> {
    return this.http.get<FasePractica>(environment.apiuri + '/fasePractica/findOne/' + idRecurso);
  }

  public findByAll(): Observable<FasePractica[]> {
    return this.http.get<FasePractica[]>(environment.apiuri + '/fasePractica/list');
  }

  public save(FasePractica: FasePractica): Observable<FasePractica> {
    return this.http.post<FasePractica>(environment.apiuri + '/fasePractica/save', FasePractica);
  }

  public update(FasePractica: FasePractica, idFasePractica: number): Observable<FasePractica> {
    return this.http.put<FasePractica>(environment.apiuri + '/fasePractica/update/' + idFasePractica, FasePractica);
  }

  public findAllByDisenioCurricularId(idDisenioCurricular: number): Observable<FasePractica[]> {
    return this.http.get<FasePractica[]>(environment.apiuri + `/fasePractica/findAllByDisenioCurricularId/${idDisenioCurricular}`);
  }
}