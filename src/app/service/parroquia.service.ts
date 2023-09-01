import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Parroquia } from '../models/parroquia';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ParroquiaService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  public getAllParroquiaByIdCanton(idParroquia: number):Observable<Parroquia[]>{
    return this.http.get<Parroquia[]>(environment.apiuri+'/parroquia/findbyIdCanton/'+idParroquia);
  }

  public getCantonById(idParroquia: number):Observable<Parroquia>{
    return this.http.get<Parroquia>(environment.apiuri+'/parroquia/findbyId/'+idParroquia);
  }

  public saveProvincia(parroquia: Parroquia):Observable<Parroquia>{
    return this.http.post<Parroquia>(environment.apiuri+'/parroquia/save', parroquia);
  }
}
