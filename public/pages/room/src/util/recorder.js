class Recorder {
  constructor(userName, stream) {
    this.userName = userName;
    this.stream = stream;

    this.filename = `id-${userName}-when-${Date.now()}`;
    this.videoType = 'video/webm';

    this.mediaRecorder = {};
    this.recordedBlobs = [];
    this.recordingActive = false;
  }

  _setup() {
    const commonCodecs = ['codecs=vp9,opus', 'codecs=vp8,opus', ''];

    const options = commonCodecs
      .map(codec => ({
        mimeType: `${this.videoType};${codec}`,
      }))
      .find(options => MediaRecorder.isTypeSupported(options.mimeType));

    if (!options)
      throw new Error(
        `none of the codecs: ${commonCodecs.join('; ')} are supported`,
      );

    return options;
  }

  startRecording() {
    const options = this._setup();
    if (!this.stream.active) return;

    this.mediaRecorder = new MediaRecorder(this.stream, options);

    console.log('created media recorder', this.mediaRecorder);

    this.mediaRecorder.onstop = event => {
      console.log('Recorder Blobs', this.recordedBlobs);
    };

    this.mediaRecorder.ondataavailable = event => {
      if (!event.data || !event.data.size) return;

      this.recordedBlobs.push(event.data);
    };

    this.mediaRecorder.start();
    this.recordingActive = true;
    console.log('Started recording!');
  }
}
