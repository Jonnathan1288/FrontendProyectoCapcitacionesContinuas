import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoAprendizajeSilabo } from '../models/resultado-aprendizaje-silabo';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReportsCapacitacionesService {

  constructor(private http: HttpClient) { }

  //Reportes que va tener el admin..
  public getDownloadReportNecesidadCurso(idCurso: number) {
    return this.http.get(environment.apiuri+ '/reports/download-report/necesidad-curso/'+idCurso, { responseType: 'blob' });
  }

  //Reportes que va tener el admin..
  public gedownloadSilabo(idSilabo: number) {
    return this.http.get(environment.apiuri+ '/generarSilabo/downloadSilabo/'+idSilabo, { responseType: 'blob' });
  }

  //Reportes que va tener el admin..
  public gedownloadFichaDeInscripcion(idFicha: number) {
    return this.http.get(environment.apiuri+ '/generarFichaInscripcion/downloadFicha/'+idFicha, { responseType: 'blob' });
  }

  //Reportes que va tener el admin..
  public gedownloadRegistroFotograficoCurso(idCurso: number) {
    return this.http.get(environment.apiuri+ '/generarRegisroFotografico/downloadRegistroFotografico/'+idCurso, { responseType: 'blob' });
  }

  //Reportes que va tener el admin..
  public gedownloadHojaVida(idCapacitador: number) {
    return this.http.get(environment.apiuri+ '/generarHojaVida/Docente/download/'+idCapacitador, { responseType: 'blob' });
  }

  //Reportes que va tener el admin..
  public downloadProgramacionMensul(month: number, year: number) {
    return this.http.get(environment.apiuri+ '/programacionMensual/download/'+month+'/'+year, { responseType: 'blob' });
  }

    //Reportes que va tener el asisteciaEvalucion.
    public downloadAsistenciaEvaluacion(idCurso: number) {
      return this.http.get(environment.apiuri+ '/generarRegistroAsistenciaEvaluacion/download/' + idCurso, { responseType: 'blob' });
    }
}
