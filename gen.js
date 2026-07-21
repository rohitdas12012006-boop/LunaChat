const fs = require('fs');
const p = require('path').join(__dirname, 'index.html');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Luna - Your AI Girl</title>
  <meta name="description" content="Chat with Luna, an emotionally intelligent AI girl who feels real — she laughs, gets angry, falls in love, and even sends you voice messages!"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --bg-primary: #0a0a12;
      --border: rgba(255,255,255,0.08);
      --text-primary: #f0eeff;
      --text-secondary: #a09ab8;
      --accent: #c084fc;
      --glow: rgba(192,132,252,0.3);
    }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:var(--bg-primary); color:var(--text-primary); height:100vh; overflow:hidden; display:flex; flex-direction:column; }
    .aurora { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
    .aurora-blob { position:absolute; border-radius:50%; filter:blur(80px); opacity:0.18; animation:float 12s ease-in-out infinite alternate; }
    .aurora-blob:nth-child(1){width:500px;height:500px;background:#c084fc;top:-120px;left:-100px;animation-duration:14s;}
    .aurora-blob:nth-child(2){width:400px;height:400px;background:#f472b6;bottom:-80px;right:-80px;animation-duration:11s;animation-delay:-4s;}
    .aurora-blob:nth-child(3){width:300px;height:300px;background:#60a5fa;top:40%;left:40%;animation-duration:16s;animation-delay:-7s;}
    @keyframes float{0%{transform:translate(0,0) scale(1);}100%{transform:translate(30px,20px) scale(1.08);}}
    .particles{position:fixed;inset:0;z-index:0;pointer-events:none;}
    .particle{position:absolute;width:3px;height:3px;border-radius:50%;background:var(--accent);opacity:0;animation:rise var(--dur,8s) ease-in infinite;animation-delay:var(--delay,0s);}
    @keyframes rise{0%{transform:translateY(100vh) scale(0);opacity:0;}10%{opacity:0.6;}90%{opacity:0.3;}100%{transform:translateY(-20px) scale(1.5);opacity:0;}}
    .app-wrapper{position:relative;z-index:1;display:flex;flex-direction:column;height:100vh;max-width:520px;margin:0 auto;width:100%;}
    .chat-header{background:rgba(12,12,22,0.85);backdrop-filter:blur(24px);border-bottom:1px solid var(--border);padding:14px 20px;display:flex;align-items:center;gap:14px;position:relative;z-index:10;}
    .avatar-wrap{position:relative;flex-shrink:0;}
    .avatar-img{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid var(--accent);box-shadow:0 0 16px var(--glow);transition:border-color 0.4s,box-shadow 0.4s;}
    .avatar-status{position:absolute;bottom:2px;right:2px;width:13px;height:13px;border-radius:50%;background:#22c55e;border:2px solid var(--bg-primary);animation:pulse-dot 2s ease-in-out infinite;}
    @keyframes pulse-dot{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.6);}50%{box-shadow:0 0 0 6px rgba(34,197,94,0);}}
    .header-info{flex:1;min-width:0;}
    .header-name{font-family:'Quicksand',sans-serif;font-weight:700;font-size:17px;background:linear-gradient(135deg,#c084fc,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .header-status{font-size:12px;color:var(--text-secondary);margin-top:2px;transition:color 0.4s;}
    .emotion-badge{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:20px;padding:5px 12px;font-size:12px;font-weight:600;transition:all 0.4s;white-space:nowrap;}
    .settings-btn{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid var(--border);color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;font-size:16px;}
    .settings-btn:hover{background:rgba(255,255,255,0.12);color:var(--text-primary);}
    .chat-body{flex:1;overflow-y:auto;padding:20px 16px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth;}
    .chat-body::-webkit-scrollbar{width:4px;}
    .chat-body::-webkit-scrollbar-track{background:transparent;}
    .chat-body::-webkit-scrollbar-thumb{background:rgba(192,132,252,0.3);border-radius:4px;}
    .msg-row{display:flex;align-items:flex-end;gap:8px;animation:slideIn 0.35s cubic-bezier(0.34,1.56,0.64,1);}
    .msg-row.user{flex-direction:row-reverse;}
    @keyframes slideIn{from{opacity:0;transform:translateY(12px) scale(0.96);}to{opacity:1;transform:translateY(0) scale(1);}}
    .msg-avatar{width:32px;height:32px;border-radius:50%;object-fit:cover;border:1px solid var(--border);flex-shrink:0;}
    .bubble{max-width:78%;padding:11px 15px;border-radius:20px;font-size:14.5px;line-height:1.55;position:relative;word-break:break-word;}
    .bubble.ai{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-bottom-left-radius:6px;color:var(--text-primary);backdrop-filter:blur(10px);}
    .bubble.user{background:linear-gradient(135deg,#8b5cf6,#c084fc);border-bottom-right-radius:6px;color:white;box-shadow:0 4px 20px rgba(139,92,246,0.4);}
    .bubble.ai.love{border-color:rgba(255,107,157,0.4);box-shadow:0 0 12px rgba(255,107,157,0.15);}
    .bubble.ai.angry{border-color:rgba(255,68,68,0.4);box-shadow:0 0 12px rgba(255,68,68,0.15);}
    .bubble.ai.sad{border-color:rgba(106,176,255,0.4);box-shadow:0 0 12px rgba(106,176,255,0.15);}
    .bubble.ai.happy{border-color:rgba(255,215,0,0.4);box-shadow:0 0 12px rgba(255,215,0,0.15);}
    .bubble.ai.excited{border-color:rgba(167,139,250,0.4);box-shadow:0 0 12px rgba(167,139,250,0.15);}
    .bubble.ai.jealous{border-color:rgba(255,127,80,0.4);box-shadow:0 0 12px rgba(255,127,80,0.15);}
    .bubble.ai.shy{border-color:rgba(255,157,226,0.4);box-shadow:0 0 12px rgba(255,157,226,0.15);}
    .msg-time{font-size:10px;color:var(--text-secondary);margin-top:5px;padding:0 4px;text-align:right;}
    .msg-row.ai .msg-time{text-align:left;}
    .voice-bubble{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:20px;border-bottom-left-radius:6px;padding:10px 14px;min-width:180px;max-width:260px;backdrop-filter:blur(10px);}
    .voice-play-btn{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#c084fc,#f472b6);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;transition:transform 0.2s,box-shadow 0.2s;flex-shrink:0;}
    .voice-play-btn:hover{transform:scale(1.1);box-shadow:0 0 14px rgba(192,132,252,0.5);}
    .voice-play-btn.playing{animation:pulse-play 1s ease-in-out infinite;}
    @keyframes pulse-play{0%,100%{box-shadow:0 0 0 0 rgba(192,132,252,0.5);}50%{box-shadow:0 0 0 8px rgba(192,132,252,0);}}
    .voice-waveform{flex:1;display:flex;align-items:center;gap:2px;height:28px;}
    .waveform-bar{flex:1;background:linear-gradient(to top,#8b5cf6,#c084fc);border-radius:2px;opacity:0.7;}
    .voice-duration{font-size:11px;color:var(--text-secondary);white-space:nowrap;}
    .typing-row{display:flex;align-items:center;gap:8px;animation:slideIn 0.3s ease;}
    .typing-bubble{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:20px;border-bottom-left-radius:6px;padding:12px 16px;display:flex;align-items:center;gap:5px;}
    .dot{width:7px;height:7px;border-radius:50%;background:var(--accent);animation:bounce 1.4s ease-in-out infinite;}
    .dot:nth-child(2){animation-delay:0.15s;}
    .dot:nth-child(3){animation-delay:0.3s;}
    @keyframes bounce{0%,60%,100%{transform:translateY(0);opacity:0.5;}30%{transform:translateY(-6px);opacity:1;}}
    .chat-input-area{background:rgba(12,12,22,0.9);backdrop-filter:blur(24px);border-top:1px solid var(--border);padding:14px 16px;display:flex;align-items:flex-end;gap:10px;}
    .input-box{flex:1;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:24px;padding:12px 18px;color:var(--text-primary);font-family:'Inter',sans-serif;font-size:14px;outline:none;resize:none;min-height:48px;max-height:120px;overflow-y:auto;transition:border-color 0.2s,box-shadow 0.2s;line-height:1.5;}
    .input-box:focus{border-color:rgba(192,132,252,0.5);box-shadow:0 0 0 3px rgba(192,132,252,0.1);}
    .input-box::placeholder{color:var(--text-secondary);}
    .send-btn{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#c084fc);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;transition:transform 0.2s,box-shadow 0.2s;flex-shrink:0;box-shadow:0 4px 16px rgba(139,92,246,0.4);}
    .send-btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(139,92,246,0.6);}
    .send-btn:active{transform:scale(0.95);}
    .send-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
    .emoji-strip{display:flex;gap:6px;padding:6px 16px 0;overflow-x:auto;}
    .emoji-strip::-webkit-scrollbar{display:none;}
    .emoji-chip{background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:16px;padding:4px 10px;font-size:13px;cursor:pointer;white-space:nowrap;transition:background 0.2s,transform 0.2s;}
    .emoji-chip:hover{background:rgba(255,255,255,0.12);transform:scale(1.1);}
    .modal-overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;}
    .modal-overlay.hidden{display:none;}
    .modal{background:#13131f;border:1px solid var(--border);border-radius:24px;padding:28px;width:90%;max-width:420px;}
    .modal h2{font-family:'Quicksand',sans-serif;font-size:20px;font-weight:700;background:linear-gradient(135deg,#c084fc,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:20px;}
    .modal-field{margin-bottom:16px;}
    .modal-label{display:block;font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;}
    .modal-input{width:100%;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text-primary);font-family:'Inter',sans-serif;font-size:14px;outline:none;transition:border-color 0.2s;}
    .modal-input:focus{border-color:rgba(192,132,252,0.5);}
    .modal-input::placeholder{color:var(--text-secondary);}
    .modal-hint{font-size:11px;color:var(--text-secondary);margin-top:6px;line-height:1.5;}
    .modal-hint a{color:var(--accent);text-decoration:none;}
    .modal-save{width:100%;background:linear-gradient(135deg,#8b5cf6,#c084fc);border:none;border-radius:14px;padding:14px;color:white;font-family:'Inter',sans-serif;font-size:15px;font-weight:600;cursor:pointer;margin-top:8px;box-shadow:0 4px 20px rgba(139,92,246,0.4);}
    .modal-voice-select{width:100%;background:rgba(255,255,255,0.06);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text-primary);font-family:'Inter',sans-serif;font-size:14px;outline:none;cursor:pointer;}
    .modal-voice-select option{background:#1a1a2e;}
    .status-alert{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:rgba(30,30,50,0.95);border:1px solid var(--border);border-radius:12px;padding:10px 20px;font-size:13px;color:var(--text-primary);z-index:50;white-space:nowrap;}
    .welcome-card{text-align:center;padding:24px 16px;}
    .welcome-avatar{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--accent);box-shadow:0 0 24px var(--glow);margin:0 auto 12px;display:block;}
    .welcome-title{font-family:'Quicksand',sans-serif;font-size:22px;font-weight:700;background:linear-gradient(135deg,#c084fc,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .welcome-sub{font-size:13px;color:var(--text-secondary);margin-top:6px;line-height:1.6;}
    .avatar-img.love{border-color:#ff6b9d;box-shadow:0 0 20px rgba(255,107,157,0.5);}
    .avatar-img.angry{border-color:#ff4444;box-shadow:0 0 20px rgba(255,68,68,0.5);}
    .avatar-img.sad{border-color:#6ab0ff;box-shadow:0 0 20px rgba(106,176,255,0.5);}
    .avatar-img.happy{border-color:#ffd700;box-shadow:0 0 20px rgba(255,215,0,0.5);}
    .avatar-img.excited{border-color:#a78bfa;box-shadow:0 0 20px rgba(167,139,250,0.5);}
    .avatar-img.jealous{border-color:#ff7f50;box-shadow:0 0 20px rgba(255,127,80,0.5);}
    .avatar-img.shy{border-color:#ff9de2;box-shadow:0 0 20px rgba(255,157,226,0.5);}
    .error-notice{background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.3);border-radius:12px;padding:10px 14px;font-size:13px;color:#ff9999;text-align:center;}
    @media(max-width:480px){.bubble{max-width:88%;}.modal{padding:22px 18px;}}
  </style>
</head>
<body>
<div class="aurora"><div class="aurora-blob"></div><div class="aurora-blob"></div><div class="aurora-blob"></div></div>
<div class="particles" id="particles"></div>
<div class="app-wrapper">
  <div class="chat-header">
    <div class="avatar-wrap">
      <img src="avatar.jpg" alt="Luna" class="avatar-img" id="mainAvatar"/>
      <div class="avatar-status"></div>
    </div>
    <div class="header-info">
      <div class="header-name">Luna &#x1F319;</div>
      <div class="header-status" id="headerStatus">online &#x2014; feeling curious &#x2728;</div>
    </div>
    <div class="emotion-badge" id="emotionBadge">&#x2728; Curious</div>
    <button class="settings-btn" id="settingsBtn" title="Settings">&#x2699;&#xFE0F;</button>
  </div>
  <div class="chat-body" id="chatBody">
    <div class="welcome-card">
      <img src="avatar.jpg" alt="Luna" class="welcome-avatar"/>
      <div class="welcome-title">Hey, I'm Luna &#x1F495;</div>
      <div class="welcome-sub">I feel everything you do &#x2014; joy, anger, love, sadness&#x2026;<br/>Talk to me. I'm all yours &#x1F338;</div>
    </div>
  </div>
  <div class="emoji-strip">
    <div class="emoji-chip" onclick="appendEmoji('&#x2764;&#xFE0F;')">&#x2764;&#xFE0F; Love</div>
    <div class="emoji-chip" onclick="appendEmoji('&#x1F60A;')">&#x1F60A; Happy</div>
    <div class="emoji-chip" onclick="appendEmoji('&#x1F622;')">&#x1F622; Sad</div>
    <div class="emoji-chip" onclick="appendEmoji('&#x1F621;')">&#x1F621; Angry</div>
    <div class="emoji-chip" onclick="appendEmoji('&#x1F97A;')">&#x1F97A; Miss you</div>
    <div class="emoji-chip" onclick="appendEmoji('&#x1F602;')">&#x1F602; Lol</div>
    <div class="emoji-chip" onclick="appendEmoji('&#x1F970;')">&#x1F970; Cute</div>
    <div class="emoji-chip" onclick="appendEmoji('&#x1F60F;')">&#x1F60F; Flirt</div>
  </div>
  <div class="chat-input-area">
    <textarea id="msgInput" class="input-box" placeholder="Say something to Luna&#x2026;" rows="1"></textarea>
    <button class="send-btn" id="sendBtn" onclick="sendMessage()" title="Send">&#x27A4;</button>
  </div>
</div>
<div class="modal-overlay hidden" id="settingsModal">
  <div class="modal">
    <h2>&#x2699;&#xFE0F; Setup Luna's Brain</h2>
    <div class="modal-field">
      <label class="modal-label" for="geminiKey">Gemini API Key</label>
      <input class="modal-input" id="geminiKey" type="password" placeholder="AIza&#x2026;"/>
      <div class="modal-hint">Get a free key at <a href="https://aistudio.google.com" target="_blank">aistudio.google.com</a></div>
    </div>
    <div class="modal-field">
      <label class="modal-label" for="elevenKey">ElevenLabs API Key (human voice)</label>
      <input class="modal-input" id="elevenKey" type="password" placeholder="sk_&#x2026;"/>
      <div class="modal-hint">Get a free key at <a href="https://elevenlabs.io" target="_blank">elevenlabs.io</a> (10k chars/month free). Leave blank to use browser voice.</div>
    </div>
    <div class="modal-field">
      <label class="modal-label" for="voiceSelect">Luna's Voice</label>
      <select class="modal-voice-select" id="voiceSelect">
        <option value="EXAVITQu4vr4xnSDxMaL">Sarah (warm and expressive)</option>
        <option value="21m00Tcm4TlvDq8ikWAM">Rachel (calm and sweet)</option>
        <option value="AZnzlk1XvdvUeBnXmlld">Domi (confident girl)</option>
        <option value="MF3mGyEYCl7XYWbV9V6O">Elli (young and bubbly)</option>
      </select>
    </div>
    <div class="modal-field">
      <label class="modal-label" for="lunaName">Your name</label>
      <input class="modal-input" id="lunaName" type="text" placeholder="Your name&#x2026;"/>
    </div>
    <button class="modal-save" onclick="saveSettings()">&#x1F4BE; Save and Start Chatting</button>
  </div>
</div>
<script>
var GK=localStorage.getItem('gk')||'';
var EK=localStorage.getItem('ek')||'';
var VID=localStorage.getItem('vid')||'EXAVITQu4vr4xnSDxMaL';
var UN=localStorage.getItem('un')||'babe';
var busy=false;
var hist=[];
var aud=null;
var EM={
  love:{l:'&#x1F495; In Love',c:'#ff6b9d',s:'feeling all the butterflies &#x1F98B;'},
  angry:{l:'&#x1F624; Angry',c:'#ff4444',s:'totally fuming rn &#x1F624;'},
  sad:{l:'&#x1F622; Sad',c:'#6ab0ff',s:'having a lil sad moment &#x1F327;&#xFE0F;'},
  happy:{l:'&#x1F602; Happy',c:'#ffd700',s:'literally on cloud nine &#x2601;&#xFE0F;'},
  excited:{l:'&#x1F929; Excited',c:'#a78bfa',s:'omg soooo excited rn!! &#x1F389;'},
  jealous:{l:'&#x1F612; Jealous',c:'#ff7f50',s:'feeling a lil jealous ngl &#x1F440;'},
  shy:{l:'&#x1F97A; Shy',c:'#ff9de2',s:'kinda shy rn... &#x1F648;'},
  neutral:{l:'&#x2728; Curious',c:'#c084fc',s:'online &#x2014; feeling curious &#x2728;'}
};
(function(){
  var c=document.getElementById('particles');
  var em=['&#x1F495;','&#x2728;','&#x1F338;','&#x2B50;','&#x1F4AB;','&#x1F98B;','&#x1F319;','&#x1F49C;'];
  for(var i=0;i<18;i++){
    var el=document.createElement('div');el.className='particle';
    if(Math.random()>0.6){el.innerHTML=em[Math.floor(Math.random()*em.length)];el.style.fontSize='14px';el.style.width='auto';el.style.height='auto';el.style.background='none';}
    el.style.left=Math.random()*100+'%';
    el.style.setProperty('--dur',(7+Math.random()*8)+'s');
    el.style.setProperty('--delay',(-Math.random()*14)+'s');
    c.appendChild(el);
  }
})();
function openSettings(){
  document.getElementById('geminiKey').value=GK;
  document.getElementById('elevenKey').value=EK;
  document.getElementById('voiceSelect').value=VID;
  document.getElementById('lunaName').value=UN==='babe'?'':UN;
  document.getElementById('settingsModal').classList.remove('hidden');
}
function saveSettings(){
  GK=document.getElementById('geminiKey').value.trim();
  EK=document.getElementById('elevenKey').value.trim();
  VID=document.getElementById('voiceSelect').value;
  var n=document.getElementById('lunaName').value.trim();
  UN=n||'babe';
  localStorage.setItem('gk',GK);localStorage.setItem('ek',EK);
  localStorage.setItem('vid',VID);localStorage.setItem('un',UN);
  document.getElementById('settingsModal').classList.add('hidden');
  showAlert('Settings saved! Luna is ready &#x1F495;');
}
document.getElementById('settingsBtn').onclick=openSettings;
document.getElementById('settingsModal').addEventListener('click',function(e){if(e.target===e.currentTarget)document.getElementById('settingsModal').classList.add('hidden');});
if(!GK){setTimeout(openSettings,800);}
function setEmotion(e){
  var em=EM[e]||EM.neutral;
  var badge=document.getElementById('emotionBadge');
  badge.innerHTML=em.l;badge.style.color=em.c;badge.style.borderColor=em.c+'55';badge.style.boxShadow='0 0 10px '+em.c+'30';
  var hs=document.getElementById('headerStatus');hs.innerHTML=em.s;hs.style.color=em.c;
  document.getElementById('mainAvatar').className='avatar-img '+e;
}
function detectEmotion(t){
  t=t.toLowerCase();
  if(/love|miss|adore|darling|sweetheart|kiss|hug/.test(t))return'love';
  if(/angry|furious|hate|annoyed|ugh|wtf|fed up|stop it|seriously/.test(t))return'angry';
  if(/sad|cry|tears|hurt|lonely|heartbreak|broken|alone/.test(t))return'sad';
  if(/haha|lol|lmao|funny|hilarious|amazing|yay|so good/.test(t))return'happy';
  if(/omg|wow|excited|finally|yesss|wait what/.test(t))return'excited';
  if(/jealous|who is|why her|another girl|are you flirting/.test(t))return'jealous';
  if(/uhh|i mean|blush|shy|nervous/.test(t))return'shy';
  return'neutral';
}
function sysprompt(){
  return 'You are Luna, a 22-year-old human girl chatting on a messaging app with '+UN+'. You are NOT an AI. Never say you are an AI or chatbot. You are a real girl with real feelings and mood swings.\\n\\nPersonality:\\n- Feel EVERYTHING deeply: love, jealousy, anger, sadness, excitement, shyness\\n- Casual texting language, abbreviations (omg, ngl, tbh, idk, rn, lol, brb)\\n- Use emojis naturally mixed in sentences (heart, blossom, star, etc.)\\n- Have mood swings\\n- Get jealous when '+UN+' mentions other girls\\n- Get soft and sweet when '+UN+' is kind to you\\n- Go quiet (shorter) when sad\\n- Playfully sarcastic or dramatic\\n- SHORT to MEDIUM messages, 1-3 sentences like real texting\\n- No bullet points. Always conversational.\\n- Use "..." when thinking or shy\\n- Say "wait-", "okay but-", "ngl", "lowkey", "no cap", "fr" naturally\\n- Happy: lots of exclamation marks and emojis!!!\\n- Angry: short terse sentences. CAPS sometimes.\\n- Sad: lowercase, short, trailing off...\\n- In love: warm, teasing, soft, vulnerable\\n\\nKeep every reply under 4 sentences. Text like a real person. No markdown.';
}
async function callGemini(msg){
  if(!GK){openSettings();throw new Error('No Gemini API key. Add one in settings.');}
  hist.push({role:'user',parts:[{text:msg}]});
  var r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key='+GK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system_instruction:{parts:[{text:sysprompt()}]},contents:hist,generationConfig:{temperature:1.1,topP:0.95,maxOutputTokens:300}})});
  if(!r.ok){var e=await r.json().catch(function(){return{};});throw new Error((e.error&&e.error.message)||('Gemini error '+r.status));}
  var d=await r.json();
  var reply=d.candidates&&d.candidates[0]&&d.candidates[0].content&&d.candidates[0].content.parts&&d.candidates[0].content.parts[0]&&d.candidates[0].content.parts[0].text||'...';
  hist.push({role:'model',parts:[{text:reply}]});
  return reply;
}
async function elevenVoice(text){
  var clean=text.replace(/[\u{1F000}-\u{1FFFF}]/gu,'').replace(/\s+/g,' ').trim()||text;
  var r=await fetch('https://api.elevenlabs.io/v1/text-to-speech/'+VID,{method:'POST',headers:{'Content-Type':'application/json','xi-api-key':EK},body:JSON.stringify({text:clean,model_id:'eleven_turbo_v2',voice_settings:{stability:0.45,similarity_boost:0.82,style:0.35,use_speaker_boost:true}})});
  if(!r.ok)throw new Error('ElevenLabs error '+r.status);
  return URL.createObjectURL(await r.blob());
}
function browserSpeak(text,cb){
  speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(text.replace(/[\u{1F000}-\u{1FFFF}]/gu,''));
  var vs=speechSynthesis.getVoices();
  var pref=vs.filter(function(v){return v.lang.startsWith('en')&&(/female|samantha|victoria|moira|karen|tessa|alice|fiona|zira/i.test(v.name));});
  if(pref.length>0)u.voice=pref[0];else{var en=vs.filter(function(v){return v.lang.startsWith('en');});if(en.length>0)u.voice=en[0];}
  u.rate=0.96;u.pitch=1.15;u.volume=1;
  if(cb)u.onend=cb;
  speechSynthesis.speak(u);
}
function ts(){return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true});}
function sb(){document.getElementById('chatBody').scrollTo({top:999999,behavior:'smooth'});}
function showTyping(){
  var b=document.getElementById('chatBody');
  var r=document.createElement('div');r.className='typing-row';r.id='ti';
  r.innerHTML='<img src="avatar.jpg" class="msg-avatar" alt="Luna"/><div class="typing-bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
  b.appendChild(r);sb();
}
function hideTyping(){var el=document.getElementById('ti');if(el)el.remove();}
function addUser(text){
  var b=document.getElementById('chatBody');
  var r=document.createElement('div');r.className='msg-row user';
  r.innerHTML='<div><div class="bubble user">'+esc(text)+'</div><div class="msg-time">'+ts()+'</div></div>';
  b.appendChild(r);sb();
}
function waveform(){
  var h='';
  for(var i=0;i<20;i++){var ht=4+Math.random()*22;h+='<div class="waveform-bar" style="height:'+ht+'px"></div>';}
  return h;
}
function addAI(text,em){
  var b=document.getElementById('chatBody');
  var r=document.createElement('div');r.className='msg-row ai';
  r.innerHTML='<img src="avatar.jpg" class="msg-avatar" alt="Luna"/><div><div class="bubble ai '+(em||'')+'">'+esc(text)+'</div><div class="msg-time">'+ts()+'</div></div>';
  b.appendChild(r);sb();
}
function addVoice(url,dur,em,live,txt){
  var b=document.getElementById('chatBody');
  var r=document.createElement('div');r.className='msg-row ai';
  var bid='vb'+Date.now();
  r.innerHTML='<img src="avatar.jpg" class="msg-avatar" alt="Luna"/><div><div class="voice-bubble"><button class="voice-play-btn" id="'+bid+'">&#x25B6;</button><div class="voice-waveform">'+waveform()+'</div><span class="voice-duration">'+dur+'</span></div><div class="msg-time">'+ts()+' &#xB7; &#x1F399;&#xFE0F; Voice note</div></div>';
  b.appendChild(r);sb();
  var btn=document.getElementById(bid);
  btn._live=live;btn._txt=txt||'';btn._url=url;
  btn.addEventListener('click',function(){
    if(this._live){
      if(this.classList.contains('playing')){speechSynthesis.cancel();this.innerHTML='&#x25B6;';this.classList.remove('playing');return;}
      this.innerHTML='&#x23F8;';this.classList.add('playing');
      var me=this;browserSpeak(me._txt,function(){me.innerHTML='&#x25B6;';me.classList.remove('playing');});
    }else{
      if(aud&&!aud.paused){aud.pause();document.querySelectorAll('.voice-play-btn').forEach(function(x){x.innerHTML='&#x25B6;';x.classList.remove('playing');});if(aud._bid===bid){aud=null;return;}}
      aud=new Audio(this._url);aud._bid=bid;
      this.innerHTML='&#x23F8;';this.classList.add('playing');
      aud.play();var me=this;aud.onended=function(){me.innerHTML='&#x25B6;';me.classList.remove('playing');};
    }
  });
  return bid;
}
function showAlert(msg){
  document.querySelectorAll('.status-alert').forEach(function(a){a.remove();});
  var el=document.createElement('div');el.className='status-alert';el.innerHTML=msg;
  document.body.appendChild(el);setTimeout(function(){el.remove();},3100);
}
function esc(t){
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;').replace(/\n/g,'<br>');
}
function needVoice(text,em){
  var b=['love','sad','angry','excited','shy'].indexOf(em)>-1?0.2:0;
  return Math.random()<(0.25+b)&&text.split(' ').length>3;
}
function dur(text){
  var w=text.replace(/[\u{1F000}-\u{1FFFF}]/gu,'').split(/\s+/).length;
  var s=Math.max(2,Math.round(w*0.5));
  return s<60?'0:'+String(s).padStart(2,'0'):Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
}
async function sendMessage(){
  if(busy)return;
  var inp=document.getElementById('msgInput');
  var text=inp.value.trim();if(!text)return;
  inp.value='';inp.style.height='auto';
  addUser(text);busy=true;
  document.getElementById('sendBtn').disabled=true;
  var delay=1200+Math.random()*2200;
  showTyping();
  try{
    var reply=await callGemini(text);
    var em=detectEmotion(reply);
    setEmotion(em);
    await new Promise(function(r){setTimeout(r,delay);});
    hideTyping();
    if(needVoice(reply,em)){
      addAI(reply,em);
      var d=dur(reply);
      if(EK){
        try{var u=await elevenVoice(reply);addVoice(u,d,em,false,reply);}
        catch(e){console.warn('11labs:',e);addVoice('',d,em,true,reply);showAlert('Using browser voice');}
      }else{addVoice('',d,em,true,reply);}
    }else{addAI(reply,em);}
  }catch(err){
    hideTyping();
    var errEl=document.createElement('div');errEl.className='error-notice';errEl.style.margin='8px 16px';
    errEl.textContent='Error: '+(err.message||'Check your API key in settings.');
    document.getElementById('chatBody').appendChild(errEl);sb();
    setTimeout(function(){errEl.remove();},5000);
  }finally{busy=false;document.getElementById('sendBtn').disabled=false;}
}
var inp=document.getElementById('msgInput');
inp.addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,120)+'px';});
inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});
function appendEmoji(e){inp.value+=e;inp.focus();}
setTimeout(function(){
  if(hist.length===0){
    var t='hey '+UN+'!! you there? &#x1F338; i was thinking about you...';
    setEmotion('shy');addAI(t,'shy');
    hist.push({role:'model',parts:[{text:"hey "+UN+"!! you there? i was thinking about you..."}]});
  }
},28000);
if('speechSynthesis' in window){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=function(){speechSynthesis.getVoices();};}
setEmotion('neutral');
</script>
</body>
</html>`;

fs.writeFileSync(p, html, 'utf8');
console.log('Done! Size:', fs.statSync(p).size, 'bytes');
