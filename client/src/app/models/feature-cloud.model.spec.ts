import { FeatureCloudModel } from './feature-cloud.model';


describe('Feature Cloud Model', () => {

  let cloud: FeatureCloudModel;
  const data = {
    attrs: [
      {
        name: 'name',
        value: 'TestCloud',
      },
      {
        name: 'id',
        value: 'TestId',
      },
      {
        name: 'featureColor',
        value: 'ffc20e',
      },
      {
        name: 'featureId',
        value: 'TestFeatureId',
      },
      {
        name: 'optional',
        value: 'false',
      },
      {
        name: 'weight',
        value: '1.0',
      },
      {
        name: 'involvedAtomSerials',
        value: '1,2,3,4',
      },
    ],
    children: [
      {
        name: 'position',
        value: '1,2,3,4',
      },
      {
        name: 'additionalPoint',
        value: {},
      },
    ],
  };

  beforeAll(() => {
    // cloud = new FeatureCloudModel(data);
  });
  test('true to be true', () => {

    expect(true).toBe(true);

  });

});
