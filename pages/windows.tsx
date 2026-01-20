import Head from 'next/head'
import Script from 'next/script'

export default function WindowsPage() {
  return (
    <>
      <Head>
        <title>wizli — Windows (Canvas)</title>
        <link rel="stylesheet" href="/styles/luckey.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" />
      </Head>

      <main style={{height:'100vh',margin:0,background:'#000',position:'relative',overflow:'hidden'}}>
        {/* Full-screen dark overlay while the external loader runs */}
        <div id="pageOverlay" style={{position:'fixed',inset:0,background:'#000',zIndex:9999,display:'grid',placeItems:'center',color:'#ffd66b'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:'VT323, monospace',fontSize:28}}>Loading...</div>
            <div style={{height:12,width:320,background:'#081018',borderRadius:8,overflow:'hidden',marginTop:12}}>
              <div id="overlayFill" style={{height:'100%',width:'0%',background:'linear-gradient(90deg,#ffd66b,#ff8a00)'}} />
            </div>
          </div>
        </div>

        <canvas id="Canvas3D" style={{display:'block',width:'100%',height:'100%'}}></canvas>

        <audio id="ComputerBoot" src="/Sounds/ComputerBoot.mp3"></audio>
        <audio id="ComputerAmbient" src="/Sounds/ComputerAmbient.mp3"></audio>
        <audio id="ComputerBeep" src="/Sounds/ComputerBeep.mp3"></audio>
        <audio id="KeyboardPressed" src="/Sounds/KeyboardPressed.mp3"></audio>

        {/* Load external scripts in order */}
        
        {/* Minimal hidden DOM shims required by the original Main.js to avoid null refs */}
        <div id="_dom-shims" aria-hidden="true" style={{position:'absolute',left:-9999,top:-9999,width:1,height:1,overflow:'hidden'}}>
          <div id="MouseGlow" style={{width:8,height:8,borderRadius:4,background:'rgba(255,200,80,0.6)'}} />

          <div id="RightPanel" style={{height:200,overflow:'auto'}}>
            <div className="Section" id="sec0" style={{height:100}}>Section 0</div>
          </div>
          <div className="NavItem" data-section="sec0">Nav 0</div>

          {/* one dummy project to keep Projects NodeList non-empty if code queries it */}
          <div className="Project"><p data-value="demo">demo</p></div>
        </div>

        <Script src="/Scripts/ModelFiles.js" strategy="beforeInteractive" />
        <Script src="/Scripts/RenderingFunctions.js" strategy="beforeInteractive" />
        <Script src="/Scripts/TerminalFunction.js" strategy="beforeInteractive" />
        {/* Ensure GetText exists to avoid runtime ReferenceError in Main.js */}
        <Script id="gettext-shim" strategy="beforeInteractive">{`(function(){
          if(typeof window.GetText !== 'function'){
            window.GetText = function(){ return ""; };
          }
        })();`}</Script>
        <Script src="/Scripts/Main.js" strategy="afterInteractive" />

        {/* Poll for the external Time variable and dismiss overlay when boot completes */}
        <Script id="overlay-poller" strategy="afterInteractive">
          {`(function(){
            // animate overlay fill while waiting
            var fill = document.getElementById('overlayFill');
            var overlay = document.getElementById('pageOverlay');
            var start = Date.now();
            var tId = setInterval(function(){
              var elapsed = (Date.now()-start)/1000;
              // progress up to 100% over 4.2s as a fallback
              var p = Math.min(100, (elapsed/4.2)*100);
              if(fill) fill.style.width = p + '%';
              // if external script exposes Time, wait until >=4.0
              if(window.Time !== undefined) {
                if(window.Time >= 4.0) {
                  clearInterval(tId);
                  if(overlay) overlay.remove();
                }
              } else {
                // fallback: remove after 4.5s
                if(elapsed > 4.5) { clearInterval(tId); if(overlay) overlay.remove(); }
              }
            },100);
          })();`}
        </Script>
      </main>
    </>
  )
}
