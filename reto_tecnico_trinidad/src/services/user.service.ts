import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/'; 

  constructor(private http: HttpClient) {}

  public loginUsuario(usuario: User) {
    return this.http.post<any>(this.apiUrl+'auth/login', usuario);
  }
}