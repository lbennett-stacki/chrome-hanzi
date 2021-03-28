const { CognitoIdentityClient } = require('@aws-sdk/client-cognito-identity');
const {
  fromCognitoIdentityPool,
} = require('@aws-sdk/credential-provider-cognito-identity');
const { Polly } = require('@aws-sdk/client-polly');
const { getSynthesizeSpeechUrl } = require('@aws-sdk/polly-request-presigner');

export class Voice {
  speechParams = {
    OutputFormat: 'mp3',
    SampleRate: '16000',
    Text: '',
    TextType: 'text',
    VoiceId: 'Zhiyu',
  };

  constructor() {
    this.client = new Polly({
      region: 'eu-west-1',
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: 'eu-west-1' }),
        identityPoolId: process.env.AWS_IDENTITY_POOL_ID,
      }),
    });
  }

  create() {
    this.destroy();

    this.audio = this.createAudio();

    return this;
  }

  createAudio() {
    const audio = document.createElement('audio');

    audio.type = 'audio/mp3';
    audio.controls = true;
    // audio.style.display = 'none';
    document.body.appendChild(audio);

    return audio;
  }

  async speak(Text) {
    try {
      await this.setAudio(await this.synthUrl(Text));
    } catch (error) {
      console.error('Error', error);
    }
  }

  async setAudio(url) {
    this.audio.src = url;
    this.audio.load();
    this.audio.play();
  }

  synthUrl() {
    return getSynthesizeSpeechUrl({
      client: this.client,
      params: { ...this.speechParams, Text },
    });
  }

  destroy() {
    this.audio && this.audio.remove();
  }
}
