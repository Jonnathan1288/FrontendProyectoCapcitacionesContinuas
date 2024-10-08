import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Programas } from '../models/programa';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramasService {

  constructor(private http: HttpClient, private storageService: StorageService) { }
   //programaslist:Programas[] = [];

  public listPrograma():Observable<Programas[]>{
    return this.http.get<Programas[]>(environment.apiuri+'/programa/listar', { headers: this.storageService.returnToken()});
  }

  public getProgramaById(idPrograma: number):Observable<Programas>{
    return this.http.get<Programas>(environment.apiuri+'/programa/findbyId/'+idPrograma, { headers: this.storageService.returnToken()});
  }

  public savePrograma(programa: Programas):Observable<Programas>{
    return this.http.post<Programas>(environment.apiuri+'/programa/crear', programa, { headers: this.storageService.returnToken()});
  }

  public updatePrograma(idPrograma:number, programa: Programas):Observable<Programas>{
    return this.http.put<Programas>(environment.apiuri+'/programa/actualizar/'+idPrograma, programa, { headers: this.storageService.returnToken()});
  }
}
