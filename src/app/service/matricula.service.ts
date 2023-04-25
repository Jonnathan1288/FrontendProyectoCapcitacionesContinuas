import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Matricula } from '../models/matricula';


@Injectable({
  providedIn: 'root'
})
export class MatriculaService {


  private URL = "http://localhost:8080/api/matricula/crear/";


  constructor(private http: HttpClient) { }


  save(matricula: Matricula) {
    return this.http.post(`${this.URL}?`, matricula);
  }



}
