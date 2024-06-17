import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { User } from 'src/models/user.model';
// import { setUser, clearUser } from 'src/ngrx/actions/user.actions';
// import { selectUser } from 'src/ngrx/selectors/user.selectors';
// import { UserState } from 'src/ngrx/states/user.state';

import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario = '';
  contrasenia = '';

  aListUsuarios: User[] = [];

  subscription?: Subscription;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private storage: StorageService,
    private userService: UserService
    // private store: Store<{ user: UserState }>
  ) {
    this.aListUsuarios = [
      {
        id: 1,
        usuario: 'test01',
        contrasenia: 'test01',
        perfil: 1 // 1: ADMIN | 2: GESTOR
      },
      {
        id: 2,
        usuario: 'test02',
        contrasenia: 'test02',
        perfil: 2 // 1: ADMIN | 2: GESTOR
      }
    ];
  }

  ngOnInit() {
    // this.limpiarUsuario();
    this.usuario = '';
    this.contrasenia = '';
  }

  async iniciar() {
    // var encontrado: User | undefined;

    if(this.usuario.length === 0 || this.contrasenia.length === 0){
      this.mostrarMensaje('Defina el usuario o contraseña!','danger',1500);
      return;
    }

    const pUsuario = this.usuario.trim();

    const dataUsuario: User = {
      usuario: pUsuario,
      contrasenia: this.contrasenia
    }

    const loading = await this.loading();
    await loading.present();

    const exec = await this.userService.loginUsuario(dataUsuario);

    this.subscription = exec.subscribe({
      next: (response: any) => {
        if (response.status) {
          this.mostrarMensaje('Credenciales correctas!','success',1500);
          this.agregarUsuario(response.data);
          setTimeout(() => {
            loading.dismiss();
            this.router.navigate(['/tarea']);
            // this.navCtrl.navigateForward(['/tarea']);
          }, 1000);
        } else {
          this.mostrarMensaje(response.message,'danger',1500);
          loading.dismiss();
        }
      },
      error: (err) => {
        this.mostrarMensaje('Error durante el login','danger',1500);
        loading.dismiss();
      },
      complete: () => {
      }
    });

    // this.aListUsuarios.map((element)=>{
    //   if(this.usuario === element.usuario && this.contrasenia === element.contrasenia){
    //     encontrado = element;
    //   }
    // });

    // if (encontrado) {
    //   this.mostrarMensaje('Credenciales correctas!','success',1500);
    //   this.agregarUsuario(encontrado);
    //   const loading = await this.loading();
    //   await loading.present();

    //   setTimeout(() => {
    //     loading.dismiss();
    //     this.router.navigate(['/tarea']);
    //     // this.navCtrl.navigateForward(['/tarea']);
    //   }, 1000);
    // } else {
    //   this.mostrarMensaje('Usuario o contraseña incorrecta!','danger',1500);
    // }
  }

  agregarUsuario(data: any) {
    this.storage.agregarStorage('oUsuario',data.oUsuario);
    this.storage.agregarStorage('sToken',data.sToken);
    // this.store.dispatch(setUser({ user: dataUsuario }));
  }

  limpiarUsuario() {
    this.storage.eliminarStorage('oUsuario');
    // this.store.dispatch(clearUser());
  }

  async mostrarMensaje(mensaje: string,color='dark',tiempo=35000) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: tiempo,
      position: 'bottom',
      color: color,
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
  
    await toast.present();
  }

  async loading(mensaje = 'Cargando...') {
    const loading = await this.loadingController.create({
      message: mensaje,
      //duration: 2000,
      spinner: 'circles'
    });

    return loading;
  }

}
