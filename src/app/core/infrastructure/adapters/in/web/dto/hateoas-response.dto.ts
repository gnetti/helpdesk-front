import {Person} from '@core/domain/models/person.model';

export interface HateoasResponse<T> {
  _embedded: {
    [key: string]: T[];
  };
  _links: {
    first: { href: string };
    self: { href: string };
    next?: { href: string };
    prev?: { href: string };
    last: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export type PersonHateoasResponse = HateoasResponse<Person>;
