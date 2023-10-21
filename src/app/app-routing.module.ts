//import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { AuthGaurdGuard } from './auth-gaurd.guard';
import { RouterModule, Routes } from '@angular/router';
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
import { StepsToApplyToTheCourseComponent } from './modules/genericAllAccess/steps-to-apply-to-the-course/steps-to-apply-to-the-course.component';
import { GenerateExelVariosComponent } from './modules/administradormodule/generate-exel-varios/generate-exel-varios.component';
import { GestionCursoComponent } from './modules/moduleDocenteCapacitador/gestion-curso/gestion-curso.component';
import { PrincipalPanelAsistenciaCursoComponent } from './modules/moduleDocenteCapacitador/principal-panel-asistencia-curso/principal-panel-asistencia-curso.component';
import { CardVisibleCoursesComponent } from './modules/genericAllAccess/card-visible-courses/card-visible-courses.component';

const routes: Routes = [
  //PÚBLICOS PARA TODOS -> -------------------------------------------------------------

  { path: 'login', component: LoginComponent },

  { path: 'registrarPersona', component: registrarPersonaComponent },

  { path: 'welcome', component: WelcomeComponent },

  { path: 'cominidad', component: ComunidadInstitucionalComponent },

  {
    path: 'recuperar/contrasenia/:token',
    component: RecuperarContraseniaComponent,
  },

  { path: 'steps/apply/course', component: StepsToApplyToTheCourseComponent },

  { path: 'view/courses', component: CardVisibleCoursesComponent },

  //FIN PUBLICOS PARA TODOS-------------------------------------------------------------

  //PARA LOS TRES ROLES-------------------------------------------------------------------

  {
    path: 'user/edit/data',
    component: EditDataUserComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      expectedRoles: ['Administrador', 'DocenteCapacitador', 'Participante'],
    },
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Home',
      expectedRoles: ['Administrador', 'DocenteCapacitador', 'Participante'],
    },
  },

  //FIN LOS TRES ROLES-------------------------------------------------------------------

  //SOLO PARA LOS ADMINISTRADORES -> -------------------------------------------------------------

  {
    path: 'programas/capacitacion',
    component: ProgramasCapacitacionComponent,
    canActivate: [AuthGaurdGuard],
    data: { titulo: 'Gestión De Programas', expectedRoles: ['Administrador'] },
  },

  {
    path: 'asignacion/rol',
    component: AsignacionRolCapacitadorComponent,
    canActivate: [AuthGaurdGuard],
    data: { titulo: 'Asignación De Roles', expectedRoles: ['Administrador'] },
  },

  {
    path: 'permisos/rol/usuarios',
    component: PersmisosRolesUsuarioComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Permisos Para Usuarios',
      expectedRoles: ['Administrador'],
    },
  },

  {
    path: 'gestion/validacion/cursos/capacitacion',
    component: ValidacionCursosCapacitacionComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Validación De Los Cursos de Capacitación',
      expectedRoles: ['Administrador'],
    },
  },

  {
    path: 'gestion/upload/documentos/exel',
    component: DocumentoSenecytComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Subida De Documentos Excel',
      expectedRoles: ['Administrador'],
    },
  },

  {
    path: 'gestion/generate/documento/exel',
    component: GenerateExelVariosComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Generación De Documentos Excel',
      expectedRoles: ['Administrador'],
    },
  },

  //FIN ADMINISTRADORES --------------------------------------------------------------------------

  //SOLO PARA LOS DOCENTES CAPACITADORES -> -------------------------------------------------------------
  {
    path: 'silabo/:id',
    component: SilaboComponent,
    canActivate: [AuthGaurdGuard],
    data: { titulo: 'Silabo', expectedRoles: ['DocenteCapacitador'] },
  },

  {
    path: 'diseño/:id',
    component: CurricularDiseñoComponent,
    canActivate: [AuthGaurdGuard],
    data: { titulo: 'Diseño', expectedRoles: ['DocenteCapacitador'] },
  },

  {
    path: 'register/course',
    component: CourseRegisterComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Registro De Cursos',
      expectedRoles: ['DocenteCapacitador'],
    },
  },

  {
    path: 'asistencia/estudiantes/course/:id',
    component: TomarAsistenciaEstudianteComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Asistencia De Estudiantes',
      expectedRoles: ['DocenteCapacitador'],
    },
  },

  {
    path: 'notas/estudiantes/course/:id',
    component: RegistrarNotasFinalesComponent,
    canActivate: [AuthGaurdGuard],
    data: { expectedRoles: ['DocenteCapacitador'] },
  },

  {
    path: 'verInscritos/course/:id',
    component: ViewInscritosCursoComponent,
    canActivate: [AuthGaurdGuard],
    data: { expectedRoles: ['DocenteCapacitador'] },
  },

  {
    path: 'verMatriculados/course/inicio',
    component: ViewInicioCursoMatriculadosComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Asistencia y Notas Finales',
      expectedRoles: ['DocenteCapacitador'],
    },
  },

  {
    path: 'registro/fotografico/curso/:id',
    component: ViewEvidenciasTableFotofraficasComponent,
    canActivate: [AuthGaurdGuard],
    data: { expectedRoles: ['DocenteCapacitador'] },
  },

  {
    path: 'register/course/:id',
    component: CourseRegisterComponent,
    canActivate: [AuthGaurdGuard],
    data: { expectedRoles: ['DocenteCapacitador'] },
  },

  {
    path: 'list/course',
    component: ListCourseComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Listado De Cursos',
      expectedRoles: ['DocenteCapacitador'],
    },
  },

  {
    path: 'register/necesidad',
    component: RegistroNecesidadComponent,
    canActivate: [AuthGaurdGuard],
    data: { expectedRoles: ['DocenteCapacitador'] },
  },

  {
    path: 'register/necesidad/:id',
    component: RegistroNecesidadComponent,
    canActivate: [AuthGaurdGuard],
    data: { expectedRoles: ['DocenteCapacitador'] },
  },

  {
    path: 'hojaVida/capacitador',
    component: HojavidaComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Subida De La Hoja de vida',
      expectedRoles: ['DocenteCapacitador'],
    },
  },

  {
    path: 'capacitador/participantes/aprovados',
    component: AsignacionCodigosCenecytComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Aprobación De Participantes',
      expectedRoles: ['DocenteCapacitador'],
    },
  },

  {
    path: 'capacitador/gestioncurso',
    component: GestionCursoComponent,
    canActivate: [AuthGaurdGuard],
    data: {
      titulo: 'Gestión De Cursos',
      expectedRoles: ['DocenteCapacitador'],
    },
  },

  {
    path: 'capacitador/principal/asistencia/curso',
    component: PrincipalPanelAsistenciaCursoComponent,
    canActivate: [AuthGaurdGuard],
    data: { titulo: 'Asistencia Curso', expectedRoles: ['DocenteCapacitador'] },
  },

  //FIN DOCENTES CAPACITADORES --------------------------------------------------------------------------

  //SOLO PARA LOS ESTUDIANTES -> -------------------------------------------------------------

  {
    path: 'panel/course/:id',
    component: PanelModuloCursosComponent,
    canActivate: [AuthGaurdGuard],
    data: { expectedRoles: ['Participante'] },
  },

  {
    path: 'verMisCursos/course',
    component: MisCursosParticipanteComponent,
    canActivate: [AuthGaurdGuard],
    data: { titulo: 'Mis Cursos', expectedRoles: ['Participante'] },
  },

  {
    path: 'mat',
    component: MatriculComponent,
    canActivate: [AuthGaurdGuard],
    data: { titulo: 'Matriculas', expectedRoles: ['Participante'] },
  },

  {
    path: 'cards/course',
    component: CardcursoComponent,
    data: { titulo: 'Ver Cursos' },
  },

  {
    path: 'info',
    component: InfocursoComponent,
    canActivate: [AuthGaurdGuard],
    data: { titulo: 'Información', expectedRoles: ['Participante'] },
  },

  {
    path: 'mat/:id',
    component: MatriculComponent,
    canActivate: [AuthGaurdGuard],
    data: { expectedRoles: ['Participante'] },
  },

  {
    path: 'cardcu/detalle/:id',
    component: InfocursoComponent,
    canActivate: [AuthGaurdGuard],
    data: { titulo: 'Matriculas', expectedRoles: ['Participante'] },
  },

  //FIN ESTUDIANTES --------------------------------------------------------------------------

  //la parte ne la uqe este el exel
  { path: 'fo', component: RegistroFotograficoEvidenciasComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
