import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { XmlParser } from '@angular/compiler';
import { Observable, BehaviorSubject, combineLatest, of, from } from 'rxjs';
import { NGL } from '@/app/const/ngl.const';

import { environment } from '@/environments/environment';
import { FilesActions } from '@/app/actions/action-types';

import { AppState } from '@/app/reducers';
import { DynophoreModel, IDynophore } from '@/app/models/dynophore.model';
import { getPdbFile, getPmlFile, getDcdFile } from '@/app/selectors/files.selector';

@Injectable({
  providedIn: 'any'
})
export class FilesService {
  public isCustom$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private baseUrl = environment.base_url;
  private isCustom = false;

  private getPdbFile$: Observable<any>;
  private getPmlFile$: Observable<any>;
  private getDcdFile$: Observable<any>;

  private customPdbUri = `${this.baseUrl}/data/startframe.pdb`;
  private customPmlUri = `${this.baseUrl}/data/dyno_dynophore.pml`;
  private customDcdUri = `${this.baseUrl}/data/trajectory.dcd`;

  private defaultPdbUri = `${this.baseUrl}/data/startframe.pdb`;
  private defaultPmlUri = `${this.baseUrl}/data/dyno_dynophore.pml`;
  private defaultDcdUri = `${this.baseUrl}/data/trajectory.dcd`;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient

  ) {
    this.getPdbFile$ = this.store.pipe(select(getPdbFile));
    this.getPmlFile$ = this.store.pipe(select(getPmlFile));
    this.getDcdFile$ = this.store.pipe(select(getDcdFile));

    this.getPdbFile$.subscribe(file => {
      this.customPdbUri = file;
    });
    this.getPmlFile$.subscribe(file => {
      this.customPmlUri = file;
    });
    this.getDcdFile$.subscribe(file => {
      this.customDcdUri = file;
    });
  }

  public updateFiles(isCustom: boolean) {
    this.isCustom$.next(isCustom);
  }

  public initialize(stageInstance: any) {
    //this.setFile(stageInstance);
  }

  public uploadPdb(stageInstance: any, isCustom?: boolean) {
    console.log('uploadPdb', this.customPdbUri);
    let pdbRequest = from(stageInstance.loadFile(isCustom ? this.customPdbUri : this.defaultPdbUri, {
      defaultRepresentation: true,
      ext: "pdb",
      name: "startframe"
    }));
    return pdbRequest;
  }

  public uploadPml(isCustom?: boolean) {
    let pmlRequest = this.http.get(isCustom ? this.customPmlUri : this.defaultPmlUri, {
      headers: new HttpHeaders()
        .set('Content-Type', 'text/xml')
        .append('Access-Control-Allow-Methods', 'GET')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
      responseType: 'text'
    });
    return pmlRequest;
  }

  public uploadDcd(isCustom?: boolean) {
    console.log('this.customDcdUri', this.customDcdUri);
    console.log('isCustom', isCustom);
    let dcdRequest = from(NGL.autoLoad(isCustom ? this.customDcdUri : this.defaultDcdUri, {
      ext: 'dcd',
      defaultRepresentation: true
    }));
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
        this.store.dispatch(FilesActions.pmlUpload({ pmlFile: file }))
      });

      from(instance.loadFile(this.defaultPdbUri, {
        defaultRepresentation: true
      })).subscribe(file => {
        console.log('file', file)
        this.store.dispatch(FilesActions.pdbUpload({ pdbFile: file }))
      });

      from(NGL.autoLoad(this.defaultDcdUri, {
        defaultRepresentation: true
      })).subscribe(file => {
        console.log('file', file)
        this.store.dispatch(FilesActions.dcdUpload({ dcdFile: file }))
      });
    }
  }

  public setCustom(val: boolean) {
    this.isCustom = val;
    this.store.dispatch(FilesActions.setCustom({ custom: this.isCustom }))
  }


}
