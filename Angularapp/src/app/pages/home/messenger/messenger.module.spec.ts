import { MessengerModule } from './messenger.module';

describe('MessengerModule', () => {
  let messengerModule: MessengerModule;

  beforeEach(() => {
    messengerModule = new MessengerModule();
  });

  it('should create an instance', () => {
    expect(messengerModule).toBeTruthy();
  });
});
