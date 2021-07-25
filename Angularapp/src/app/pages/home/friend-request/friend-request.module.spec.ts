import { FriendRequestModule } from './friend-request.module';

describe('FriendRequestModule', () => {
  let friendRequestModule: FriendRequestModule;

  beforeEach(() => {
    friendRequestModule = new FriendRequestModule();
  });

  it('should create an instance', () => {
    expect(friendRequestModule).toBeTruthy();
  });
});
