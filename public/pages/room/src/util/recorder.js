class Recorder {
  constructor(userName, stream) {
    this.userName = userName;
    this.stream = stream;

    this.filename = `id-${userName}-when-${Date.now()}`;
    this.videoType = 'video/webm';

    this.mediaRecorder = {};
    this.recordedBlobs = [];
    this.completeRecordings = [];
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

  async stopRecording() {
    if (!this.recordingActive) return;
    if (this.mediaRecorder.state === 'inactive') return;

    this.mediaRecorder.stop();
    console.log('Recording stopped', this.userName);

    this.recordingActive = false;

    await Util.sleep(200);

    this.completeRecordings.push([...this.recordedBlobs]);
    this.recordedBlobs = [];
  }

  getAllVideoURLs() {
    return this.completeRecordings.map(record => {
      const superBuffer = new Blob(record, { type: this.videoType });

      return window.URL.createObjectURL(superBuffer);
    });
  }
}
