import { PostDetailsModule } from './post-details.module';

describe('PostDetailsModule', () => {
  let postDetailsModule: PostDetailsModule;

  beforeEach(() => {
    postDetailsModule = new PostDetailsModule();
  });

  it('should create an instance', () => {
    expect(postDetailsModule).toBeTruthy();
  });
});
