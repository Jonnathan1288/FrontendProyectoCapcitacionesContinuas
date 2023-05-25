import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoAprendizajeSilabo } from '../models/resultado-aprendizaje-silabo';
import { environment } from 'src/environment/enviroment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsCapacitacionesService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  //Reportes que va tener el admin..
  public getDownloadReportNecesidadCurso(idCurso: number) {
    return this.http.get(environment.apiuri+ '/reports/download-report/necesidad-curso/'+idCurso, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //Reportes que va tener el admin..
  public gedownloadSilabo(idSilabo: number) {
    return this.http.get(environment.apiuri+ '/generarSilabo/downloadSilabo/'+idSilabo, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //Reportes que va tener el admin..
  public gedownloadFichaDeInscripcion(idCurso: number, idUsusario: number) {
    return this.http.get(environment.apiuri+ '/generarFichaInscripcion/downloadFicha/'+idCurso+'/'+idUsusario, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //Reportes que va tener el admin..
  public gedownloadRegistroFotograficoCurso(idCurso: number) {
    return this.http.get(environment.apiuri+ '/generarRegisroFotografico/downloadRegistroFotografico/'+idCurso, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //Reportes que va tener el admin..
  public gedownloadHojaVida(idCapacitador: number) {
    return this.http.get(environment.apiuri+ '/generarHojaVida/Docente/download/'+idCapacitador, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //Reportes que va tener el admin..
  public downloadProgramacionMensul(month: number, year: number) {
    return this.http.get(environment.apiuri+ '/programacionMensual/download/'+month+'/'+year, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //Reportes que va tener el asisteciaEvalucion.
  public downloadAsistenciaEvaluacion(idCurso: number) {
    return this.http.get(environment.apiuri+ '/generarRegistroAsistenciaEvaluacion/download/' + idCurso, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //IMPRIMIR CON CODIGOS DE LA SENECYT
  public downloadCodigosSenecyt(idCurso: number) {
    return this.http.get(environment.apiuri+ '/generarCodigosAsignarSenecyt/Docente/download/' + idCurso, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //IMPRIMIR ENTREGA DE CERTIFICADOS
  public downloadEntregaCertificadoEstudiante(idCurso: number) {
    return this.http.get(environment.apiuri+ '/entregaCertificadosCursoCapacitacion/download/' + idCurso, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //Reportes que va tener el admin..
  public gedownloadDisenioC(idDisenioC: number) {
    return this.http.get(environment.apiuri+ '/generarDisenioCurricular/downloadDisenioC/'+idDisenioC, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //Reportes ficha de evaluacion final..
  public downloadFichaEvaluacionFinalCurso(idCurso: number) {
    return this.http.get(environment.apiuri+ '/generarFichaEvaluacionFinalCurso/downloadDisenioC/'+idCurso, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //Reportes diseño curricular
  public downloadDisenioCurricular(id: number) {
    return this.http.get(environment.apiuri+ '/generarDisenioCurricular/downloadDisenioC/'+id, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //Reportes diseño curricular
  public downloadInformeFinalCurso(idCurso: number) {
    return this.http.get(environment.apiuri+ '/generarInformeFinal/downloadInforme/'+idCurso, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

   //Reportes de participantes
   public downloadInformeFinalParticipantesCurso(idCurso: number) {
    return this.http.get(environment.apiuri+ '/generarRegistroParticipantes/downloadRegistro/'+idCurso, { responseType: 'blob', headers: this.storageService.returnToken() });
  }

  //PUBLICOS---------------------------------------------------------------------------------------------------
  //IMPRIMIR CERTIFICADOS POR EL USUARIO QUE LO SOLICITE
  public downloadCertificadoEstudiante(idCurso: number, identificasion: String) {
    return this.http.get(environment.apiUriSecurity+ '/generarCertificadoEstudiante/download/' + idCurso+'/'+identificasion, { responseType: 'blob', headers: this.storageService.returnToken() });
  }
}
