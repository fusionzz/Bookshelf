import { Component, OnInit } from '@angular/core';
import { BooksApiService } from 'src/app/services/books-api.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  constructor(private bookService:BooksApiService) { }

  ngOnInit(): void {
    this.getShelves(0);
  }

  itemsPerPage:number = 10;
  
  allBooks?:any[] = [];
  numPages:number = 0;

  currBooks?:any[] = [];
  currPage:number = 0;

  toRange(i:number){
    return new Array(i);
  }

  getAllBooks(){
    for(let i = 1; i < this.numPages;i++){
      this.bookService.getHomeLibrary(i * this.itemsPerPage).subscribe(
        response => {
          this.allBooks?.push(...response.items);
        }
      )
    }
  }

  getShelves(startIndex:number){
    this.bookService.getHomeLibrary(startIndex).subscribe(
      response => {
        this.allBooks?.push(...response.items);
        this.numPages = Math.floor(response.totalItems / this.itemsPerPage) + 1;
        this.setBooks(0);
        this.getAllBooks();
        console.log(response.items);
        console.log(response);
      }
    )
  }

  setBooks(page:number){
    this.currBooks = this.allBooks?.slice(page*this.itemsPerPage, page*this.itemsPerPage+this.itemsPerPage);
  }

}
