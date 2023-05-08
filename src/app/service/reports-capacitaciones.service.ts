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

  //IMPRIMIR CON CODIGOS DE LA SENECYT
  public downloadCodigosSenecyt(idCurso: number) {
    return this.http.get(environment.apiuri+ '/generarCodigosAsignarSenecyt/Docente/download/' + idCurso, { responseType: 'blob' });
  }

  //IMPRIMIR CERTIFICADOS POR EL USUARIO QUE LO SOLICITE
  public downloadCertificadoEstudiante(idCurso: number, identificasion: string) {
    return this.http.get(environment.apiuri+ '/generarCertificadoEstudiante/download/' + idCurso+'/'+identificasion, { responseType: 'blob' });
  }

  //IMPRIMIR ENTREGA DE CERTIFICADOS
  public downloadEntregaCertificadoEstudiante(idCurso: number) {
    return this.http.get(environment.apiuri+ '/entregaCertificadosCursoCapacitacion/download/' + idCurso, { responseType: 'blob' });
  }
}
