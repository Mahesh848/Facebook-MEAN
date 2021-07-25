import { ShowuserDetailsModule } from './showuser-details.module';

describe('ShowuserDetailsModule', () => {
  let showuserDetailsModule: ShowuserDetailsModule;

  beforeEach(() => {
    showuserDetailsModule = new ShowuserDetailsModule();
  });

  it('should create an instance', () => {
    expect(showuserDetailsModule).toBeTruthy();
  });
});
