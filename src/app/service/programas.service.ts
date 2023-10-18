import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { Observable } from 'rxjs';
import { Programas } from '../models/programa';
import { StorageService } from './storage.service';
import { ChartProgramaCourse } from '../models/references/chart-programa.course';

@Injectable({
  providedIn: 'root'
})
export class ProgramasService {

  constructor(private http: HttpClient, private storageService: StorageService) { }
  //programaslist:Programas[] = [];

  public listPrograma(): Observable<Programas[]> {
    return this.http.get<Programas[]>(environment.apiuri + '/programa/listar');
  }

  public getProgramaById(idPrograma: number): Observable<Programas> {
    return this.http.get<Programas>(environment.apiuri + '/programa/findbyId/' + idPrograma);
  }

  public savePrograma(programa: Programas): Observable<Programas> {
    return this.http.post<Programas>(environment.apiuri + '/programa/crear', programa);
  }

  public updatePrograma(idPrograma: number, programa: Programas): Observable<Programas> {
    return this.http.put<Programas>(environment.apiuri + '/programa/actualizar/' + idPrograma, programa);
  }

  public chartProgramaC(): Observable<ChartProgramaCourse[]> {
    return this.http.get<ChartProgramaCourse[]>(environment.apiuri + '/programa/chart/data');
  }
}
