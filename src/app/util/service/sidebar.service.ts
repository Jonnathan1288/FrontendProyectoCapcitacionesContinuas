import { Injectable } from '@angular/core';
import { ROLES } from '../data-const-rols';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  dataMenu: any[] = [

    // ADMINISTRADOR-----------------------------
    {
      title: 'Programas',
      idNavigation: "programas-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: [ROLES.ADMINISTRADOR],
      subMenu: [
        { path: 'programas/capacitacion', subTitle: 'Gestión de programas' },
      ]
    },

    {
      title: 'Capacitadores',
      idNavigation: "docentescapacitadores-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: [ROLES.ADMINISTRADOR],
      subMenu: [
        { path: 'asignacion/rol', subTitle: 'Gestión de capacitadores' },
      ]
    },

    {
      title: 'Validar Cursos',
      idNavigation: "validarCursos-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: [ROLES.ADMINISTRADOR],
      subMenu: [
        { path: 'asignacion/rol', subTitle: 'Aprobar cursos' },
      ]
    },

    {
      title: 'Permisos',
      idNavigation: "validarpermisos-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: [ROLES.ADMINISTRADOR],
      subMenu: [
        { path: '/permisos/rol/usuarios', subTitle: 'Otorgar Permisos' },
      ]
    },

    {
      title: 'Documentos Exel',
      idNavigation: "documentosexcel-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: [ROLES.ADMINISTRADOR],
      subMenu: [
        { path: 'gestion/upload/documentos/exel', subTitle: 'Subir documentos' },
        { path: 'gestion/generate/documento/exel', subTitle: 'Generar Aprovados' },
      ]
    },

    // DOCENTE CAPACITADOR-----------------------------
    {
      title: 'Cursos',
      idNavigation: "curso-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: [ROLES.DOCENTE_CAPACITADOR],
      subMenu: [
        { path: 'register/course', subTitle: 'Registro Cursos' },
        { path: 'list/course', subTitle: 'Mis cursos' }
      ]
    },

    {
      title: 'Hoja de vida',
      idNavigation: "hojadevida-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: [ROLES.DOCENTE_CAPACITADOR],
      subMenu: [
        { path: 'hojaVida/capacitador', subTitle: 'Subir hoja de vida' },

      ]
    },

    {
      title: 'Aprovados',
      idNavigation: "participantesaprovados-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: [ROLES.DOCENTE_CAPACITADOR],
      subMenu: [
        { path: 'capacitador/participantes/aprovados', subTitle: 'Participantes Aprovados' },

      ]
    },


    // PARTICIPANTE-----------------------------
    {
      title: 'Cursos',
      idNavigation: "cursosparticipante-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: [ROLES.PARTICIPANTE],
      subMenu: [
        { path: 'cards/course', subTitle: 'Ver cursos de capacitación' },

      ]
    },

    {
      title: 'Mis cursos',
      idNavigation: "vercursosparticipante-nav",
      icon: 'bi bi-clipboard-plus-fill',
      rols: [ROLES.PARTICIPANTE],
      subMenu: [
        { path: 'verMisCursos/course', subTitle: 'Ver mis cursos' },

      ]
    },
  ];

}
