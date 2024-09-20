import {InjectionToken} from '@angular/core';
import {Person} from '@model//person.model';
import {Observable} from 'rxjs';

export interface PersonRepositoryPort {
  createPerson(person: Person): Observable<Person>;

  getAllPersons(params?: any): Observable<any>;

  getPersonById(id: number): Observable<Person>;

  updatePerson(id: number, person: Person): Observable<Person>;

  deletePerson(id: number): Observable<void>;

  getPersonByCpf(cpf: string): Observable<Person>;

  getPersonByEmail(email: string): Observable<Person>;

  existsPersonById(id: number): Observable<boolean>;
}

export const PERSON_REPOSITORY_PORT = new InjectionToken<PersonRepositoryPort>('PersonRepositoryPort');
