import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Persona } from 'src/app/models/persona';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { PersonaService } from 'src/app/service/persona.service';
import { RolService } from 'src/app/service/rol.service';
import { UsuarioService } from 'src/app/service/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { UserValidateResponse } from 'src/app/util/model/user-validate-response';
import { UserForm } from 'src/app/util/model/user-form';

@Component({
	selector: 'app-registrar-persona',
	templateUrl: './registrar-persona.component.html',
	styleUrls: ['./registrar-persona.component.css'],
})
export class registrarPersonaComponent implements OnInit {

	public classPersona = new Persona();
	public classUsuario = new Usuario();

	public dataForm = new UserForm();

	public submitted: boolean = false;

	public listRole: Rol[] = [];

	public userResponse = new UserValidateResponse();

	public userForm!: FormGroup;

	constructor(
		private router: Router,
		private personService: PersonaService,
		private userService: UsuarioService,
		private toastService: ToastrService,
		private formBuilder: FormBuilder,
	) {

		this.userForm = this.formBuilder.group({
			dni: ['', [Validators.required, Validators.minLength(10)]],
			email: ['', [
				Validators.required,
				Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
			]],
			username: ['', [Validators.required, Validators.minLength(8)]],
			password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$')]],
		});
	}

	ngOnInit(): void {
	}


	public getDataUser() {
		if (this.userForm.invalid) {
			this.toastService.warning('', 'VERIFIQUE LOS CAMPOS OBLIGATORIOS', { timeOut: 2000 });
			this.userForm.markAllAsTouched();
			return;
		}

		this.dataForm = this.userForm.value;
		this.validateDataUser();

	}

	public validateDataUser() {
		this.submitted = true;

		const existDNI = this.personService.getPersonaByIdentificasion(this.dataForm.dni!);
		const existEmail = this.personService.getPersonaExistsByEmail(this.dataForm.email!);
		const existUsername = this.userService.getExistUsuarioByUsername(this.dataForm.username!);


		forkJoin([existDNI, existEmail, existUsername]).subscribe(
			([existDNIResp, existEmailResp, existUsernameResp]) => {
				this.userResponse.dni = existDNIResp ? 'Identificación existente.' : '';
				this.userResponse.email = existEmailResp ? 'Dirección de correo existente.' : '';
				this.userResponse.username = existUsernameResp ? 'Nombre de usuario existente.' : '';

				if (!existDNIResp && !existEmailResp && !existUsernameResp) {

					this.saveUser();

				} else {
					this.toastService.error('', 'REVISE SUS DATOS');
					this.submitted = false;

				}
			}
		);
	}

	public saveUser() {
		this.classPersona.identificacion = this.dataForm.dni;
		this.classPersona.correo = this.dataForm.email;
		this.personService.savePersona(this.classPersona).subscribe({
			next: (resp) => {
				this.classUsuario.idUsuario = 0;
				this.classUsuario.username = this.dataForm.username;
				this.classUsuario.password = this.dataForm.password;
				this.classUsuario.estadoUsuarioActivo = true;
				this.classUsuario.persona = resp;
				const rol = { idRol: 3, nombreRol: 'Participante', estadoRolActivo: true } as Rol;
				this.classUsuario.roles = [rol] as Rol[]; // no es la mejor opción xd :)

				this.userService.saveUsuario(this.classUsuario).subscribe({
					next: (resp) => {
						this.submitted = false;

						this.toastService.success('DATOS CREADOS', '', { timeOut: 1500 });

						setTimeout(() => {
							this.router.navigate(['/login']);
						}, 2000);

					}, error: (err) => {
						this.submitted = false;
						this.toastService.error('INCONVENIENTE AL GUARDAR', 'ERROR', { timeOut: 2000 });
					}
				});

			}, error: (err) => {
				this.toastService.error('INCONVENIENTE AL GUARDAR', 'ERROR', { timeOut: 2000 });
				this.submitted = false;
			}
		})
	}
}

