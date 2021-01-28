class Business {
  constructor({ media, room, view, socketBuilder, peerBuilder }) {
    this.media = media;
    this.room = room;
    this.view = view;

    this.socketBuilder = socketBuilder;
    this.peerBuilder = peerBuilder;

    this.currentStream = {};
    this.socket = {};
    this.currentPeer = {};

    this.peers = new Map();
    this.userRecordings = new Map();
  }

  static initialize(deps) {
    const instance = new Business(deps);
    return instance._init();
  }

  async _init() {
    this.view.configureRecordButton(this.onRecordPressed.bind(this));

    this.currentStream = await this.media.getCamera(true);
    this.socket = this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .build();

    this.currentPeer = await this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onPeerCallReceived())
      .setOnPeerStreamReceived(this.onPeerStreamReceived())
      .setOnCallError(this.onPeerCallError())
      .setOnCallClose(this.onPeerCallClose())
      .build();

    this.addVideoStream(this.currentPeer.id);
  }

  addVideoStream(userId, stream = this.currentStream) {
    const recorderInstance = new Recorder(userId, stream);
    this.userRecordings.set(recorderInstance.filename, recorderInstance);
    if (this.recordingEnabled) recorderInstance.startRecording();

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
      this.currentPeer.call(userId, this.currentStream);
    };
  }

  onUserDisconnected() {
    return userId => {
      console.log('User disconnected', userId);

      if (this.peers.has(userId)) {
        this.peers.get(userId).call.close();
        this.peers.delete(userId);
      }

      this.view.setParticipants(this.peers.size);
      this.view.removeVideoElement(userId);
    };
  }

  onPeerError() {
    return error => {
      console.error('error on peer!', error);
    };
  }

  onPeerConnectionOpened() {
    return peer => {
      const id = peer.id;

      this.socket.emit('join-room', this.room, id);
    };
  }

  onPeerCallReceived() {
    return call => call.answer(this.currentStream);
  }

  onPeerStreamReceived() {
    return (call, stream) => {
      const callerId = call.peer;

      if (!this.peers.has(callerId)) this.addVideoStream(callerId, stream);
      this.peers.set(callerId, { call });

      this.view.setParticipants(this.peers.size);
    };
  }

  onPeerCallError() {
    return (call, error) => {
      console.error('A call error ocurred', error);
      call.answer(this.currentStream);
      this.view.removeVideoElement(call.peer);
    };
  }

  onPeerCallClose() {
    return call => console.log('Call closed', call.peer);
  }

  onRecordPressed(recordingEnabled) {
    this.recordingEnabled = recordingEnabled;
  }
}
