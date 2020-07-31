import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) { }

  getChartData(){
   return this.http.get('http://localhost:3000/comment/getComment') 

  }
  newComment(obj){
    return this.http.post('http://localhost:3000/comment/createComment' , obj)
  }
}
