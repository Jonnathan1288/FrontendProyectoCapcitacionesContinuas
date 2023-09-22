import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from '../models/curso';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { DocenteFenix } from '../models/docente-fenix';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DocenteFenixService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public listDocenteFenix():Observable<DocenteFenix[]>{
    return this.http.get<DocenteFenix[]>(environment.apiuri+'/fenix/docente/ista/list');
  }

  public getDocenteFenixFindByIdentificasión(identificacion: string):Observable<DocenteFenix>{
    return this.http.get<DocenteFenix>(environment.apiuri+'/fenix/docente/ista/findbyIdentificasion/'+identificacion);
  }
}
