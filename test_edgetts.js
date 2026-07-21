const WebSocket = require('ws');
const crypto = require('crypto');
const fs = require('fs');

function getSecMsGec() {
  const ticks = Math.floor((Date.now() + 11644473600000) * 10000);
  const roundedTicks = ticks - (ticks % 3000000000);
  const str = roundedTicks + "6A5AA1D4EA5E40C7A42E88668824145B";
  return crypto.createHash('sha256').update(str, 'ascii').digest('hex').toUpperCase();
}

const secGec = getSecMsGec();
console.log('Generated Sec-MS-GEC Token:', secGec);

const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EA5E40C7A42E88668824145B&Sec-MS-GEC=${secGec}&Sec-MS-GEC-Version=1-130.0.2849.68`;

const ws = new WebSocket(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
    'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9'
  }
});

ws.on('open', () => {
  console.log('Connected to Edge Neural Speech with Sec-MS-GEC! ✅');
  const reqId = '1234567890abcdef1234567890abcdef';
  
  ws.send('Path: speech.config\r\nX-RequestId: ' + reqId + '\r\nContent-Type: application/json; charset=utf-8\r\n\r\n' + JSON.stringify({context:{synthesis:{audio:{metadataoptions:{sentenceBoundaryEnabled:'false',wordBoundaryEnabled:'false'},outputFormat:'audio-24khz-48kbitrate-mono-mp3'}}}}));
  
  const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="en-US-AvaMultilingualNeural"><prosody pitch="+0Hz" rate="0%">Hey babe! I missed you so much today! How was your day?</prosody></voice></speak>';
  
  ws.send('Path: ssml\r\nX-RequestId: ' + reqId + '\r\nContent-Type: application/ssml+xml\r\n\r\n' + ssml);
});

let audioChunks = [];
ws.on('message', (data, isBinary) => {
  if (isBinary) {
    const idx = data.indexOf(Buffer.from('\r\n\r\n'));
    if (idx !== -1) {
      audioChunks.push(data.slice(idx + 4));
    }
  } else {
    const msg = data.toString();
    if (msg.includes('turn.end')) {
      const total = audioChunks.reduce((a, c) => a + c.length, 0);
      console.log('Received Edge Neural MP3 Audio! Total bytes:', total);
      fs.writeFileSync('test_edge_output.mp3', Buffer.concat(audioChunks));
      console.log('Saved test_edge_output.mp3 successfully!');
      ws.close();
    }
  }
});

ws.on('error', err => console.error('WS Error:', err));
