import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksApiService {

  constructor(private http:HttpClient) { }

  url:string = "https://www.googleapis.com/books/v1/";
  userId:string = "103203803461631039227";

  getHomeLibrary(startIndex:number):Observable<any>{
    return this.http.get(this.url+"users/"+this.userId+"/bookshelves/1001/volumes?maxResults=10&startIndex="+startIndex);
  }

}
