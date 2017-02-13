'use strict'

const stream = require('stream')
const { Polly } = require('aws-sdk')

module.exports = async (text, voice = 'Joanna') => {
  const polly = new Polly()

  const data = await polly.synthesizeSpeech({
    OutputFormat: 'pcm',
    SampleRate: '16000',
    Text: String(text).slice(0, 500),
    TextType: 'text',
    VoiceId: voice,
  }).promise()

  const bufferStream = new stream.PassThrough()
  bufferStream.end(data.AudioStream)

  return {
    audioStream: bufferStream,
    requestCharacters: data.RequestCharacters,
  }
}
