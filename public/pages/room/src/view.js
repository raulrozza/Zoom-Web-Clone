class View {
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

  renderVideo({
    userId,
    stream = null,
    url = null,
    isCurrentId = false,
    muted = true,
  }) {
    const video = this.createVideoElement({
      src: url,
      muted,
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
}
