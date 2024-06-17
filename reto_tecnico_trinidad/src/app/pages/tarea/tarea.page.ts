import { Component, OnInit } from '@angular/core';
import { Tarea } from 'src/models/tarea.model';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, timer } from 'rxjs';
import { User } from 'src/models/user.model';
import { StorageService } from 'src/services/storage.service';
import { Router } from '@angular/router';
// import { setUser, clearUser } from 'src/ngrx/actions/user.actions';
// import { selectUser } from 'src/ngrx/selectors/user.selectors';
// import { UserState } from 'src/ngrx/states/user.state';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.page.html',
  styleUrls: ['./tarea.page.scss'],
})
export class TareaPage implements OnInit {
  sTarea: string = '';
  iTiempo: string = '';
  aListTareas: Tarea[] = [];
  // user$: Observable<User | null>;
  oUsuario: User | undefined;
  administrador = false;
  editar = false;
  idTarea = 0;

  constructor(
    private toastController: ToastController,
    private storage: StorageService,
    private router: Router
    // private store: Store<{ user: UserState }>
  ) {
    // this.user$ = this.store.select(selectUser);
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.obtenerUsuario();
    this.obtenerTareas();
  }

  async obtenerTareas(){
    const aTareas = await this.storage.obtenerStorage('aTareas')??[];
    if(aTareas){
      this.aListTareas = aTareas;
    }
  };

  async obtenerUsuario(){
    this.oUsuario = await this.storage.obtenerStorage('oUsuario');
    if(this.oUsuario){
      this.administrador = this.oUsuario.perfil && this.oUsuario.perfil === 1? true : false;
    }
  };

  agregarTarea() {
    const alfanumerico = /^[a-zA-Z0-9 ]*$/;
    if(this.sTarea.length === 0){
      this.mostrarMensaje('Definir la tarea!','danger',1500);
      return;
    }
    if(!alfanumerico.test(this.sTarea)){
      this.mostrarMensaje('La tarea debe ser alfanumérica!','danger',1500);
      return;
    }

    const existe = this.aListTareas.find(x=>x.descripcion.toLowerCase() === this.sTarea.trim().toLowerCase() && x.id !== this.idTarea);

    if(existe){
      this.mostrarMensaje('La tarea ya ha sido registrada!','danger',1500);
      return;
    }

    if(this.administrador){
      if(this.iTiempo === ''){
        this.mostrarMensaje('Definir el tiempo!','danger',1500);
        return;
      }
      if(isNaN(Number(this.iTiempo))){
        this.mostrarMensaje('Definir correctamente el tiempo!','danger',1500);
        return;
      }
    }

    // REGISTRAR TAREA EN EL LISTADO

    if(this.editar){
      this.aListTareas.map((element)=>{
        if(element.id === this.idTarea){
          element.descripcion = this.sTarea.trim();
          element.tiempo = this.iTiempo === ''? 0 : parseInt(this.iTiempo);
        }
      });
    } else {
      let id = 1;

      if(this.aListTareas.length > 0) {
        id = this.aListTareas[this.aListTareas.length - 1].id;
      }
  
      this.aListTareas.push({
        id: (id + 1),
        descripcion: this.sTarea.trim(),
        tiempo: this.iTiempo === ''? 0 : parseInt(this.iTiempo),
        check: false,
        estado: 1
      });
    }
    this.storage.agregarStorage('aTareas',this.aListTareas);

    this.cancelarEdicion();
  }

  /*CRUD TAREAS INICIO ------------------------------------------------------------------------------------------------ */

  traerTarea(item: Tarea){
    this.sTarea = item.descripcion;
    this.iTiempo = (item.tiempo || '').toString();
    this.idTarea = item.id;
    this.editar = true;
  }

  cancelarEdicion(){
    this.sTarea = '';
    this.iTiempo = '';
    this.editar = false;
    this.idTarea = 0;
  }

  eliminarTarea(index: number) {
    this.aListTareas.splice(index, 1);
    this.storage.agregarStorage('aTareas',this.aListTareas);
  }

  completarTarea(event: any, index: number) {
    this.aListTareas[index].check = event.detail.checked;
    this.storage.agregarStorage('aTareas',this.aListTareas);
  }


  iniciarTarea(tarea: Tarea): void {
    // ESTADO: 1: Registrada | 2: Solicitada | 3: Iniciada
    if (tarea.subscription) {
      tarea.subscription.unsubscribe();
    }

    tarea.estado = 2;

    tarea.subscription = timer((tarea.tiempo || 0) * 1000).subscribe({
      next: () => {
        if (tarea.estado === 2) {
          tarea.estado = 3;
          this.storage.agregarStorage('aTareas',this.aListTareas);
        }
      },
      complete: () => {
        if (tarea.estado === 2) {
          tarea.estado = 3;
          this.storage.agregarStorage('aTareas',this.aListTareas);
        }
      }
    });

    setTimeout(() => {
      if (tarea.estado === 2) {
        this.cancelarTarea(tarea);
      }
    }, 20000); // 20 segundos
  }

  cancelarTarea(tarea: Tarea): void {
    if (tarea.subscription) {
      tarea.subscription.unsubscribe();
    }
    tarea.estado = 1;
    this.storage.agregarStorage('aTareas',this.aListTareas);
  }
  /*CRUD TAREAS FIN ------------------------------------------------------------------------------------------------ */

  validarInput(event: any, tipo: string) {
    // console.log(event);
    if(tipo === 'descripcion'){
      const pattern = /^[A-Za-z0-9]*$/;
      const inputValue = event.data;
  
      if (!pattern.test(inputValue)) {
        // console.log('ejecuto');
        this.sTarea = this.sTarea.replace(/[^A-Za-z0-9]/g, '');
      }
    } else if(tipo === 'tiempo') {
      const pattern = /^[0-9]*\.?[0-9]*$/;
      const inputValue = event.data;
  
      if (!pattern.test(inputValue)) {
        // console.log('ejecuto');
        this.iTiempo = this.iTiempo.replace(/[^0-9.]/g, '');
      }
    }

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

  cerrarSesion(){
    this.storage.borrarStorage();
    this.router.navigateByUrl('/login');
  }

}
