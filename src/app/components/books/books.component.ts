import { Component, OnInit } from '@angular/core';
import { BooksApiService } from 'src/app/services/books-api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  constructor(private bookService:BooksApiService) { }

  ngOnInit(): void {
    this.getFirstPage();
  }

  ngAfterContentInit(): void{
    this.getAllBooks();
  }

  itemsPerPage:number = 10;
  
  allBooks?:any[] = [];
  numPages:number = 1;

  currBooks?:any[] = [];
  currPage:number = 0;

  totalItems = 0;

  toRange(i:number){
    return new Array(i);
  }

  getFirstPage(){
    this.bookService.getHomeLibrary(0).subscribe(
      response => {
        this.allBooks?.push(...response.items);
        this.setBooks(0);
      }
    )
  }

  getBooks(index:number):any{
    return lastValueFrom(this.bookService.getHomeLibrary(index));
  }

  async getAllBooks(){
    let currBooks:any[] = [];
    let i = 1;
    let response;

    do {
      response = await this.getBooks(i*this.itemsPerPage);
      currBooks = response.items;
      this.allBooks?.push(...currBooks);
      this.numPages++;
      i++;         
    } while (currBooks.length == this.itemsPerPage)


  }


  //for changing pages
  setBooks(page:number){
    this.currBooks = this.allBooks?.slice(page*this.itemsPerPage, page*this.itemsPerPage+this.itemsPerPage);
    //console.log(this.allBooks)
  }

}
