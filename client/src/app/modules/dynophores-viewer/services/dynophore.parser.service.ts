
import { Injectable } from '@angular/core';
import { XmlParser } from '@angular/compiler';
import { FeatureCloudModel } from '../models/feature-cloud.model';
import { DynophoreModel } from '../models/dynophore.model';

@Injectable({
  providedIn: 'any'
})
export class ParserService {

  private xmlParser: XmlParser = new XmlParser();

  constructor(
  ) { }

  public parseDynophore(dynophoreFile: any):any {
    let dynophore: any = {};
    const parsed = this.xmlParser.parse(dynophoreFile, 'dyno_dynophore.pml');
    if (!parsed || parsed.errors.length > 0) return null;
    return new DynophoreModel(parsed.rootNodes[1]);
  };

};



