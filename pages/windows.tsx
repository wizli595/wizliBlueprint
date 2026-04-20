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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <main className="win-page">
        {/* Full-screen overlay while the 3D scene boots */}
        <div id="pageOverlay" className="win-overlay">
          <div className="win-overlay-inner">
            <div className="win-overlay-title">Loading...</div>
            <div className="win-overlay-bar">
              <div id="overlayFill" className="win-overlay-fill" />
            </div>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          tabIndex={-1}
          className="win-back-btn"
          aria-label="Back to environment selector"
        >
          &#8592; Back
        </button>

        {/* Mobile hint — touch devices can't use keyboard */}
        <div className="win-mobile-hint">
          Rotate device for best experience. Use keyboard to interact.
        </div>

        <canvas id="Canvas3D" className="win-canvas"></canvas>

        <audio id="ComputerBoot" src="/Sounds/ComputerBoot.mp3"></audio>
        <audio id="ComputerAmbient" src="/Sounds/ComputerAmbient.mp3"></audio>
        <audio id="ComputerBeep" src="/Sounds/ComputerBeep.mp3"></audio>
        <audio id="KeyboardPressed" src="/Sounds/KeyboardPressed.mp3"></audio>

        {/* DOM shims for Main.js */}
        <div id="_dom-shims" aria-hidden="true" style={{position:'absolute',left:-9999,top:-9999,width:1,height:1,overflow:'hidden'}}>
          <div id="MouseGlow" style={{width:8,height:8,borderRadius:4,background:'rgba(255,200,80,0.6)'}} />
          <div id="RightPanel" style={{height:200,overflow:'auto'}}>
            <div className="Section" id="sec0" style={{height:100}}>Section 0</div>
          </div>
          <div className="NavItem" data-section="sec0">Nav 0</div>
          <div className="Project"><p data-value="demo">demo</p></div>
        </div>

        <Script src="/Scripts/ModelFiles.js" strategy="beforeInteractive" />
        <Script src="/Scripts/RenderingFunctions.js" strategy="beforeInteractive" />
        <Script src="/Scripts/TerminalFunction.js" strategy="beforeInteractive" />
        <Script id="gettext-shim" strategy="beforeInteractive">{`(function(){
          if(typeof window.GetText !== 'function'){
            window.GetText = function(){ return ""; };
          }
        })();`}</Script>
        <Script src="/Scripts/Main.js" strategy="afterInteractive" />

        <Script id="overlay-poller" strategy="afterInteractive">
          {`(function(){
            var canvas = document.getElementById('Canvas3D');
            var overlay = document.getElementById('pageOverlay');
            var fill = document.getElementById('overlayFill');

            if (canvas && !canvas.getContext('webgl2')) {
              if (overlay) {
                overlay.innerHTML = '<div style="text-align:center;font-family:VT323,monospace;padding:20px">'
                  + '<div style="font-size:28px;margin-bottom:12px;color:#ff6b6b">WebGL2 Not Supported</div>'
                  + '<div style="font-size:16px;color:#999">Your browser does not support WebGL2.<br>Try Chrome, Firefox, or Edge.</div>'
                  + '<a href="/" style="display:inline-block;margin-top:20px;color:#ffd66b;font-size:18px">\\u2190 Back to Home</a>'
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
