import { Component, OnInit } from '@angular/core';
import { Asistencia } from 'src/app/models/asistencia';
import { Persona } from 'src/app/models/persona';
import { RegistroFotograficoCurso } from 'src/app/models/registro-fotografico-curso';
import { Usuario } from 'src/app/models/usuario';
import { AsistenciaService } from 'src/app/service/asistencia.service';
import { RegistroFotograficoCursoService } from 'src/app/service/registro-fotografico-curso.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Curso } from 'src/app/models/curso';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from 'src/app/service/curso.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-evidencias-table-fotofraficas',
  templateUrl: './view-evidencias-table-fotofraficas.component.html',
  styleUrls: ['./view-evidencias-table-fotofraficas.component.css'],
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
  animations: [
    trigger('rowExpansionTrigger', [
      state(
        'void',
        style({
          transform: 'translateX(-10%)',
          opacity: 0,
        })
      ),
      state(
        'active',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ]),
  ],
})
export class ViewEvidenciasTableFotofraficasComponent implements OnInit {
  public lisp: Usuario[] = [];
  public listRegistroFotografico: RegistroFotograficoCurso[] = [];

  public registroFotografico = new RegistroFotograficoCurso();

  public curso = new Curso();

  //idCurso para el cual nos servira para hacer el guardado de la informacion.
  public idCursoRouter?: number;

  constructor(
    private registroFotograficoService: RegistroFotograficoCursoService,
    private actiRouter: ActivatedRoute,
    private cursoService: CursoService,
    private reportService: ReportsCapacitacionesService,
    private asi: UsuarioService,
    private regfService: RegistroFotograficoCursoService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.actiRouter.params.subscribe((params) => {
      const id_curso = params['id'];
      this.idCursoRouter = id_curso;
      this.obtenerCursoPorId(id_curso);
      this.obtenerTodosRegistrofotograficosPorCurso(id_curso);
    });
  }

  public obtenerTodosRegistrofotograficosPorCurso(idRegistroFoto: number) {
    this.regfService
      .getRegistroFotograficoCursoAllByIdCurso(idRegistroFoto)
      .subscribe((data) => {
        this.listRegistroFotografico = data;
        // .filter((regf)=>
        //   regf.estado === true
        // )
        //this.listRegistroFotografico = data;
      });
    // getRegistroFotograficoCursoAllByIdCurso
  }
  //Método para traer el curso por la id que ingresa
  public obtenerCursoPorId(idCurso: number) {
    this.cursoService.getCursoById(idCurso).subscribe((data) => {
      if (data != null) {
        this.curso = data;
      }
    });
  }

  public validacionRegistroFotografico() {
    if (
      !this.registroFotografico.fecha ||
      !this.registroFotografico.descripcionFoto ||
      !this.registroFotografico.foto
    ) {
      this.toastrService.error(
        'Todos los campos deben estar llenos.',
        'CAMPOS VACÍOS'
      );
    } else {
      const fechaInicio = new Date(this.curso.fechaInicioCurso!);
      const fechaFin = new Date(this.curso.fechaFinalizacionCurso!);
      const fecha = new Date(this.registroFotografico.fecha);

      // Convertir las fechas en cadenas en formato ISO 8601
      const fechaInicioString = fechaInicio.toISOString().split('T')[0];
      const fechaFinString = fechaFin.toISOString().split('T')[0];
      const fechaString = fecha.toISOString().split('T')[0];

      if (fechaString < fechaInicioString) {
        this.toastrService.warning(
          'No puede ingresar una fecha pasada a la fecha de inicio del curso.',
          'FECHA PASADA'
        );
        // min
      } else if (fechaString > fechaFinString) {
        this.toastrService.warning(
          'No puede ingresar una fecha posterio a la fecha de finalización del curso.',
          'FECHA MAYOR'
        );
        //may
      } else {
         this.saveEvidenciasRegistrofotografico();
        // console.log('La fecha está dentro del rango válido');
      }

      // this.saveEvidenciasRegistrofotografico();
    }
  }

  public saveEvidenciasRegistrofotografico() {
    if (this.registroFotografico.idRegistroFotograficoCurso) {
      this.registroFotograficoService
        .updateRegistroFotografico(
          this.registroFotografico.idRegistroFotograficoCurso!,
          this.registroFotografico
        )
        .subscribe((data) => {
          if (data != null) {
            this.toastrService.success(
              'El registro fotografico a sido actualizado.',
              'REGISTRO ACTUALIZADO'
            );
            // alert('succesful update');
            this.obtenerTodosRegistrofotograficosPorCurso(this.idCursoRouter!);
            this.registroFotografico = new RegistroFotograficoCurso();
            this.visible = false;
          }
        });
    } else {
      this.registroFotografico.curso = this.curso;
      this.registroFotograficoService
        .saveRegistroFotograficoCurso(this.registroFotografico)
        .subscribe((data) => {
          if (data != null) {
            // alert('fuccesful');
            this.toastrService.success(
              'El registro fotografico ha sido guardado',
              'GUARDADO CON ÉXITO'
            );
            this.visible = false;
            this.registroFotografico = new RegistroFotograficoCurso();
            this.obtenerTodosRegistrofotograficosPorCurso(this.idCursoRouter!);
          }
        });
    }
  }

  public eliminadoLogicoDelregistroFotografico(
    registroFotografico: RegistroFotograficoCurso
  ) {
    // registroFotografico.estado = false;
    registroFotografico.estado = !registroFotografico.estado; // Alternar el estado activo/desactivado
    this.registroFotograficoService
      .updateRegistroFotografico(
        registroFotografico.idRegistroFotograficoCurso!,
        registroFotografico
      )
      .subscribe((data) => {
        if (data != null) {
          if (registroFotografico.estado) {
            this.toastrService.success(
              'El registro fotografico esta visible',
              'Activación Exitosa'
            );
          } else {
            this.toastrService.warning(
              'El registro fotografico ya no esta en el reporte',
              'Desactivación Exitosa'
            );
          }

          this.obtenerTodosRegistrofotograficosPorCurso(this.idCursoRouter!);
        }
      });
  }

  //VISIVILIADA DEL MODAL
  visible?: boolean;

  public showModaL() {
    this.registroFotografico = new RegistroFotograficoCurso();
    this.visible = true;
  }
  //FIN DE LA VISIVILIDAD DE DEL MODAL

  //IMPLEMENTACION DE LA EDICION DEL REGISTRO FOTOGRAFICO
  public cargarDatosRegistrofotografico(
    registroFofotrafico: RegistroFotograficoCurso
  ) {
    this.registroFotografico = { ...registroFofotrafico };
    this.curso = this.registroFotografico.curso!;

    if (this.registroFotografico.fecha) {
      this.registroFotografico.fecha = new Date(this.registroFotografico.fecha);
    }
    this.visible = true;
  }

  //IMPLEMENTAR LA OPCIÓN PARA LA DESCARGA DEL PDF GENERADO DEL CURSO
  public getReportRegistroFotograficoCurso() {
    this.reportService
      .gedownloadRegistroFotograficoCurso(this.idCursoRouter!)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
    // this.getPdf()
  }

  //Almacenar en el objeto
  async subirFoto(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size; // tamaño en bytes
    if (fileSize > 262144) {
      alert('La foto es muy pesada');
      event.target.value = null;
    } else {
      try {
        this.registroFotografico.foto = await this.convertToBase64(file);
      } catch (error) {
        console.error(error);
      }
    }
  }

  //Conversion de la imagen en base 64
  async convertToBase64(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const result = btoa(reader.result as string);
        resolve(result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsBinaryString(file);
    });
  }
}
