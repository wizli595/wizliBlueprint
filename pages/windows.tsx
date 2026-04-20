import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'

export default function WindowsPage() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>wizli — Windows (Canvas)</title>
        <link rel="stylesheet" href="/styles/luckey.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" />
      </Head>

      <main style={{height:'100dvh',margin:0,background:'#000',position:'relative',overflow:'hidden'}}>
        {/* Full-screen overlay while the 3D scene boots */}
        <div id="pageOverlay" style={{
          position:'fixed',inset:0,background:'#000',zIndex:9999,
          display:'grid',placeItems:'center',color:'#ffd66b',
          transition:'opacity 0.6s ease',opacity:1
        }}>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:'VT323, monospace',fontSize:28}}>Loading...</div>
            <div style={{height:4,width:320,background:'rgba(255,255,255,0.06)',borderRadius:2,overflow:'hidden',marginTop:12}}>
              <div id="overlayFill" style={{height:'100%',width:'0%',background:'linear-gradient(90deg,#ffd66b,#ff8a00)',borderRadius:2,transition:'width 100ms linear'}} />
            </div>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          tabIndex={-1}
          style={{
            position:'fixed',top:16,left:16,zIndex:10000,
            background:'rgba(0,0,0,0.6)',border:'1px solid rgba(255,255,255,0.15)',
            color:'#ffd66b',fontFamily:'VT323, monospace',fontSize:16,
            padding:'6px 14px',borderRadius:6,cursor:'pointer',
            backdropFilter:'blur(8px)',transition:'opacity 0.3s',
          }}
          aria-label="Back to environment selector"
        >
          ← Back
        </button>

        <canvas id="Canvas3D" style={{display:'block',width:'100%',height:'100%'}}></canvas>

        <audio id="ComputerBoot" src="/Sounds/ComputerBoot.mp3"></audio>
        <audio id="ComputerAmbient" src="/Sounds/ComputerAmbient.mp3"></audio>
        <audio id="ComputerBeep" src="/Sounds/ComputerBeep.mp3"></audio>
        <audio id="KeyboardPressed" src="/Sounds/KeyboardPressed.mp3"></audio>

        {/* Minimal hidden DOM shims required by Main.js to avoid null refs */}
        <div id="_dom-shims" aria-hidden="true" style={{position:'absolute',left:-9999,top:-9999,width:1,height:1,overflow:'hidden'}}>
          <div id="MouseGlow" style={{width:8,height:8,borderRadius:4,background:'rgba(255,200,80,0.6)'}} />
          <div id="RightPanel" style={{height:200,overflow:'auto'}}>
            <div className="Section" id="sec0" style={{height:100}}>Section 0</div>
          </div>
          <div className="NavItem" data-section="sec0">Nav 0</div>
          <div className="Project"><p data-value="demo">demo</p></div>
        </div>

        {/* Load dependency scripts first, then Main.js */}
        <Script src="/Scripts/ModelFiles.js" strategy="beforeInteractive" />
        <Script src="/Scripts/RenderingFunctions.js" strategy="beforeInteractive" />
        <Script src="/Scripts/TerminalFunction.js" strategy="beforeInteractive" />
        <Script id="gettext-shim" strategy="beforeInteractive">{`(function(){
          if(typeof window.GetText !== 'function'){
            window.GetText = function(){ return ""; };
          }
        })();`}</Script>
        <Script src="/Scripts/Main.js" strategy="afterInteractive" />

        {/* WebGL2 check + overlay fade-out when boot completes */}
        <Script id="overlay-poller" strategy="afterInteractive">
          {`(function(){
            var canvas = document.getElementById('Canvas3D');
            var overlay = document.getElementById('pageOverlay');
            var fill = document.getElementById('overlayFill');

            // Check WebGL2 support
            if (canvas && !canvas.getContext('webgl2')) {
              if (overlay) {
                overlay.innerHTML = '<div style="text-align:center;font-family:VT323,monospace;color:#ff6b6b">'
                  + '<div style="font-size:28px;margin-bottom:12px">WebGL2 Not Supported</div>'
                  + '<div style="font-size:16px;color:#999">Your browser does not support WebGL2.<br>Try Chrome, Firefox, or Edge.</div>'
                  + '<a href="/" style="display:inline-block;margin-top:20px;color:#ffd66b;font-size:18px">← Back to Home</a>'
                  + '</div>';
              }
              return;
            }

            var start = Date.now();
            var tId = setInterval(function(){
              var elapsed = (Date.now() - start) / 1000;
              var p = Math.min(100, (elapsed / 4.2) * 100);
              if (fill) fill.style.width = p + '%';

              var ready = false;
              if (window.Time !== undefined) {
                ready = window.Time >= 4.0;
              } else {
                ready = elapsed > 4.5;
              }

              if (ready) {
                clearInterval(tId);
                if (overlay) {
                  overlay.style.opacity = '0';
                  setTimeout(function(){ overlay.remove(); }, 600);
                }
              }
            }, 100);
          })();`}
        </Script>
      </main>
    </>
  )
}
