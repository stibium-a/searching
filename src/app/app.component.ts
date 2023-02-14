import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription, takeWhile } from 'rxjs';
import { HttpService } from './services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'githubSearch';
  getSubscription!: Subscription;
  isHttpAlive: boolean = true;
  isSearchActive:boolean = false;
  noSearchResults:boolean = false;

  pageIndex: number = 0;
  pageIndexSearch: number = 0;

  pureRepositoriesArray: any[] = [];
  dividedArrayOfRepositories: any[] = [];
  
  arrayOfRepositoriesPerPage: any[] = [];
  
  pageEvent?: PageEvent;
  
  length: number = 0;
  numberOfItemsPerPage: number = 10;

  searchValue: string = '';

  pictureUrl: string = '';
  userLogin: string = '';

  spinnerVisible: boolean = false;

  arrayFromResponce:any[] = [];
  arrayResponceAfterDividing:any[] = [];
  sortedReposArray:any[] = [];

  constructor(
    private httpService: HttpService,
    public matDialog: MatDialog) { }

  ngOnInit() {
    
    this.spinnerVisible = true;
    this.getAllRepositories();
  }

  ngAfterViewInit() { }

  ngOnDestroy(): void {

    this.getSubscription.unsubscribe();
    this.isHttpAlive = false;
  }


  // get request from api
  getAllRepositories() {

    this.httpService.getRepositoriesList()
      .pipe(takeWhile(() => this.isHttpAlive))
      .subscribe((reposList) => this.sortingArrayByLogin(reposList));
  }

  sortingArrayByLogin(array: any) {
    this.pureRepositoriesArray = array.sort((a: any, b: any) => {
      const ownerLoginA = a.name.toLowerCase();
      const ownerLoginB = b.name.toLowerCase();

      if (ownerLoginA > ownerLoginB) return 1;
      if (ownerLoginA < ownerLoginB) return -1;
      return 0;
    });

    this.divideArrayByParts(this.pureRepositoriesArray, this.dividedArrayOfRepositories, this.arrayOfRepositoriesPerPage);
  }

  // dividing of array for parts
  divideArrayByParts( arrayForDviding:any, arrayAfterDividing:any, onePageArray:any) {

    let size = this.numberOfItemsPerPage; //размер подмассива
    this.length = arrayForDviding.length;

    for (let i = 0; i < Math.ceil(arrayForDviding.length / size); i++) {
      arrayAfterDividing[i] = arrayForDviding.slice((i * size), (i * size) + size);
    }

    onePageArray.length == 0 ? onePageArray.push(...arrayAfterDividing[this.pageIndex]) : 0;

    this.spinnerVisible = false;
  }

  //handling click event on paginator
  handlePageEvent(event: PageEvent) {

    this.pageEvent = event;

    !this.isSearchActive ? 
      this.pageIndex = event.pageIndex : this.pageIndexSearch = event.pageIndex;

    this.numberOfItemsPerPage = event.pageSize;

      this.sortedReposArray = this.arrayResponceAfterDividing[this.pageIndexSearch];
      this.arrayOfRepositoriesPerPage = this.dividedArrayOfRepositories[this.pageIndex]; 
  }

  getInfoAboutUser(repository: any) {

    this.userLogin = repository.owner.login;
    this.pictureUrl = repository.owner.avatar_url;
  }

  findUser(user: string) {
    this.httpService.getUser(user)
      .pipe(takeWhile(() => this.isHttpAlive))
      .subscribe((user) => console.log(user)
      )
  }

  findRepository(value:string) {
    this.isSearchActive = true;

    this.httpService.getRepositoriesList()
      .pipe(takeWhile(() => this.isHttpAlive))
      .subscribe((repo) => this.sortRepositories(repo, value));
  }
  
  sortRepositories(repository:any, string:string){

    this.sortedReposArray = [];
    this.arrayFromResponce = [];
    this.arrayResponceAfterDividing = [];

    repository.forEach((repo:any)=>
    repo.name.startsWith(string) ? this.arrayFromResponce.push(repo) : 0);

    this.arrayFromResponce.length !== 0 ? 
    this.divideArrayByParts(this.arrayFromResponce, this.arrayResponceAfterDividing, this.sortedReposArray) : this.noSearchResults = true;
  }

  openDialog() {

    let dialog = this.matDialog
      .open(DialogComponent,
        {
          data:
          {
            url: this.pictureUrl,
            login: this.userLogin
          }
        });
  }
}
