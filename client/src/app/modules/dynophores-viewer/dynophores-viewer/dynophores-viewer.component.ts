import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { UploadFilesService } from '@dynophores-viewer/services/file-upload.service';
import { DynophoreModel } from '@dynophores-viewer/models/dynophore.model';
import { XmlParser } from '@angular/compiler';
import { combineLatest } from 'rxjs';
import { NGL } from '@/app/ngl.const';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'dyno-dynophores-viewer',
  templateUrl: './dynophores-viewer.component.html',
  styleUrls: ['./dynophores-viewer.component.scss'],
  providers: [UploadFilesService]
})
export class DynophoresViewerComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private xmlParser: XmlParser = new XmlParser();

  constructor(
    private fileUpload: UploadFilesService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    let stageInstance = new NGL.Stage('viewport');
    this.testDrawPdb();
    this.subs.sink = this.fileUpload
      .getFiles('dyno_dynophore', 'json')
      .subscribe(item => {
        //this.parseJson(item);
      });

    this.subs.sink = combineLatest([
      this.fileUpload.getFiles('dyno_dynophore', 'pml'),
      this.fileUpload.getFiles('startframe', 'pdb', stageInstance)
      //this.fileUpload.getFiles('trajectory', 'dcd', this.stageInstance)
    ]).subscribe(([pmlFile, pdbFile /*, dcdFile*/]) => {
      this.drawPdb(pdbFile, stageInstance);
      //console.log('PML File', pmlFile);
      //console.log('DCD File', dcdFile);
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private drawPdb(pdbFile: any, stageInstance: any) {
    let shape = new NGL.Shape(pdbFile);
    let shapeComp = stageInstance.addComponentFromObject(shape);
    shapeComp.addRepresentation('buffer', { opacity: 0.7 });
    pdbFile.addRepresentation("ball+stick", { color: "atomindex" })
    pdbFile.autoView()
    /*
    console.log('PDB File', pdbFile);
    const ids = this.utils.getAtomTypeIds(pdbFile);
    console.log('ids', ids);

    for (let item in ids) {
      let point_buffer = this.utils.getPointBuffer(ids[item]);
      let shape = new NGL.Shape(item);
      shape.addBuffer(point_buffer);
      let stageInstance = new NGL.Stage('viewport');
      let shapeComp = stageInstance.addComponentFromObject(shape);
      shapeComp.addRepresentation('buffer', { opacity: 0.7 });
      //object.bufferList.0.wireframeGeometry.attributes
      console.log('shapeComp', shapeComp);
      shapeComp.autoView()
    }*/
  }

  private testDrawPdb() {
    const point_buffer = new NGL.PointBuffer(
      {
        position: new Float32Array([
          -10.613967,
          -0.644225,
          2.910789,
          -11.247919,
          -1.269277,
          2.466791,
          -11.26182,
          -2.34503,
          2.112062,
          -11.504133,
          -1.73906,
          2.82834,
          -10.867414,
          -2.273458,
          2.779585,
          -10.577662,
          -2.136554,
          2.895612,
          -10.649367,
          -2.295881,
          2.741458,
          -11.222303,
          -2.524597,
          2.792428,
          -11.156161,
          -2.28288,
          2.295253,
          -10.919819,
          -2.257776,
          2.258959,
          -10.408197,
          -2.634455,
          2.34009,
          -11.091529,
          -1.94181,
          2.847209,
          -10.668756,
          -2.420055,
          2.481735,
          -10.980548,
          -1.873425,
          2.626099,
          -11.776891,
          -1.371866,
          2.027887,
          -11.305461,
          -1.885562,
          3.060881,
          -10.986314,
          -1.488568,
          2.197947,
          -10.483136,
          -2.232077,
          2.559195,
          -11.062391,
          -1.861429,
          2.177739,
          -11.094616,
          -1.95362,
          2.792569,
          -11.41386,
          -2.535479,
          2.766943,
          -11.199646,
          -2.193163,
          3.099085,
          -10.817608,
          -2.142737,
          1.629868,
          -11.484915,
          -2.544079,
          2.597489,
          -11.149264,
          -1.751158,
          2.032808,
          -11.173667,
          -2.140981,
          2.45492,
          -10.885894,
          -2.329879,
          2.248208,
          -11.03424,
          -2.152502,
          2.273912,
          -11.565894,
          -1.636734,
          2.900264,
          -10.526922,
          -2.154016,
          2.299136,
          -10.684026,
          -1.584714,
          2.529933,
          -11.749552,
          -2.024173,
          2.21011,
          -11.564437,
          -2.113886,
          2.643795,
          -11.621566,
          -2.281768,
          2.732846,
          -11.489921,
          -1.634443,
          2.48803,
          -11.566044,
          -1.191131,
          3.11683,
          -11.166017,
          -1.95524,
          2.113138,
          -11.195493,
          -2.167806,
          2.072812,
          -11.530474,
          -2.310654,
          1.857885,
          -11.187015,
          -2.065994,
          2.782211,
          -11.908989,
          -0.887717,
          2.31464,
          -11.330322,
          -1.420885,
          2.39735,
          -10.815028,
          -2.597288,
          1.764639,
          -12.366556,
          -1.552576,
          2.591165,
          -11.321326,
          -1.339883,
          2.658774,
          -12.233598,
          -1.453891,
          1.916787,
          -11.325582,
          -1.948137,
          2.407261,
          -11.180175,
          -1.591113,
          1.944512,
          -11.679658,
          -1.511092,
          2.651701,
          -11.170842,
          -1.53587,
          2.143886,
          -11.762593,
          -1.25816,
          2.248242,
          -11.801243,
          -1.897587,
          2.621313,
          -11.320335,
          -1.412922,
          2.240743,
          -11.366763,
          -1.819338,
          2.599118,
          -11.074633,
          -1.850214,
          1.753685,
          -11.674513,
          -1.899267,
          2.366934,
          -11.259759,
          -2.010242,
          2.142518,
          -10.930293,
          -1.672858,
          2.665234,
          -11.475434,
          -1.575189,
          2.928806,
          -11.537964,
          -2.145759,
          3.015462,
          -11.663726,
          -1.834437,
          2.789369,
          -11.724802,
          -1.717534,
          2.807544,
          -11.415276,
          -1.751294,
          2.53338,
          -11.492546,
          -1.644272,
          2.18705,
          -11.448679,
          -2.030444,
          2.322882,
          -11.397452,
          -1.566717,
          2.333646,
          -11.234141,
          -1.824461,
          2.29603,
          -11.596128,
          -1.877258,
          2.304605,
          -11.166267,
          -1.398099,
          2.898937,
          -11.593974,
          -2.411536,
          2.370396,
          -11.254729,
          -2.12911,
          2.455166,
          -11.752593,
          -2.970619,
          2.487447,
          -11.510619,
          -2.528396,
          1.868194,
          -11.53668,
          -2.50063,
          2.207264,
          -10.150772,
          -2.506914,
          2.856646,
          -10.994442,
          -2.405984,
          1.764816,
          -11.279329,
          -2.647349,
          1.982775,
          -11.908463,
          -2.33157,
          2.055945,
          -11.259135,
          -1.946994,
          2.24431,
          -10.813657,
          -2.503665,
          2.354931,
          -11.101048,
          -2.414773,
          1.983703,
          -10.95165,
          -2.142647,
          2.22943,
          -11.483672,
          -1.544892,
          2.489,
          -11.315374,
          -2.141905,
          2.480372,
          -11.057723,
          -2.156057,
          2.705935,
          -10.786902,
          -2.679159,
          1.928292,
          -11.335089,
          -2.443655,
          2.239412,
          -11.138707,
          -2.794156,
          2.232814,
          -11.210821,
          -2.478024,
          2.877215,
          -11.623205,
          -2.208404,
          2.673769,
          -11.538629,
          -2.045142,
          2.544243,
          -11.458932,
          -2.357371,
          2.458343,
          -10.84077,
          -2.575728,
          2.570874,
          -10.622502,
          -2.411015,
          2.933651,
          -11.165167,
          -2.617643,
          3.125805,
          -10.526082,
          -3.162068,
          2.529124,
          -10.647894,
          -3.140589,
          2.400789,
          -10.522206,
          -2.593996,
          2.824016,
          -12.486915,
          -2.49615,
          2.360266,
          -11.495934,
          -2.535895,
          2.461151,
          -11.434903,
          -2.437542,
          3.000305
        ]),
        color: new Float32Array([
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0,
          1.0,
          0.8431372549019608,
          0.0
        ])
      },
      {
        sizeAttenuation: true,
        pointSize: 2,
        opacity: 0.1,
        useTexture: true,
        alphaTest: 0.0,
        edgeBleach: 0.7,
        forceTransparent: true,
        sortParticles: true
      }
    );
    var shape = new NGL.Shape('H[4599,4602,4601,4608,4609,4600]');

    shape.addBuffer(point_buffer);

    let stageInstance = new NGL.Stage('test');

    var shapeComp = stageInstance.addComponentFromObject(shape);
    shapeComp.addRepresentation('buffer', { opacity: 0.7 });
    console.log('TEST TEST shapeComp', shapeComp);
    shapeComp.autoView()
  }

  private parsePml(pmlFile: any) {
    const parsedPml = this.xmlParser.parse(pmlFile, 'dyno_dynophore.pml');
    const rootNode = parsedPml.rootNodes[1];
    /*
    const pml = {

    };
    console.log('GOT PML FILE', parsedPml);
    console.log('GOT PML pmlFile', pmlFile);
    rootNode.superfeatures.map(item => {
      let point_buffer = {"position": [], "color": [] };

    });

    let point_buffer = new this.PointBuffer({
      //position: new Float32Array(value["position"]),
    });

    let shape = new this.Shape();
    shape.addBuffer;*/
  }
}
