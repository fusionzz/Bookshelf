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
  
  allBooks:any[] = [];
  filteredBooks:any[] = [];
  numPages:number = 1;

  originalPages = 0;

  currBooks?:any[] = [];
  currPage:number = 0;

  titleSearchText = "";
  authorSearchText = "";

  //creates empty array of size i
  toRange(i:number){
    return new Array(i);
  }

  //loads first page so we arent waiting for nothing
  getFirstPage(){
    this.bookService.getHomeLibrary(0).subscribe(
      response => {
        this.allBooks?.push(...response.items);
        this.filteredBooks = [...this.allBooks];
        this.setBooks(0);
      }
    )
  }

  getBooks(index:number):any{
    return lastValueFrom(this.bookService.getHomeLibrary(index));
  }

  //gets all the books to populate pages
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
    this.filteredBooks = [...this.allBooks];
    this.originalPages = this.numPages;
  }


  //for changing pages
  setBooks(page:number){
    this.currBooks = this.filteredBooks.slice(page*this.itemsPerPage, page*this.itemsPerPage+this.itemsPerPage);
  }

  //sort by title
  titleAsc:boolean = false;
  titleSorted:boolean = false;

  titleSort(){
    this.authorSorted = false;
    this.authorAsc = false;
    this.titleSorted = true;
    this.titleAsc = !this.titleAsc;
    this.allBooks?.sort((a,b) => {
      if (this.titleAsc){
        if (a.volumeInfo.title < b.volumeInfo.title){
          return -1;
        }else{
          return 1;
        }
      }else{
        if (a.volumeInfo.title < b.volumeInfo.title){
          return 1;
        }else{
          return -1;
        }
      }
    })
    this.titleSearch();
  }

  //sort by author first name
  authorAsc:boolean = false;
  authorSorted:boolean = false;

  authorSort(){
    this.titleSorted = false;
    this.titleAsc = false;
    this.authorSorted = true;
    this.authorAsc = !this.authorAsc;
    this.allBooks?.sort((a,b) => {
      if (this.authorAsc){
        if (a.volumeInfo.authors < b.volumeInfo.authors){
          return -1;
        }else{
          return 1;
        }
      }else{
        if (a.volumeInfo.authors < b.volumeInfo.authors){
          return 1;
        }else{
          return -1;
        }
      }
    })
    this.authorSearch();
  }

  //CANT SEARCH BY BOTH, SHOULD FIX

  titleSearch(){
    this.filteredBooks = [...this.allBooks.filter(book => book.volumeInfo.title.toLowerCase().includes(this.titleSearchText.toLowerCase()))];
    this.setBooks(0);
    if (this.titleSearchText.length == 0){
      this.numPages = this.originalPages;
    }else{
      this.numPages = Math.floor(this.filteredBooks.length / this.itemsPerPage) + (this.filteredBooks.length % this.itemsPerPage == 0 ? 0 : 1);
    }
  }

  authorSearch(){
    this.filteredBooks = [...this.allBooks.filter(book => book.volumeInfo.authors[0].toLowerCase().includes(this.authorSearchText.toLowerCase()))];
    this.setBooks(0);
    if (this.authorSearchText.length == 0){
      this.numPages = this.originalPages;
    }else{
      this.numPages = Math.floor(this.filteredBooks.length / this.itemsPerPage) + (this.filteredBooks.length % this.itemsPerPage == 0 ? 0 : 1);
    }
  }

}
