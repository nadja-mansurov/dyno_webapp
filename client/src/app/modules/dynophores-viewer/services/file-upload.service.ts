import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NGL } from '@/app/ngl.const';

import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class UploadFilesService {
  private baseUrl = environment.base_url;

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
    ) {}

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(name: string, type: string, instance?: any): Observable<any> {
    if (type.toLowerCase() === 'json') {
      return this.http.get(`${this.baseUrl}/data/${name}.${type}`);
    } else if (type.toLowerCase() === 'pdb') {
      return instance.loadFile(`${this.baseUrl}/data/${name}.${type}`, {
        defaultRepresentation: true
      })
    } else if (type.toLowerCase() === 'dcd') {
      return NGL.autoLoad(`${this.baseUrl}/data/${name}.${type}`, {
        defaultRepresentation: true
      })
    } else {
      return this.http.get(`${this.baseUrl}/data/${name}.${type}`, {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType: 'text'
      });
    }
  }
}
