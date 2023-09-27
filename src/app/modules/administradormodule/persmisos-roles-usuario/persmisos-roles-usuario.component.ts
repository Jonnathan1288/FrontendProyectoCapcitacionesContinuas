import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Capacitador } from 'src/app/models/capacitador';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { CapacitadorService } from 'src/app/service/capacitador.service';
import { RolService } from 'src/app/service/rol.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ToastrService } from 'ngx-toastr';


@Component({
	selector: 'app-persmisos-roles-usuario',
	templateUrl: './persmisos-roles-usuario.component.html',
	styleUrls: ['./persmisos-roles-usuario.component.css'],
})
export class PersmisosRolesUsuarioComponent implements OnInit {
	public classUsuario = new Usuario();

	public classCapacitador = new Capacitador();

	public listClassUsuario: Usuario[] = [];

	public listRole: Rol[] = [];

	public listRoleAsignarUser: Rol[] = [];

	constructor(
		private usuarioService: UsuarioService,
		private rolService: RolService,
		private capacitadorService: CapacitadorService,

		private toastrService: ToastrService
	) {

	}
	ngOnInit(): void {
		// this.listDocentesCapacitadores();
		this.listUsusuariosCapacitacionesContinuas();
		this.getAllRolesOfDataBase();
	}

	clear() {
		this.listUsuariosFilter = this.listClassUsuario;
	}

	//PAR EL EVENTO DE BUSQUEDA
	//Implementacion de los filtros
	public wordNoFind?: any;
	public filterEventUsuarios(e: any) {
		let letter = e.target.value.toLowerCase();

		this.wordNoFind = letter;
		console.log(this.wordNoFind);

		if (this.wordNoFind === '') {
			this.listUsuariosFilter = this.listClassUsuario;
			// this.numerFoundCountAnimal = this.listALLAnimals.length;
		} else {
			let filterUsusariosRoles = this.listClassUsuario.filter(
				(user) =>
					user.persona?.nombre1?.toLowerCase().includes(this.wordNoFind) ||
					user.persona?.nombre2?.toLowerCase().includes(this.wordNoFind) ||
					user.persona?.apellido1?.toLowerCase().includes(this.wordNoFind) ||
					user.persona?.apellido2?.toLowerCase().includes(this.wordNoFind) ||
					user.persona?.identificacion
						?.toLowerCase()
						.includes(this.wordNoFind) ||
					user.username?.toLowerCase().includes(this.wordNoFind)
			);

			this.listUsuariosFilter = filterUsusariosRoles;
		}
	}
	//END-------------------------------------------------------------------

	//OBTENER TODOS LOS ROLES DE LA BASE DE DATOS..
	public getAllRolesOfDataBase() {
		this.rolService.getAllRoleOfDataBase().subscribe((data) => {
			if (data != null) {
				this.listRole = data;
			}
		});
	}

	public filterGlobalDocenteFenix(e: any) {
		let letter = e.target.value;
		if (letter.length == 10) {
		}
		console.log(letter);
	}

	public cargarDatosDocenteUser(user: Usuario) {
		console.log(user);
		this.classUsuario = { ...user };
		// this.classUsuario = this.usuario!;

		this.listRoleAsignarUser = [...this.classUsuario.roles!];
		// this.listRoleAsignarUser = this.classUsuario.roles!;
		console.log(this.classUsuario.roles);
		this.visible = true;
	}

	//Método para guardar todoslos datos de la persona con rol de capacitador..
	public saveUpdateDocenteDocenteCapacitadorRol() {
		if (this.listRoleAsignarUser.length === 0) {
			// this.toastrService.warning('Verifique los campos obligatorios', 'Debe darle almenos un rol al usuario');
			this.toastrService.error(
				'Debe darle un rol al usuario.',
				'Rol no asignado.'
			);
		} else {
			if (this.classUsuario.idUsuario) {
				this.updateUsuarioRoles();
			}
		}
	}

	//ASIGNAR ROLES A USUARIO
	public asignarRolesUsuario(rol: Rol) {
		const index = this.listRoleAsignarUser.findIndex(
			(item) => item.idRol === rol.idRol
		);

		if (index !== -1) {
			// Si el rol ya existe, lo eliminamos del arreglo
			this.listRoleAsignarUser.splice(index, 1);
		} else {
			// Si el rol no existe, lo agregamos al arreglo
			this.listRoleAsignarUser.push(rol);
		}

		console.log(this.listRoleAsignarUser);
	}

