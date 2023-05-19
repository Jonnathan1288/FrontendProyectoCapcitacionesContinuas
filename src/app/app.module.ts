import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './modules/home/home.component';
import { PrimengModule } from './designs/primeng/primeng.module';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { LoginComponent } from './modules/login/login.component';
import { registrarPersonaComponent } from './modules/registrar-persona/registrar-persona.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CourseRegisterComponent } from './modules/moduleCourse/course-register/course-register.component';
import { CommonModule } from '@angular/common';
import { SilaboComponent } from './modules/silabo/silabo.component';
import { CurricularDiseñoComponent } from './modules/curricular-diseño-register/curricular-diseño.component';
import { RouterModule } from '@angular/router';
import { FormRecord, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatriculComponent } from './modules/matricul/matricul.component';
import { CardcursoComponent } from './modules/cardcurso/cardcurso.component';
import { InfocursoComponent } from './modules/infocurso/infocurso.component';
import { ListCourseComponent } from './modules/moduleCourse/list-course/list-course.component';
import { RegistroNecesidadComponent } from './modules/moduleCourse/registro-necesidad/registro-necesidad.component';
//import { ProgramasComponent } from './modules/programa/programas/programas.component';
import { HojavidaComponent } from './modules/hojavida/hojavida.component';
import { ViewInscritosCursoComponent } from './modules/view-inscritos-curso/view-inscritos-curso.component';
import { ViewInicioCursoMatriculadosComponent } from './modules/view-inscritos-curso/view-inicio-curso-matriculados/view-inicio-curso-matriculados.component';
import { TomarAsistenciaEstudianteComponent } from './modules/view-inscritos-curso/tomar-asistencia-estudiante/tomar-asistencia-estudiante.component';
import { RegistrarNotasFinalesComponent } from './modules/view-inscritos-curso/registrar-notas-finales/registrar-notas-finales.component';
import { PanelModuloCursosComponent } from './modules/moduleCourse/panel-modulo-cursos/panel-modulo-cursos.component';
import { RegistroFotograficoEvidenciasComponent } from './modules/view-inscritos-curso/registro-fotografico-evidencias/registro-fotografico-evidencias.component';
import { ViewEvidenciasTableFotofraficasComponent } from './modules/moduleCourse/view-evidencias-table-fotofraficas/view-evidencias-table-fotofraficas.component';
import { ToastrModule } from 'ngx-toastr';
import { ProgramasCapacitacionComponent } from './modules/administradormodule/programas-capacitacion/programas-capacitacion.component';
import { AsignacionRolCapacitadorComponent } from './modules/administradormodule/asignacion-rol-capacitador/asignacion-rol-capacitador.component';
import { MisCursosParticipanteComponent } from './modules/participanteModule/mis-cursos-participante/mis-cursos-participante.component';
import { ValidacionCursosCapacitacionComponent } from './modules/administradormodule/validacion-cursos-capacitacion/validacion-cursos-capacitacion.component';
import { AsignacionCodigosCenecytComponent } from './modules/view-inscritos-curso/asignacion-codigos-cenecyt/asignacion-codigos-cenecyt.component';
import { DisenioHojaVidaComponent } from './modules/hojavida/disenio-hoja-vida/disenio-hoja-vida.component';
import { PersmisosRolesUsuarioComponent } from './modules/administradormodule/persmisos-roles-usuario/persmisos-roles-usuario.component';
import { EditDataUserComponent } from './modules/registrar-persona/edit-data-user/edit-data-user.component';
import { ConsultasCertificadoComponent } from './modules/home/consultas-certificado/consultas-certificado.component';
import { ComunidadInstitucionalComponent } from './modules/home/comunidad-institucional/comunidad-institucional.component';
import { DocumentoSenecytComponent } from './modules/administradormodule/documento-senecyt/documento-senecyt.component';
import { RecuperarContraseniaComponent } from './modules/registrar-persona/recuperar-contrasenia/recuperar-contrasenia.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    WelcomeComponent,
    CourseRegisterComponent,
    CurricularDiseñoComponent,
    LoginComponent,
    registrarPersonaComponent,
    CourseRegisterComponent,
    SilaboComponent,
    MatriculComponent,
    CardcursoComponent,
    InfocursoComponent,
    ListCourseComponent,
    RegistroNecesidadComponent,
    //ProgramasComponent,
    HojavidaComponent,
    ViewInscritosCursoComponent,
    ViewInicioCursoMatriculadosComponent,
    TomarAsistenciaEstudianteComponent,
    RegistrarNotasFinalesComponent,
    PanelModuloCursosComponent,
    RegistroFotograficoEvidenciasComponent,
    ViewEvidenciasTableFotofraficasComponent,
    ProgramasCapacitacionComponent,
    AsignacionRolCapacitadorComponent,
    MisCursosParticipanteComponent,
    ValidacionCursosCapacitacionComponent,
    AsignacionCodigosCenecytComponent,
    DisenioHojaVidaComponent,
    PersmisosRolesUsuarioComponent,
    EditDataUserComponent,
    ConsultasCertificadoComponent,
    ComunidadInstitucionalComponent,
    DocumentoSenecytComponent,
    RecuperarContraseniaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimengModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),

  ],
  //schemas: [
    //CUSTOM_ELEMENTS_SCHEMA
  //],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
