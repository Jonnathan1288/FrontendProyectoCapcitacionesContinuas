import { Injectable } from '@angular/core';
import { PRINCIPAL_ROLS, ROLES } from '../data-const-rols';

@Injectable({
	providedIn: 'root'
})
export class SidebarService {

	constructor() { }

	public dataMenu: any[] = [{
		titulo: 'Dashboard',
		icono: 'nav-icon fas fa-tachometer-alt',
		rols: PRINCIPAL_ROLS,
		submenu: [
			{ titulo: 'Dashboard', path: 'home', icono: 'fas fa-tachometer-alt' },


		]
	},
	// ADMINISTRADOR-----------------------------
	{
		titulo: 'Programas',
		icono: 'nav-icon fas fa-folder-open',
		rols: [ROLES.ADMINISTRADOR],
		submenu: [
			{ titulo: 'Gestión de programas', path: 'programas/capacitacion', icono: 'fa fa-folder-plus' },
		]
	},
	{
		titulo: 'Capacitadores',
		icono: 'nav-icon fas fa-user',
		rols: [ROLES.ADMINISTRADOR],
		submenu: [
			{ titulo: 'Gestión de capacitadores', path: 'asignacion/rol', icono: 'fa fa-users' },
		]
	},
	{
		titulo: 'Validar Cursos',
		icono: 'nav-icon fas fa-lock',
		rols: [ROLES.ADMINISTRADOR],
		submenu: [
			{ titulo: 'Aprobar cursos', path: 'gestion/validacion/cursos/capacitacion', icono: 'fa fa-check-circle' },
		]
	},

	{
		titulo: 'Permisos',
		icono: 'nav-icon fas fa-user-shield',
		rols: [ROLES.ADMINISTRADOR],
		submenu: [
			{ titulo: 'Otorgar Permisos', path: '/permisos/rol/usuarios', icono: 'fa fa-user-lock' },
		]
	},

	{
		titulo: 'Documentos',
		icono: 'nav-icon fas fa-tachometer-alt',
		rols: [ROLES.ADMINISTRADOR],
		submenu: [
			{ titulo: 'Subir documentos', path: 'gestion/upload/documentos/exel', icono: 'fa fa-users' },
			{ titulo: 'Generar Aprovados', path: 'gestion/generate/documento/exel', icono: 'fa fa-users' },
		]
	},

	// DOCENTE CAPACITADOR-----------------------------
	{
		titulo: 'Cursos',
		icono: 'nav-icon fas fa-box-tissue',
		rols: [ROLES.DOCENTE_CAPACITADOR],
		submenu: [
			{ titulo: 'Nuevo Curso', path: 'register/course', icono: 'fa fa-plus-circle' },
			{ titulo: 'Mis cursos', path: 'list/course', icono: 'fa fa-folder-open' },
			{ titulo: 'Gestionar Curso', path: 'capacitador/gestioncurso', icono: 'fa fa-pencil' },
		]
	},

	{
		titulo: 'Asistencia',
		icono: 'nav-icon fas fa-box-tissue',
		rols: [ROLES.DOCENTE_CAPACITADOR],
		submenu: [
			{ titulo: 'Asistencia y Notas finales', path: 'verMatriculados/course/inicio', icono: 'fa fa-plus-circle' },
		]
	},

	{
		titulo: 'Hoja de vida',
		icono: 'nav-icon fas fa-folder',
		rols: [ROLES.DOCENTE_CAPACITADOR],
		submenu: [
			{ titulo: 'Subir', path: 'hojaVida/capacitador', icono: 'fa fa-file-upload' },

		]
	},
	{
		titulo: 'Aprobados',
		icono: 'nav-icon fas fa-calendar-check',
		rols: [ROLES.DOCENTE_CAPACITADOR],
		submenu: [
			{ titulo: 'Participantes Aprobados', path: 'capacitador/participantes/aprovados', icono: 'fa fa-users' },

		]
	},

	// PARTICIPANTE-----------------------------

	{
		titulo: 'Cursos',
		icono: 'nav-icon fa-solid fa-book',
		rols: [ROLES.PARTICIPANTE],
		submenu: [
			{ titulo: 'Ver cursos', path: 'cards/course', icono: 'fa fa-solid fa-book-open-reader' },

		]
	},

	{
		titulo: 'Mis cursos',
		icono: 'nav-icon fa-solid fa-chalkboard',
		rols: [ROLES.PARTICIPANTE],
		submenu: [
			{ titulo: 'Ver mis cursos', path: 'verMisCursos/course', icono: 'fa fa-solid fa-chalkboard-user' },

		]
	},
	];

}
