import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PeriodoPrograma } from 'src/app/models/periodo-programa';
import { Programas } from 'src/app/models/programa';
import { PeriodoProgramaService } from 'src/app/service/periodo-programa.service';
import { ProgramasService } from 'src/app/service/programas.service';
import { ReportsCapacitacionesService } from 'src/app/service/reports-capacitaciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-programas-capacitacion',
  templateUrl: './programas-capacitacion.component.html',
  styleUrls: ['./programas-capacitacion.component.css'],
})
export class ProgramasCapacitacionComponent implements OnInit {
  //Declaracion de las listas para tener el registro de los programas
  // public listaDeProgramas: PeriodoPrograma[] =[];
  public listaProgramas: Programas[] = [];

  //Declaracion de las clases que vamos a usar
  public classPeriodoPrograma = new PeriodoPrograma();
  public classPrograma = new Programas();

  private sanitizer!: DomSanitizer;
  constructor(
    private periodoProgramaService: PeriodoProgramaService,
    private programaService: ProgramasService,
    sanitizer: DomSanitizer,
    private reportService: ReportsCapacitacionesService,
    private toastrService: ToastrService
  ) {
    this.sanitizer = sanitizer;
  }
  ngOnInit(): void {
    this.getTodosLosProgramasPorAdministrador();
  }

  public validarDatosProgramaCapacitacionContinua() {
    if (
      !this.classPeriodoPrograma.nombrePeriodoPrograma ||
      !this.classPeriodoPrograma.fechaInicioPeriodoPrograma ||
      !this.classPeriodoPrograma.fechaFinPeriodoPrograma ||
      !this.classPeriodoPrograma.nombrePeriodoPrograma ||
      !this.classPrograma.nombrePrograma ||
      !this.classPrograma.descripcionPrograma
    ) {
      this.toastrService.error(
        'Verifique los campos que no esten vacíos.',
        'CAMPOS VACíOS.',
        {
          timeOut: 1300,
        }
      );
    } else {
      const fechaInicio = new Date(
        this.classPeriodoPrograma.fechaInicioPeriodoPrograma
      );
      const fechaFinalizacion = new Date(
        this.classPeriodoPrograma.fechaFinPeriodoPrograma
      );

      const tiempoDiferencia =
        fechaFinalizacion.getTime() - fechaInicio.getTime();
      const diasDiferencia = tiempoDiferencia / (1000 * 60 * 60 * 24);

      //Periodo actual
      const fechaActual = new Date();
      if (fechaInicio < fechaActual) {
        this.toastrService.error(
          'No se puede ingresar una fecha pasada.',
          'FECHA INVÁLIDA.',
          {
            timeOut: 1700,
          }
        );
      } else {
        // Continuar con la lógica adicional si la fecha es válida

        if (diasDiferencia < 7) {
          this.toastrService.error(
            'La duración del curso debe ser al menos de 7 días.',
            'DURACIÓN MINIMA.',
            {
              timeOut: 1500,
            }
          );
        } else if (diasDiferencia > 27) {
          this.toastrService.error(
            'La duración del curso no puede ser mayor de 27 días.',
            'DURACIÓN MÁXIMA.',
            {
              timeOut: 1500,
            }
          );
        } else {
          this.createPrograma();
        }
      }
    }
  }

  public createPrograma() {
    if (this.classPeriodoPrograma.idPeriodoPrograma) {
      this.periodoProgramaService
        .updatePeriodoPrograma(
          this.classPeriodoPrograma.idPeriodoPrograma,
          this.classPeriodoPrograma
        )
        .subscribe((data) => {
          if (data != null) {
            this.programaService
              .updatePrograma(
                this.classPrograma.idPrograma!,
                this.classPrograma
              )
              .subscribe((data) => {
                if (data != null) {
                  this.toastrService.success(
                    'Se ha actualizado correctamente el programa de capacitación.',
                    'ACTUALIZACIÓN EXITOSA.',
                    {
                      timeOut: 1500,
                    }
                  );
                  
                  this.getTodosLosProgramasPorAdministrador();
           
                  this.classPeriodoPrograma = new PeriodoPrograma();
                  this.classPrograma = new Programas();
                  this.visible = false;
                }
              });
          }
        });
    } else {
      this.classPeriodoPrograma.estadoPeriodoPrograma = true;
      this.periodoProgramaService
        .savePeriodoPrograma(this.classPeriodoPrograma)
        .subscribe((data) => {
          if (data != null) {
            this.classPrograma.periodoPrograma = data;
            this.classPrograma.estadoProgramaActivo = true;
            this.programaService
              .savePrograma(this.classPrograma)
              .subscribe((data) => {
                if (data != null) {
                  this.getTodosLosProgramasPorAdministrador();
                  this.classPeriodoPrograma = new PeriodoPrograma();
                  this.classPrograma = new Programas();
                  this.toastrService.success(
                    'Se ha creado correctamente el programa de capacitación.',
                    'CREACIÓN EXITOSA.',
                    {
                      timeOut: 1500,
                    }
                  );
                  this.visible = false;
                }
              });
          }
        });
    }
  }

