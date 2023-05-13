//import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { AuthGaurdGuard } from './auth-gaurd.guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { CapacitadorComponent } from './modules/administradormodule/capacitador/capacitador.component';
import { LoginComponent } from './modules/login/login.component';
import { registrarPersonaComponent } from './modules/registrar-persona/registrar-persona.component';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { MatriculComponent } from './modules/matricul/matricul.component';
import { CardcursoComponent } from './modules/cardcurso/cardcurso.component';
import { InfocursoComponent } from './modules/infocurso/infocurso.component';
import { CourseRegisterComponent } from './modules/moduleCourse/course-register/course-register.component';
import { SilaboComponent } from './modules/silabo/silabo.component';
import { CurricularDiseñoComponent } from './modules/curricular-diseño-register/curricular-diseño.component';
import { ListCourseComponent } from './modules/moduleCourse/list-course/list-course.component';
import { RegistroNecesidadComponent } from './modules/moduleCourse/registro-necesidad/registro-necesidad.component';
import { HojavidaComponent } from './modules/hojavida/hojavida.component';
import { ViewInscritosCursoComponent } from './modules/view-inscritos-curso/view-inscritos-curso.component';
import { ViewInicioCursoMatriculadosComponent } from './modules/view-inscritos-curso/view-inicio-curso-matriculados/view-inicio-curso-matriculados.component';
import { TomarAsistenciaEstudianteComponent } from './modules/view-inscritos-curso/tomar-asistencia-estudiante/tomar-asistencia-estudiante.component';
import { RegistrarNotasFinalesComponent } from './modules/view-inscritos-curso/registrar-notas-finales/registrar-notas-finales.component';
import { PanelModuloCursosComponent } from './modules/moduleCourse/panel-modulo-cursos/panel-modulo-cursos.component';
import { RegistroFotograficoEvidenciasComponent } from './modules/view-inscritos-curso/registro-fotografico-evidencias/registro-fotografico-evidencias.component';
import { ViewEvidenciasTableFotofraficasComponent } from './modules/moduleCourse/view-evidencias-table-fotofraficas/view-evidencias-table-fotofraficas.component';
import { ProgramasCapacitacionComponent } from './modules/administradormodule/programas-capacitacion/programas-capacitacion.component';
import { AsignacionRolCapacitadorComponent } from './modules/administradormodule/asignacion-rol-capacitador/asignacion-rol-capacitador.component';
import { MisCursosParticipanteComponent } from './modules/participanteModule/mis-cursos-participante/mis-cursos-participante.component';
import { ValidacionCursosCapacitacionComponent } from './modules/administradormodule/validacion-cursos-capacitacion/validacion-cursos-capacitacion.component';
import { AsignacionCodigosCenecytComponent } from './modules/view-inscritos-curso/asignacion-codigos-cenecyt/asignacion-codigos-cenecyt.component';
import { DisenioHojaVidaComponent } from './modules/hojavida/disenio-hoja-vida/disenio-hoja-vida.component';
import { PersmisosRolesUsuarioComponent } from './modules/administradormodule/persmisos-roles-usuario/persmisos-roles-usuario.component';
import { EditDataUserComponent } from './modules/registrar-persona/edit-data-user/edit-data-user.component';
import { ConsultasCertificadoComponent } from './modules/home/consultas-certificado/consultas-certificado.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  //REFERENCES USER
  { path: 'registrarPersona', component: registrarPersonaComponent },
  { path: 'user/edit/data', component: EditDataUserComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['Administrador', 'DocenteCapacitador', 'Participante'] } },

  //OTHER
  { path: 'welcome', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cap', component: CapacitadorComponent },
  { path: 'silabo/:id', component: SilaboComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }  },
  // { path: 'diseño', component: CurricularDiseñoComponent }, ELIMINADO
  { path: 'diseño/:id', component: CurricularDiseñoComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }   },
  // { path: 'register/course', component: CourseRegisterComponent , canActivate: [AuthGaurdGuard], data: {expectedRoles: ['Administrador'] }},
  { path: 'register/course', component: CourseRegisterComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }   },
  {
    path: 'asistencia/estudiantes/course/:id',
    component: TomarAsistenciaEstudianteComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }  
  },
  {
    path: 'notas/estudiantes/course/:id',
    component: RegistrarNotasFinalesComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }  
  },
  { path: 'panel/course/:id', component: PanelModuloCursosComponent },
  { path: 'verInscritos/course/:id', component: ViewInscritosCursoComponent , canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }  },
  {
    path: 'verMatriculados/course/inicio/:id',
    component: ViewInicioCursoMatriculadosComponent , canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }  
  },
  { path: 'verMisCursos/course', component: MisCursosParticipanteComponent },
  //Registro fotografico
  { path: 'fo', component: RegistroFotograficoEvidenciasComponent },
  //Ver vista de las evidencias fotograficas
  {
    path: 'registro/fotografico/curso/:id',
    component: ViewEvidenciasTableFotofraficasComponent,
  },
  { path: 'register/course/:id', component: CourseRegisterComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }   },
  { path: 'list/course', component: ListCourseComponent , canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }  },
  { path: 'register/necesidad', component: RegistroNecesidadComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }   },
  { path: 'register/necesidad/:id', component: RegistroNecesidadComponent , canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }  },
  { path: 'mat', component: MatriculComponent , canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }  },
  { path: 'cards/course', component: CardcursoComponent , canActivate: [AuthGaurdGuard], data: {expectedRoles: ['Participante'] }  },
  { path: 'mat/:id', component: MatriculComponent },
  { path: 'cardcu/detalle/:id', component: InfocursoComponent },
  { path: 'info', component: InfocursoComponent },
  { path: 'hojaVida/capacitador', component: HojavidaComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }   },
  { path: 'ver/hojaVida/capacitador/:id', component: DisenioHojaVidaComponent , canActivate: [AuthGaurdGuard], data: {expectedRoles: ['DocenteCapacitador'] }  },
  //Programas de capacitacion.
  { path: 'programas/capacitacion', component: ProgramasCapacitacionComponent },
  { path: 'asignacion/rol', component: AsignacionRolCapacitadorComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['Administrador'] }   },

  { path: 'permisos/rol/usuarios', component: PersmisosRolesUsuarioComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['Administrador'] }  },
  //Asignacion de codigos cenecyt
  {
    path: 'capacitador/codigos/cenecyt',
    component: AsignacionCodigosCenecytComponent,
  },

  //cuando el usuario no esta logiado..
  {
    path: 'consultas/certificados/aprovados/cursos/capactacionContinua',
    component: ConsultasCertificadoComponent,
  },

  //Aplicasion de los filtro de prime
  {
    path: 'gestion/validacion/cursos/capacitacion',
    component: ValidacionCursosCapacitacionComponent, canActivate: [AuthGaurdGuard], data: {expectedRoles: ['Administrador'] } 
  },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
