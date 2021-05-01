import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, combineLatest } from 'rxjs';
import { NGL } from '@/app/ngl.const';

import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'any'
})
export class UploadFilesService {
  private baseUrl = environment.base_url;

  private pdbFile: any;
  private pmlFile: any;
  private dcdFile: any;

  public uploaded$ = new BehaviorSubject(false);
  public redraw$ = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
    ) {
    }

  setFile(file: any, type: string) {
    if (type === 'pml') {
      this.pmlFile = file;
    }
    if (type === 'pdb') {
      this.pdbFile = file;
    }
    if (type === 'dcd') {
      this.dcdFile = file;
    }
    if (this.pmlFile && this.pdbFile && this.dcdFile) {
      this.uploaded$.next(true);
    } else {
      this.uploaded$.next(false);
    }
  }

  redraw() {
    this.redraw$.next(true);
    setTimeout(() => {
      this.redraw$.next(false);
    }, 5000)
  }

  files(stageInstance: any, fromUploaded?: boolean) {
    if (!fromUploaded) return combineLatest([
      this.getFiles('dyno_dynophore', 'pml'),
      this.getFiles('startframe', 'pdb', stageInstance)
    ]);

    console.log('this.pdbFile', this.pdbFile);
    return combineLatest([
      this.http.get(this.pmlFile, {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType: 'text'
      }),
      stageInstance.loadFile(this.pdbFile, { ext: "pdb" })
    ])
  }

  filesTrajectory(fromUploaded?: boolean) {
    if (!fromUploaded) return this.getFiles('trajectory', 'dcd')
    return NGL.autoLoad(this.dcdFile, {
      ext: 'dcd',
      defaultRepresentation: true
    });
  }

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
