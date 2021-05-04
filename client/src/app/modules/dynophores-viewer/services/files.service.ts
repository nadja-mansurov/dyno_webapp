import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, of, from } from 'rxjs';
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

  private fileNames = {
    pdbFile: '',
    pmlFile: '',
    dcdFile: ''
  };

  public uploaded$ = new BehaviorSubject(false);
  public redraw$ = new BehaviorSubject(false);

  constructor(
    private http: HttpClient
    ) {
    }

  setFile(file: any, type: string, name: string) {
    if (type === 'pml') {
      this.pmlFile = file;
      this.fileNames.pmlFile = name;
    }
    if (type === 'pdb') {
      this.pdbFile = file;
      this.fileNames.pdbFile = name;
    }
    if (type === 'dcd') {
      this.dcdFile = file;
      this.fileNames.dcdFile = name;
    }
    if (this.pmlFile && this.pdbFile && this.dcdFile) {
      this.uploaded$.next(true);
    } else {
      this.uploaded$.next(false);
    }
  }

  getFileNames() {
    return this.fileNames;
  }

  redraw() {
    this.redraw$.next(true);
    setTimeout(() => {
      this.redraw$.next(false);
    }, 5000)
  }

  files(stageInstance: any) {
    let pmlRequest = this.getFiles('dyno_dynophore', 'pml');
    let pdbRequest = this.getFiles('startframe', 'pdb', stageInstance);
    if (this.pmlFile) {
      pmlRequest = this.http.get(this.pmlFile, {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType: 'text'
      })
    }
    if (this.pdbFile) {
      pdbRequest = stageInstance.loadFile(this.pdbFile, { ext: "pdb", name: "startframe" })
    }

    return combineLatest([
      pmlRequest,
      pdbRequest
    ]);
  }

  filesStructure(stageInstance: any) {
    let pdbRequest = this.getFiles('startframe', 'pdb', stageInstance);
    if (this.pdbFile) {
      pdbRequest = from(stageInstance.loadFile(this.pdbFile, { ext: "pdb", name: "startframe1233" }))
    }
    return pdbRequest;
  }

  filesDynophore() {
    let pmlRequest = this.getFiles('dyno_dynophore', 'pml');
    if (this.pmlFile) {
      pmlRequest = this.http.get(this.pmlFile, {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType: 'text'
      })
    }
    return pmlRequest;
  }

  filesTrajectory() {
    let dcdRequest = this.getFiles('trajectory', 'dcd');

    if (this.dcdFile) {
      dcdRequest = NGL.autoLoad(this.dcdFile, {
        ext: 'dcd',
        defaultRepresentation: true
      });
    }

    return dcdRequest;
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
      return from(instance.loadFile(`${this.baseUrl}/data/${name}.${type}`, {
        defaultRepresentation: true
      }))
    } else if (type.toLowerCase() === 'dcd') {
      return from(NGL.autoLoad(`${this.baseUrl}/data/${name}.${type}`, {
        defaultRepresentation: true
      }))
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
