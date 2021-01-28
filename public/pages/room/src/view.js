class View {
  constructor() {
    this.recorderBtn = document.getElementById('record');
    this.leaveBtn = document.getElementById('leave');
  }

  createVideoElement({ muted = true, src, srcObject }) {
    const video = document.createElement('video');
    video.muted = muted;
    video.src = src;
    video.srcObject = srcObject;

    if (src) {
      video.controls = true;
      video.loop = true;
      Util.sleep(200).then(_ => video.play());
    }

    if (srcObject) {
      video.addEventListener('loadedmetadata', () => video.play());
    }

    return video;
  }

  renderVideo({ userId, stream = null, url = null, isCurrentId = false }) {
    const video = this.createVideoElement({
      src: url,
      muted: isCurrentId,
      srcObject: stream,
    });
    this.appendToHTMLTree(userId, video, isCurrentId);
  }

  appendToHTMLTree(userId, video, isCurrentId) {
    const wrapperDiv = document.createElement('div');
    wrapperDiv.id = userId;
    wrapperDiv.classList.add('wrapper');
    wrapperDiv.append(video);

    const userNameDiv = document.createElement('div');
    userNameDiv.innerText = isCurrentId ? '' : userId;
    wrapperDiv.append(userNameDiv);

    const videoGrid = document.getElementById('video-grid');
    videoGrid.append(wrapperDiv);
  }

  setParticipants(count) {
    const myself = 1;
    const participantsSpan = document.getElementById('participants');
    participantsSpan.innerHTML = count + myself;
  }

  removeVideoElement(id) {
    const element = document.getElementById(id);

    element.remove();
  }

  configureRecordButton(command) {
    this.recorderBtn.addEventListener('click', this.onRecordClick(command));
  }

  onRecordClick(command) {
    this.recordingEnabled = false;
    return () => {
      const isActive = (this.recordingEnabled = !this.recordingEnabled);
      command(this.recordingEnabled);
      this.toggleRecordingButtonColor(isActive);
    };
  }

  toggleRecordingButtonColor(isActive = true) {
    this.recorderBtn.style.color = isActive ? 'red' : 'white';
  }

  configureLeaveButton(command) {
    this.leaveBtn.addEventListener('click', this.onLeaveClick(command));
  }

  onLeaveClick(command) {
    return async () => {
      command();

      await Util.sleep(1000);
      window.location = '/pages/home';
    };
  }
}
