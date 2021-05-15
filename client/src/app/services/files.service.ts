import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { XmlParser } from '@angular/compiler';
import { Observable, BehaviorSubject, combineLatest, of, from } from 'rxjs';
import { NGL } from '@/app/ngl.const';

import { environment } from '@/environments/environment';
import { FilesActions } from '@/app/actions/action-types';

import { AppState } from '@/app/reducers';
import { DynophoreModel } from '@/app/models/dynophore.model';
import { IDynophore } from '../modules/_dynophores-viewer/models/dynophore.model';

@Injectable({
  providedIn: 'any'
})
export class FilesService {

  private xmlParser: XmlParser = new XmlParser();
  private baseUrl = environment.base_url;
  private isCustom = false;
  private defaultPdbUri = `${this.baseUrl}/data/startframe.pdb`;
  private defaultPmlUri = `${this.baseUrl}/data/dyno_dynophore.pml`;
  private defaultDcdUri = `${this.baseUrl}/data/trajectory.dcd`;

  constructor(
    private _store: Store<AppState>,
    private http: HttpClient

  ) {
  }

  public initialize(stageInstance: any) {
    //this.setFile(stageInstance);
  }

  public uploadPdbPml(stageInstance: any) {
    let pmlRequest = this.http.get(this.defaultPmlUri, {
      headers: new HttpHeaders()
        .set('Content-Type', 'text/xml')
        .append('Access-Control-Allow-Methods', 'GET')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
      responseType: 'text'
    });
    let pdbRequest = stageInstance.loadFile(this.defaultPdbUri, { ext: "pdb", name: "startframe" });
    return combineLatest([
      pmlRequest,
      pdbRequest
    ]);
  }

  public uploadDcd() {
    let dcdRequest = NGL.autoLoad(this.defaultDcdUri, {
      ext: 'dcd',
      defaultRepresentation: true
    });
    return dcdRequest;
  }

  public setFile(instance: any) {
    if (!this.isCustom) {
      this.http.get(this.defaultPmlUri, {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType: 'text'
      }).subscribe(file => {
        this._store.dispatch(FilesActions.pmlUpload({ pmlFile: file }))
      });

      from(instance.loadFile(this.defaultPdbUri, {
        defaultRepresentation: true
      })).subscribe(file => {
        console.log('file', file)
        this._store.dispatch(FilesActions.pdbUpload({ pdbFile: file }))
      });

      from(NGL.autoLoad(this.defaultDcdUri, {
        defaultRepresentation: true
      })).subscribe(file => {
        console.log('file', file)
        this._store.dispatch(FilesActions.dcdUpload({ dcdFile: file }))
      });
    }
  }

  public setCustom(val: boolean) {
    this.isCustom = val;
    this._store.dispatch(FilesActions.setCustom({ custom: this.isCustom }))
  }

  private parseDynophore(dynophoreFile: any, name: string):any {
    const parsed = this.xmlParser.parse(dynophoreFile, name);
    if (!parsed || parsed.errors.length > 0) return null;
    return new DynophoreModel(parsed.rootNodes[1]);
  };

}
