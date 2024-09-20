import {Observable} from 'rxjs';
import {Person} from '@core/domain/models/person.model';
import {PersonHateoasResponse} from "@dto//hateoas-response.dto";


export interface PersonUseCasePort {
  getAllPersons(params: { page: string; size: string }): Observable<PersonHateoasResponse>;

  getPersonById(id: number): Observable<Person>;

  createPerson(person: Person): Observable<Person>;

  updatePerson(id: number, person: Person): Observable<Person>;

  deletePerson(id: number): Observable<void>;
}

export const PERSON_USE_CASE_PORT = 'PersonUseCasePort';
