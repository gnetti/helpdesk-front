import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ToastrService} from 'ngx-toastr';
import {CoolDialogService} from '@angular-cool/dialogs';
import {PERSON_USE_CASE_PORT, PersonUseCasePort} from '@core/domain/ports/in/person-use-case.port';
import {Person} from '@core/domain/models/person.model';
import {PersonHateoasResponse} from '@core/infrastructure/adapters/in/web/dto/hateoas-response.dto';
import {catchError, finalize, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {FormUtils} from "@utils//form.util";
import {DialogUtils} from "@utils//dialog.til";


@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'cpf', 'email', 'actions'];
  dataSource: MatTableDataSource<Person> = new MatTableDataSource<Person>([]);
  isLoading: boolean = false;
  totalElements: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  links: { [key: string]: string } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(PERSON_USE_CASE_PORT) private personService: PersonUseCasePort,
    private toast: ToastrService,
    private coolDialogService: CoolDialogService
  ) {
  }

  ngOnInit(): void {
    this.loadPersons();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadPersons(): void {
    this.isLoading = true;
    const params = FormUtils.getPageParams(this.pageIndex, this.pageSize);
    this.personService.getAllPersons(params).pipe(
      catchError(() => {
        this.handleError('Erro ao carregar a lista de pessoas');
        return of(null);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(response => {
      if (response) {
        this.handlePersonsResponse(response);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPersons();
  }

  applyFilter(event: Event): void {
    FormUtils.applyFilter(event, this.dataSource);
  }

  async deletePerson(id: number, name: string): Promise<void> {
    const result = await DialogUtils.showDeleteConfirmation(this.coolDialogService, name);
    if (result) {
      this.isLoading = true;
      this.personService.deletePerson(id).pipe(
        catchError(() => {
          this.handleError('Erro ao excluir a pessoa');
          return of(null);
        }),
        switchMap(() => {
          this.toast.success('Pessoa excluída com sucesso', 'Sucesso');
          return this.personService.getAllPersons(FormUtils.getPageParams(this.pageIndex, this.pageSize));
        }),
        catchError(() => {
          this.handleError('Erro ao recarregar a lista de pessoas');
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      ).subscribe(response => {
        if (response) {
          this.handlePersonsResponse(response);
        }
      });
    }
  }

  editPerson(id: number): void {
    this.toast.info(`Funcionalidade de edição a ser implementada para o ID: ${id}`, 'Info');
  }

  viewPerson(): void {
    this.toast.info('Funcionalidade de visualização a ser implementada', 'Info');
  }

  private handlePersonsResponse(response: PersonHateoasResponse): void {
    this.dataSource.data = response._embedded['personDTOList'];
    this.totalElements = response.page.totalElements;
    this.pageSize = response.page.size;
    this.pageIndex = response.page.number;
    this.links = FormUtils.extractLinks(response._links);
  }

  private handleError(message: string): void {
    this.toast.error(message, 'Erro');
  }
}
