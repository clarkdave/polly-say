# polly-say

A tiny app which listens for requests and then uses [AWS Polly](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html) to synthesize speech, and then outputs it using the node [speaker](https://www.npmjs.com/package/speaker) module

You'll need to have a few ENV vars set to use it:

- `SECRET_TOKEN` - used to authenticate incoming requests
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION` (bear in mind Polly is not in all regions)

## how to use

You'll need to have node 7.4 or above, and use the `harmony-async-await` flag. I've also only tested this on a mac

In order to play the synthesized speech, it opens a child process to call itself in another node process. That's because running the `speaker` module sometimes [kills the process after it plays the sound](https://github.com/TooTallNate/node-speaker/issues/92). Hacky workaround: run it in a child process, so it gets to play the sound and then crash without affecting the express server.

The express server has a very rudimentary and not-multi-process-safe check to avoid doing concurrent synthesizing. concurrent requests will get a `429` error code.

## disclaimer

totally untested and made for fun!
