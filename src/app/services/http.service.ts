import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor( private http: HttpClient) { }

  getAllUSers(){
    return this.http.get('https://api.github.com/users');
  }

  getRepositoriesList(){
    return this.http.get('https://api.github.com/repositories');
  }

  getUser(user:string){
    return  this.http.get(`https://api.github.com/users/${user}`);
  }

  findRepo(repo:string){
    return this.http.get(`https://api.github.com/repos/${repo}`);
  }
}
