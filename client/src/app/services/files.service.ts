import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { NGL } from '@/app/const/ngl.const';

import { environment } from '@/environments/environment';
import { FilesActions } from '@/app/actions/action-types';

import { AppState } from '@/app/reducers';
import { getPdbFile, getPmlFile, getDcdFile } from '@/app/selectors/files.selector';

@Injectable({
  providedIn: 'any',
})
export class FilesService {

  public isCustom$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private baseUrl = environment.base_url;
  private isCustom = false;

  private getPdbFile$: Observable<any>;
  private getPmlFile$: Observable<any>;
  private getDcdFile$: Observable<any>;

  private customPdbUri: string;
  private customPmlUri: string;
  private customDcdUri: string;

  private defaultPdbUri: string;
  private defaultPmlUri: string;
  private defaultDcdUri: string;

  constructor(
    private store: Store<AppState>,
    private http: HttpClient,

  ) {

    this.customPdbUri = `${this.baseUrl}/data/startframe.pdb`;
    this.customPmlUri = `${this.baseUrl}/data/dyno_dynophore.pml`;
    this.customDcdUri = `${this.baseUrl}/data/trajectory.dcd`;

    this.defaultPdbUri = `${this.baseUrl}/data/startframe.pdb`;
    this.defaultPmlUri = `${this.baseUrl}/data/dyno_dynophore.pml`;
    this.defaultDcdUri = `${this.baseUrl}/data/trajectory.dcd`;
    this.getPdbFile$ = this.store.pipe(select(getPdbFile));
    this.getPmlFile$ = this.store.pipe(select(getPmlFile));
    this.getDcdFile$ = this.store.pipe(select(getDcdFile));

    this.getPdbFile$.subscribe((file) => {

      this.customPdbUri = file;

    });
    this.getPmlFile$.subscribe((file) => {

      this.customPmlUri = file;

    });
    this.getDcdFile$.subscribe((file) => {

      this.customDcdUri = file;

    });

  }

  public updateFiles(isCustom: boolean) {

    this.isCustom$.next(isCustom);

  }

  public initialize(stageInstance: any) {
    // this.setFile(stageInstance);
  }

  public uploadPdb(stageInstance: any, isCustom?: boolean) {

    const pdbRequest = from(stageInstance.loadFile(isCustom ? this.customPdbUri : this.defaultPdbUri, {
      defaultRepresentation: true,
      ext: 'pdb',
      name: 'startframe',
    }));
    return pdbRequest;

  }

  public uploadPml(isCustom?: boolean) {

    const pmlRequest = this.http.get(isCustom ? this.customPmlUri : this.defaultPmlUri, {
      headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers',
              'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
      responseType: 'text',
    });
    return pmlRequest;

  }

  public uploadDcd(isCustom?: boolean) {

    const dcdRequest = from(NGL.autoLoad(isCustom ? this.customDcdUri : this.defaultDcdUri, {
      ext: 'dcd',
      defaultRepresentation: true,
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
            .append('Access-Control-Allow-Headers',
                'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
        responseType: 'text',
      }).subscribe((file) => {

        this.store.dispatch(FilesActions.pmlUpload({ pmlFile: file }));

      });

      from(instance.loadFile(this.defaultPdbUri, {
        defaultRepresentation: true,
      })).subscribe((file) => {

        // console.log('file', file)
        this.store.dispatch(FilesActions.pdbUpload({ pdbFile: file }));

      });

      from(NGL.autoLoad(this.defaultDcdUri, {
        defaultRepresentation: true,
      })).subscribe((file) => {

        // console.log('file', file)
        this.store.dispatch(FilesActions.dcdUpload({ dcdFile: file }));

      });

    }

  }

  public setCustom(val: boolean) {

    this.isCustom = val;
    this.store.dispatch(FilesActions.setCustom({ custom: this.isCustom }));

  }

}
