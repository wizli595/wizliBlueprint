import React, { useEffect, useRef, useState } from 'react'
import { Frame, Window, WindowContent, WindowHeader, Button, TextField } from 'react95'

const initialOutputs = `\n`;

const FileSystem = {
  root: {
    type: 'directory',
    contents: {
      projects: { type: 'directory', contents: { 'projects.txt': { type: 'file', content: 'Projects list' } } },
      'about.txt': { type: 'file', content: 'About content' },
      'experience.txt': { type: 'file', content: 'Experience content' },
      'plasma.exe': { type: 'executable', content: 'plasma' },
    },
  },
};

export default function WindowsTerminal() {
  const [outputs, setOutputs] = useState(initialOutputs)
  const [inputText, setInputText] = useState('')
  const [displayPlasma, setDisplayPlasma] = useState(false)
  const [directory, setDirectory] = useState('C:/Users/guest')
  const [time, setTime] = useState(0)
  const inputRef = useRef(null)

  const bootAudio = useRef(typeof Audio !== 'undefined' ? new Audio('/Sounds/ComputerBoot.mp3') : null)
  const beepAudio = useRef(typeof Audio !== 'undefined' ? new Audio('/Sounds/ComputerBeep.mp3') : null)
  const keyAudio = useRef(typeof Audio !== 'undefined' ? new Audio('/Sounds/KeyboardPressed.mp3') : null)

  useEffect(() => {
    const start = Date.now()
    bootAudio.current?.play().catch(() => {})
    const id = setInterval(() => setTime((Date.now() - start) / 1000), 80)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (time < 5 || outputs.split('\n').length < 10) {
      let out = ''
      const LoadingChars = ['-', '\\', '|', '/']
      if (time > 0.1) out += ' █████╗██╗ ██╗ ████╗ █████╗ ██╗    ██╗██████╗    ████╗ \n'
      if (time > 0.2) out += '██╔═══╝██║ ██║██╔═██╗██╔═██╗██║    ██║██╔═══╝   ██╔═██╗\n'
      if (time > 0.3) out += '██║    ██████║██████║█████╔╝██║    ██║█████╗    ██████║\n'
      if (time > 0.4) out += '██║    ██╔═██║██╔═██║██╔═██╗██║    ██║██╔══╝    ██╔═██║\n'
      if (time > 0.5) out += '╚█████╗██║ ██║██║ ██║██║ ██║██████╗██║██████╗██╗██║ ██║\n'
      if (time > 0.6) out += ' ╚════╝╚═╝ ╚═╝╚═╝ ╚═╝╚═╝ ╚═╝╚═════╝╚═╝╚═════╝╚═╝╚═╝ ╚═╝\n\n\n'
      if (time > 1.1) out += 'Welcome to WIZLI-OS 2.9.0 x86_64\n'
      if (time > 1.2) out += "Type 'help' to list available commands\n\n\n"
      if (time > 1.7) out += `Loading ${LoadingChars[Math.ceil((Math.min(3.7, time) % 0.4) / 0.1) - 1]} ${Math.ceil(Math.min(100, (time - 1.7) / 0.02))}%\n`
      if (time > 3.7) out += '.\n'
      if (time > 3.8) out += '.\n'
      if (time > 3.9) out += '.\n'
      if (time > 4.0) out += 'Complete!\n\n'
      setOutputs(out)
    }
  }, [time])

  const playKey = () => { try { keyAudio.current?.play().catch(()=>{}) } catch {} }
  const playBeep = () => { try { beepAudio.current?.play().catch(()=>{}) } catch {} }

  const executeCommand = () => {
    if (!inputText.trim()) return
    playBeep()
    let out = outputs + `${directory}> ${inputText}\n`
    const parts = inputText.split(' ')
    const cmd = parts[0]
    const args = parts.slice(1)

    switch (cmd) {
      case 'ls':
        try {
          let dir = FileSystem.root.contents
          for (let p of directory.slice(15).split('/').filter(Boolean)) { dir = dir[p].contents }
          const files = Object.keys(dir)
          out += files.map((f,i)=> `${i===files.length-1? '┗':'┣'}${f}`).join('\n') + '\n\n'

        } catch { out += '\n' }
        break
      case 'cd':
        if (args.length>1) out += "Error: 'cd' doesn't accept more that one argument\n\n"
        else {
          const target = args[0]
          if (target === '..') {
            const cur = directory.slice(15).split('/').filter(Boolean); cur.pop();
            setDirectory(`C:/Users/guest${cur.length?'/'+cur.join('/') : ''}`)
          } else if (target === '/') { setDirectory('C:/Users/guest') }
          else {
            try {
              let curdir = FileSystem.root.contents
              for (let p of directory.slice(15).split('/').filter(Boolean)) curdir = curdir[p].contents
              if (curdir && curdir[target] && curdir[target].type === 'directory') { setDirectory(d => d + '/' + target) }
              else { out += `cd: '${target}' No such directory\n\n` }
            } catch { out += `cd: '${target}' No such directory\n\n` }
          }
        }
        break
      case 'start':
        if (args.length>1) out += "Error: 'start' doesn't accept more that one argument\n\n"
        else {
          const f = args[0]
          try {
            let curdir = FileSystem.root.contents
            for (let p of directory.slice(15).split('/').filter(Boolean)) curdir = curdir[p].contents
            if (curdir && curdir[f]) {
              if (curdir[f].type === 'file') out += `\n${curdir[f].content}\n\n`
              else if (curdir[f].type === 'link') { out += `\nRedirecting to '${curdir[f].content}'\n\n`; window.open(curdir[f].content) }
              else if (curdir[f].type === 'executable') { out += `\n'${f}' Started successfully\n\n`; setDisplayPlasma(true) }
            } else out += `start: '${f}' No such file\n\n`
          } catch { out += `start: '${f}' No such file\n\n` }
        }
        break
      case 'clear':
        out = ''
        break
      case 'help':
        out += "\nPress 'tab' for auto complete and press 'esc' to exit a program (.exe file)\n\nLS       Lists current directory contents\nCD       Change directory, '..' moves back, '/' to root\nSTART    Opens specified file in current directory\nCLEAR    Clears all previous terminal outputs\n\n"
        break
      default:
        out += `\nCommand not found '${cmd}'\n\n`
    }

    setOutputs(out)
    setInputText('')
    setTimeout(()=> inputRef.current?.focus(),20)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { executeCommand(); e.preventDefault(); }
    else if (e.key === 'Backspace') { playKey() }
    else if (e.key.length === 1) { playKey() }
  }

  return (
    <div style={{display:'grid', placeItems:'center', padding:20, height:'100vh', background:'linear-gradient(180deg,#0f2b48,#071428)'}}>
      <canvas id="Canvas3D" style={{position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0}}></canvas>
      <Frame style={{width:780, zIndex:10}}>
        <Window>
          <WindowHeader>
            <span style={{fontWeight:700}}>C:\\ Windows Terminal</span>
          </WindowHeader>
          <WindowContent style={{height:460, padding:12, background:'#000', color:'#0f0', fontFamily:'VT323, Consolas, monospace', fontSize:13, overflow:'auto'}}>
            <div style={{whiteSpace:'pre-wrap'}}>
              {displayPlasma ? <pre style={{color:'#8ff'}}>{'/* plasma demo */'}</pre> : (
                <div>
                  {outputs.split('\n').map((l,i)=> <div key={i}>{l}</div>)}
                  <div style={{display:'flex', gap:8, marginTop:8}}>
                    <div style={{color:'#0f0', fontWeight:700}}>{directory}&gt;&nbsp;</div>
                    <div style={{flex:1}}>
                      <input ref={inputRef} value={inputText} onChange={e=>setInputText(e.target.value)} onKeyDown={onKeyDown} style={{background:'transparent',border:'none',color:'#0f0',outline:'none',width:'100%'}} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </WindowContent>
          <div style={{display:'flex', gap:8, padding:12, alignItems:'center', background:'#eee'}}>
            <div style={{flex:1}}>
              <TextField fullWidth value={inputText} onChange={(v)=>setInputText(v.target.value)} onKeyDown={onKeyDown} style={{display:'none'}} />
            </div>
            <Button onClick={()=>executeCommand()}>Run</Button>
            <Button onClick={()=>{ setOutputs(''); setInputText('') }}>CLS</Button>
          </div>
        </Window>
      </Frame>

      <audio id="ComputerBoot" src="/Sounds/ComputerBoot.mp3" />
      <audio id="ComputerAmbient" src="/Sounds/ComputerAmbient.mp3" />
      <audio id="ComputerBeep" src="/Sounds/ComputerBeep.mp3" />
      <audio id="KeyboardPressed" src="/Sounds/KeyboardPressed.mp3" />
    </div>
  )
}
