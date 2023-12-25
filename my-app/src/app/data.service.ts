import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { letter } from './types';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Get random letter from Elysia API
   * @returns Array of letters
   */
  getLetter(): Observable<letter | null> {
    return this.httpClient.get<letter[]>('http://localhost:8080/receiveLetter').pipe(map((letters: letter[]) => letters.length > 0 ? letters[0] : null));
  }

  /**
   * Vote letter
   * @param letterId Id of letter
   * @returns Array of letters
   */
  voteLetter(letterId: string): Observable<letter | null> {
    const headers = new HttpHeaders().set('id', letterId);
    return this.httpClient.post<letter>('http://localhost:8080/voteLetter', undefined, {headers}).pipe(map((letter: letter) => letter && letter.votes >= 0 ? letter : null));
  }

  createLetter(content: string): Observable<letter | string> {
    const headers = new HttpHeaders().set('content', content);
    return this.httpClient.post<letter | string>('http://localhost:8080/createLetter', undefined, {headers}).pipe(map((letter: letter | string) => letter));
  }
}
