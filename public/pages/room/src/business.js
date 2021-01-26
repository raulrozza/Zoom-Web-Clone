class Business {
  constructor({ media, room, view, socketBuilder }) {
    this.media = media;
    this.room = room;
    this.view = view;

    this.socketBuilder = socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .build();
    this.socketBuilder.emit('join-room', this.room, 'teste01');

    this.currentStream = {};
  }

  static initialize(deps) {
    const instance = new Business(deps);
    return instance._init();
  }

  async _init() {
    this.currentStream = await this.media.getCamera();
    this.addVideoStream('test01');
  }

  addVideoStream(userId, stream = this.currentStream) {
    const isCurrentId = false;
    this.view.renderVideo({
      userId,
      stream,
      isCurrentId,
    });
  }

  onUserConnected() {
    return userId => {
      console.log('User connected', userId);
    };
  }

  onUserDisconnected() {
    return userId => {
      console.log('User disconnected', userId);
    };
  }
}
