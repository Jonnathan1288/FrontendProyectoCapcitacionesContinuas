import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageKeys, clearLocalStorage, getRole, getUserData } from 'src/app/util/local-storage-manager';

@Component({
  selector: 'app-headersb',
  templateUrl: './headersb.component.html',
  styleUrls: ['./headersb.component.css']
})
export class HeadersbComponent implements OnInit {

  public rolUserLoggin: string = '';
  public nameUserLoggin: string = '';
  public imageUserLoggin: string = '';

  constructor(
    private router: Router,
  ) {
  }
  ngOnInit(): void {

    const userData = getUserData(LocalStorageKeys.USER_DATA);

    this.nameUserLoggin = userData.username;
    this.imageUserLoggin = userData.foto;

    this.rolUserLoggin = getRole(LocalStorageKeys.ROL)!;
  }

  // LOGOUT
  public logOut() {
    this.router.navigate(['/home']).then(() => {
      clearLocalStorage()
      window.location.reload();
    });
  }
}