	isRoleAssigned(role: Rol): boolean {
		return this.listRoleAsignarUser.some(
			(assignedRole) => assignedRole.idRol === role.idRol
		);
	}

	//Metodo para actualizar al docente Capacitador
	public updateUsuarioRoles() {
		this.classUsuario.roles = this.listRoleAsignarUser;
		this.usuarioService
			.updateUsuario(this.classUsuario.idUsuario!, this.classUsuario)
			.subscribe((data) => {
				if (data != null) {
					this.capacitadorService
						.existsCapacitadorByUsuarioIdUsuario(data.idUsuario!)
						.subscribe((data1) => {
							if (data1 != null) {
								if (data1 === true) {

									this.listUsusuariosCapacitacionesContinuas();
									this.toastrService.success(
										'Los permisos del usuario fueron actualizados correctamente',
										'PERMISOS ACTUALIZADOS.'
									);
									this.visible = false;
								} else {
									this.classCapacitador.usuario = data;
									this.classCapacitador.estadoActivoCapacitador = true;
									this.capacitadorService
										.saveCapacitador(this.classCapacitador)
										.subscribe((data) => {
											if (data != null) {
												this.listUsusuariosCapacitacionesContinuas();
												this.toastrService.success(
													'Los permisos del usuario fueron actualizados correctamente.',
													'PERMISOS ACTUALIZADOS.'
												);
												this.visible = false;
											}
										});
								}
							}
						});
				}
			});
	}

	//OBETNER TODOS LOS USUARIOS EN EL SISTEMA;---------------------------------------------------------------------------------------------------
	public listUsuariosFilter: Usuario[] = [];
	public listUsusuariosCapacitacionesContinuas() {

		this.usuarioService.findByAllPaginator(0, 5, ["idUsuario", "desc"]).subscribe({
			next: (resp: any) => {
				this.toastrService.info('', 'USUARIOS OBTENIDOS');
				this.listClassUsuario = resp.content;
				this.listUsuariosFilter = this.listClassUsuario;
				this.dataSizeRequest(resp.totalElements);
			}, error: (err) => {
				this.toastrService.error('', 'INCONVENIENTE AL OBTENER USUARIOS');
			}
		});

	}

	//vISIVILIADA DEL MODAL
	visible?: boolean;

	public showModaL() {
		this.classUsuario = new Usuario();
		this.listRoleAsignarUser = [];
		this.visible = true;
	}

	//Eliminado logico del sistema
	public eliminadoLogicoDelCapacitador(user: Usuario) {

		user.estadoUsuarioActivo = !user.estadoUsuarioActivo; // Alternar el estado activo/desactivado

		this.usuarioService.updateUsuario(user?.idUsuario!, user!).subscribe((data) => {
			if (data != null) {
				if (user.estadoUsuarioActivo) {
					this.toastrService.success('Usuario a sido activado/a', 'Usuario activo');
				} else {
					this.toastrService.warning('Usuario a sido inactivado/a', 'Usuario Inactivo');
				}
				// this.listDocentesCapacitadores();
			}
		})
	}

	//OTROS METODOS----------------------------------------------------------------------------------------------------
	public options = [
		{ label: '5', value: 5 },
	];

	public dataSizeRequest(size: number) {
		size >= 10 ? this.options.push({ label: '10', value: 10 }) : null;
		size >= 20 ? this.options.push({ label: '20', value: 20 }) : null;
		size >= 30 ? this.options.push({ label: '30', value: 30 }) : null;
		size >= 50 ? this.options.push({ label: '50', value: 50 }) : null;
		this.options.push({ label: 'TODO', value: size })
	}

	public rows2: number = 5;

	public getPaginatorUserPermission(size: any) {

		this.usuarioService.findByAllPaginator(0, size, ["idUsuario", "desc"]).subscribe({
			next: (resp: any) => {
				this.toastrService.info('', 'TAMAÑO DE USUARIOS SOLICITADOS: ' + size);
				this.listClassUsuario = resp.content;
				this.listUsuariosFilter = this.listClassUsuario;
			}, error: (err) => {
				this.toastrService.error('', 'INCONVENIENTE AL OBTENER USUARIOS');
			}
		});
	}
}
