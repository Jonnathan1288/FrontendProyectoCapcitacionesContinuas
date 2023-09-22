import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageKeys, clearLocalStorage, getRole, getUserData } from 'src/app/util/local-storage-manager';
import { TimeOut } from 'src/app/util/model/time-out';
import { TimeOutTokenService } from 'src/app/util/service/time-out-token.service';
@Component({
  selector: 'app-headersb',
  templateUrl: './headersb.component.html',
  styleUrls: ['./headersb.component.css'],

})
export class HeadersbComponent implements OnInit {

  public rolUserLoggin: string = '';
  public nameUserLoggin: string = '';
  public imageUserLoggin: string = '';

  public timeOut = new TimeOut();

  public messageDialog: boolean = false;
  public keyValue: string = '';
  public messageView: string = ''

  constructor(
    private router: Router,
    private TimeOutService: TimeOutTokenService,
  ) {
  }
  ngOnInit(): void {
    setInterval(() => {
      this.timeSignOutAutmatically();
    }, 1000);

    this.getDataUserLoggin();

  }

  public getDataUserLoggin() {
    const userData = getUserData(LocalStorageKeys.USER_DATA);

    this.nameUserLoggin = userData.username;
    this.imageUserLoggin = userData.foto;

    this.rolUserLoggin = getRole(LocalStorageKeys.ROL)!;
  }

  public timeSignOutAutmatically() {
    const timeOutSeconds: { [key: number | string]: Function } = {
      60: () => this.automaticallyMessagePresentOut('warning'),
      3: () => { this.logOut() },
      'error': () => {
        this.automaticallyMessagePresentOut('err')
      }
    };

    this.timeOut = this.TimeOutService.getTimeOutToken();

    const remainingSeconds = this.timeOut ? this.timeOut.totalSeconds : undefined;

    const actionRequiered = timeOutSeconds[remainingSeconds || 'error']
    if (actionRequiered) {
      actionRequiered();
    }
  }

  public getTimeOutCredential(): string {
    return `Tu sesión terminará en ${this.timeOut.hour} horas, ${this.timeOut.minute} minutos y ${this.timeOut.second} segundos.`;
  }

  public reverseTime(): number {
    return 5 - this.timeOut.hour!
  }

  // LOGOUT
  public logOut() {
    this.router.navigate(['/home']).then(() => {
      clearLocalStorage()
      window.location.reload();
    });
  }


  public automaticallyMessagePresentOut(key: string) {
    this.keyValue = key;

    const DATA_IDENTIFY: { [key: string]: string } = {
      'warning': `Su sesión caducará en menos de ${this.timeOut.minute} minuto. Le recomendamos salir e ingresar nuevamente.`,
      'err': 'La sesión ha presentado inconvenientes.',
    };

    const valueMessage = DATA_IDENTIFY[key] || 'err';

    this.messageView = valueMessage;
    this.messageDialog = true

  }

  public confirmDialogClose(type: number) {
    this.messageDialog = false;

    type === 1 ? this.keyValue === 'warning' ? null : this.logOut() : null;
    type === 2 ? this.keyValue === 'warning' ? null : this.logOut() : null;
    type === 3 ? this.logOut() : null;
  }

}
