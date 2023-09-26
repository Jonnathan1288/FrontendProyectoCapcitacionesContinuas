import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormRecord, FormsModule, ReactiveFormsModule } from '@angular/forms';

//import { ProgramasComponent } from './modules/programa/programas/programas.component';
import { ToastrModule } from 'ngx-toastr';
import { PrimengModule } from './designs/primeng/primeng.module';

//IMPORT DE LOS MODULOS PRINCIPALES EN LA VISTA-----------------------------
import { LoginComponent } from './modules/oauthModule/login/login.component';
import { registrarPersonaComponent } from './modules/oauthModule/registrar-persona/registrar-persona.component';
import { WelcomeComponent } from './modules/genericAllAccess/welcome/welcome.component';
import { ComunidadInstitucionalComponent } from './modules/genericAllAccess/comunidad-institucional/comunidad-institucional.component';
import { RecuperarContraseniaComponent } from './modules/oauthModule/recuperar-contrasenia/recuperar-contrasenia.component';
import { EditDataUserComponent } from './modules/oauthModule/edit-data-user/edit-data-user.component';
import { HomeComponent } from './modules/genericAllAccess/home/home.component';
import { ProgramasCapacitacionComponent } from './modules/administradormodule/programas-capacitacion/programas-capacitacion.component';
import { AsignacionRolCapacitadorComponent } from './modules/administradormodule/asignacion-rol-capacitador/asignacion-rol-capacitador.component';
import { PersmisosRolesUsuarioComponent } from './modules/administradormodule/persmisos-roles-usuario/persmisos-roles-usuario.component';
import { ValidacionCursosCapacitacionComponent } from './modules/administradormodule/validacion-cursos-capacitacion/validacion-cursos-capacitacion.component';
import { DocumentoSenecytComponent } from './modules/administradormodule/documento-senecyt/documento-senecyt.component';
import { SilaboComponent } from './modules/moduleDocenteCapacitador/silabo/silabo.component';
import { CurricularDiseñoComponent } from './modules/moduleDocenteCapacitador/curricular-diseño-register/curricular-diseño.component';
import { CourseRegisterComponent } from './modules/moduleDocenteCapacitador/course-register/course-register.component';
import { TomarAsistenciaEstudianteComponent } from './modules/moduleDocenteCapacitador/tomar-asistencia-estudiante/tomar-asistencia-estudiante.component';
import { RegistrarNotasFinalesComponent } from './modules/moduleDocenteCapacitador/registrar-notas-finales/registrar-notas-finales.component';
import { ViewInscritosCursoComponent } from './modules/moduleDocenteCapacitador/view-inscritos-curso/view-inscritos-curso.component';
import { ViewInicioCursoMatriculadosComponent } from './modules/moduleDocenteCapacitador/view-inicio-curso-matriculados/view-inicio-curso-matriculados.component';
import { ViewEvidenciasTableFotofraficasComponent } from './modules/moduleDocenteCapacitador/view-evidencias-table-fotofraficas/view-evidencias-table-fotofraficas.component';
import { ListCourseComponent } from './modules/moduleDocenteCapacitador/list-course/list-course.component';
import { RegistroNecesidadComponent } from './modules/moduleDocenteCapacitador/registro-necesidad/registro-necesidad.component';
import { HojavidaComponent } from './modules/moduleDocenteCapacitador/moduleHOjaVida/hojavida/hojavida.component';
import { AsignacionCodigosCenecytComponent } from './modules/moduleDocenteCapacitador/asignacion-codigos-cenecyt/asignacion-codigos-cenecyt.component';
import { PanelModuloCursosComponent } from './modules/participanteModule/panel-modulo-cursos/panel-modulo-cursos.component';
import { MisCursosParticipanteComponent } from './modules/participanteModule/mis-cursos-participante/mis-cursos-participante.component';
import { MatriculComponent } from './modules/participanteModule/matricul/matricul.component';
import { CardcursoComponent } from './modules/participanteModule/cardcurso/cardcurso.component';
import { InfocursoComponent } from './modules/participanteModule/infocurso/infocurso.component';
import { RegistroFotograficoEvidenciasComponent } from './modules/moduleDocenteCapacitador/registro-fotografico-evidencias/registro-fotografico-evidencias.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { LoaderPeticionesInterceptor } from './Interceptors/loader-peticiones.interceptor';
import { StepsToApplyToTheCourseComponent } from './modules/genericAllAccess/steps-to-apply-to-the-course/steps-to-apply-to-the-course.component';
import { GenerateExelVariosComponent } from './modules/administradormodule/generate-exel-varios/generate-exel-varios.component';
import { PrincipalComponent } from './component/principal/principal.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { InicioComponent } from './component/inicio/inicio.component';
import { HeadersbComponent } from './shared/headersb/headersb.component';
import { GestionCursoComponent } from './modules/moduleDocenteCapacitador/gestionar-curso/gestion-curso/gestion-curso.component';
import { CourseasitenciaComponent } from './modules/moduleDocenteCapacitador/courseasitencia/courseasitencia.component';




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
    PersmisosRolesUsuarioComponent,
    EditDataUserComponent,
    ComunidadInstitucionalComponent,
    DocumentoSenecytComponent,
    RecuperarContraseniaComponent,
    StepsToApplyToTheCourseComponent,
    GenerateExelVariosComponent,
    PrincipalComponent,
    BreadcrumbsComponent,
    SidebarComponent,
    InicioComponent,
    HeadersbComponent,
    GestionCursoComponent,
    CourseasitenciaComponent,
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
    NgxUiLoaderModule,

  ],
  //schemas: [
  //CUSTOM_ELEMENTS_SCHEMA
  //],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderPeticionesInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
