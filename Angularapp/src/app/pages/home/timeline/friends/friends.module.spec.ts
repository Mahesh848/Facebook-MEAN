import { FriendsModule } from './friends.module';

describe('FriendsModule', () => {
  let friendsModule: FriendsModule;

  beforeEach(() => {
    friendsModule = new FriendsModule();
  });

  it('should create an instance', () => {
    expect(friendsModule).toBeTruthy();
  });
});