  public getTodosLosProgramasPorAdministrador() {
    this.programaService.listPrograma().subscribe((data) => {
      if (data != null) {
        this.listaProgramas = data;
        this.listaProgramasFilter = this.listaProgramas
      }
    });
  }

  //Lo que vamos hacer es el eliminado logico
  public updateProgramasEliminadoLogico(programa: Programas) {
    // programa.estadoProgramaActivo = true;
    programa.estadoProgramaActivo = !programa.estadoProgramaActivo; // Alternar el estado activo/desactivado

    this.programaService
      .updatePrograma(programa.idPrograma!, programa)
      .subscribe((data) => {
        if (data != null) {
          this.getTodosLosProgramasPorAdministrador();
          if (programa.estadoProgramaActivo) {
            this.toastrService.success(
              'El programa ya esta público',
              'Activación Exitosa'
            );
          } else {
            this.toastrService.warning(
              'El programa a sido  acultado',
              'Desactivación Exitosa'
            );
          }
        }
      });
  }

  //Vamos a actualizar

  public cargarDatos(programa: Programas) {
    this.classPrograma = { ...programa };
    this.classPeriodoPrograma = this.classPrograma.periodoPrograma!;

    if (this.classPeriodoPrograma.fechaInicioPeriodoPrograma) {
      this.classPeriodoPrograma.fechaInicioPeriodoPrograma = new Date(
        this.classPeriodoPrograma.fechaInicioPeriodoPrograma
      );
    }

    if (this.classPeriodoPrograma.fechaFinPeriodoPrograma) {
      this.classPeriodoPrograma.fechaFinPeriodoPrograma = new Date(
        this.classPeriodoPrograma.fechaFinPeriodoPrograma
      );
    }
    this.visible = true;
  }

  //vISIVILIADA DEL MODAL
  visible?: boolean;

  public showModaL() {
    //this.classPeriodoPrograma = new PeriodoPrograma();
    //this.classPrograma = new Programas();
    this.visible = true;
  }

  //Implementacion de la fecha para extraer por mes
  public visiblePeriodoMensual?: boolean = false;
  public palabras: any;
  public showModaLImprimirMensal() {
    this.visiblePeriodoMensual = true;
  }

  //Implementacion del evento de la fecha
  public pdfSrc: any;
  onDateSelect(event: any) {
    const selectedDate: Date = event;

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    // alert('Año: ' + year);
    // alert('Mes: ' + month);

    this.reportService.downloadProgramacionMensul(month, year).subscribe(
      (data) => {
        if (data != null) {
          // alert(data)
          const url = URL.createObjectURL(data);
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
      },
      (err) => {
        alert('err');
      }
    );
  }


  //FILTRO PARA LA BUSQUEDAD 
  

  public wordNoFind?: any;
  public listaProgramasFilter: Programas[] = [];
  public filterTableProgramasCapacitacion(e: any) {
    let letter = e.target.value.toLowerCase();

    this.wordNoFind = letter;
    console.log(this.wordNoFind);

    if (this.wordNoFind === '') {
      this.listaProgramasFilter = this.listaProgramas;
    } else {
      let programaslist = this.listaProgramasFilter.filter(
        (p) =>
          (p.nombrePrograma?.toLowerCase().includes(this.wordNoFind) ||
          p.periodoPrograma?.nombrePeriodoPrograma?.toLowerCase().includes(this.wordNoFind) ||
          p.descripcionPrograma?.toLowerCase().includes(this.wordNoFind)
          )
      );
      
      this.listaProgramasFilter = programaslist;
    }
  }

}
