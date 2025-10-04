import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export abstract class GenericApi {
  private _http = inject(HttpClient)
  private _apiHost = environment.apiUrl

  private _getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  protected _Get<T>(path: string) {
    return this._http.get<T>(`${this._apiHost}${path}`, {
      headers: this._getHeaders(),
    })
  }

  protected _Post<T>(path: string, body?: Record<string, string>) {
    return this._http.post<T>(`${this._apiHost}${path}`, {
      headers: this._getHeaders(),
      body,
    })
  }
}
