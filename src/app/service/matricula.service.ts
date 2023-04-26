import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Inscrito } from '../models/inscrito';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MatriculaService {


  private URL = "http://localhost:8080/api/matricula/crear/";

  private listar = "http://localhost:8080/api/matricula/listar/";



  constructor(private http: HttpClient) { }


  savematricula(matricula: Inscrito) {
    return this.http.post(`${this.URL}?`, matricula);
  }


  getMatriculas(): Observable<Inscrito[]> {
    return this.http
      .get(this.listar)
      .pipe(map((response) => response as Inscrito[]));
  }



}
