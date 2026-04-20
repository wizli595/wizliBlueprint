import React, { useEffect, useRef, useState } from 'react'
import { Frame, Window, WindowContent, WindowHeader, Button } from 'react95'

const ROOT_DIR = 'C:/Users/guest'

const FileSystem = {
  root: {
    type: 'directory',
    contents: {
      projects: {
        type: 'directory',
        contents: {
          'projects.txt': { type: 'file', content: 'Projects:\n  1. CI/CD and DevOps automation pipelines\n  2. Jenkins automation\n  3. Personal terminal portfolio site\n  4. Tremolo guitar pedal with TL072 and JFET\n  5. Virtualization & server management projects' },
          'lighting_engine.lnk': { type: 'link', content: 'https://github.com/wizli595' },
          'personal_website.lnk': { type: 'link', content: '/' },
        },
      },
      'about.txt': { type: 'file', content: "I'm abdessalam ouazri — an IT professional passionate about\nautomation, efficient systems, and technology that makes sense.\nI enjoy building things that are both elegant and functional." },
      'experience.txt': { type: 'file', content: 'Core skills:\n  CI/CD, DevOps, Linux, Windows Server\n  Virtualization, Bare metal servers\n  Docker, Jenkins, GitLab, Kubernetes' },
      'plasma.exe': { type: 'executable', content: 'plasma' },
    },
  },
}

const playSound = (src) => {
  try {
    const s = new Audio(src)
    s.volume = 0.5
    s.play().catch(() => {})
  } catch {}
}

function resolveDir(path) {
  const relative = path.slice(ROOT_DIR.length).replace(/^\//, '')
  let dir = FileSystem.root.contents
  if (!relative) return dir
  for (const p of relative.split('/').filter(Boolean)) {
    if (!dir[p] || dir[p].type !== 'directory') return null
    dir = dir[p].contents
  }
  return dir
}

export default function WindowsTerminal() {
  const [lines, setLines] = useState([])
  const [inputText, setInputText] = useState('')
  const [displayPlasma, setDisplayPlasma] = useState(false)
  const [directory, setDirectory] = useState(ROOT_DIR)
  const [booted, setBooted] = useState(false)
  const [bootProgress, setBootProgress] = useState(0)
  const inputRef = useRef(null)
  const contentRef = useRef(null)

  // Boot sequence
  useEffect(() => {
    playSound('/Sounds/ComputerBoot.mp3')
    const duration = 3200
    const tick = 60
    const inc = Math.ceil(100 / (duration / tick))
    let mounted = true

    const interval = setInterval(() => {
      setBootProgress(p => {
        const next = Math.min(100, p + inc)
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            if (!mounted) return
            playSound('/Sounds/ComputerBeep.mp3')
            setBooted(true)
            setLines([
              { id: 0, text: 'Welcome to WIZLI-OS 2.9.0 x86_64' },
              { id: 1, text: "Type 'help' to list available commands" },
              { id: 2, text: '' },
            ])
          }, 300)
        }
        return next
      })
    }, tick)

    return () => { mounted = false; clearInterval(interval) }
  }, [])

  // Auto-scroll and focus
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = contentRef.current.scrollHeight
    if (booted) setTimeout(() => inputRef.current?.focus(), 20)
  }, [lines, booted])

  const addLine = (text) => {
    setLines(prev => [...prev, { id: prev.length, text }])
  }

  const executeCommand = () => {
    const raw = inputText.trim()
    if (!raw) return
    playSound('/Sounds/ComputerBeep.mp3')

    addLine(`${directory}> ${raw}`)

    const parts = raw.split(' ')
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1).filter(Boolean)

    switch (cmd) {
      case 'ls': {
        const dir = resolveDir(directory)
        if (!dir) { addLine('Error: cannot read directory'); break }
        const files = Object.keys(dir)
        files.forEach((f, i) => {
          const prefix = i === files.length - 1 ? '└─' : '├─'
          addLine(`${prefix} ${f}`)
        })
        addLine('')
        break
      }
      case 'cd': {
        if (args.length > 1) {
          addLine("Error: 'cd' accepts only one argument")
          break
        }
        if (args.length === 0 || args[0] === '/' || args[0] === '~') {
          setDirectory(ROOT_DIR)
        } else if (args[0] === '..') {
          setDirectory(prev => {
            const parts = prev.split('/')
            if (parts.length <= 3) return ROOT_DIR // Don't go above C:/Users/guest
            parts.pop()
            return parts.join('/')
          })
        } else {
          const target = args[0]
          const dir = resolveDir(directory)
          if (dir && dir[target] && dir[target].type === 'directory') {
            setDirectory(prev => prev + '/' + target)
          } else {
            addLine(`cd: '${target}' No such directory`)
          }
        }
        addLine('')
        break
      }
      case 'start': {
        if (args.length === 0) {
          addLine("Error: 'start' requires a filename argument")
          addLine("Usage: start <filename>")
          addLine('')
          break
        }
        if (args.length > 1) {
          addLine("Error: 'start' accepts only one argument")
          break
        }
        const f = args[0]
        const dir = resolveDir(directory)
        if (!dir || !dir[f]) {
          addLine(`start: '${f}' No such file`)
          addLine('')
          break
        }
        const entry = dir[f]
        if (entry.type === 'file') {
          addLine('')
          entry.content.split('\n').forEach(l => addLine(l))
          addLine('')
        } else if (entry.type === 'link') {
          addLine(`Redirecting to '${entry.content}'...`)
          addLine('')
          window.open(entry.content)
        } else if (entry.type === 'executable') {
          addLine(`'${f}' Started successfully`)
          addLine('Press ESC to exit')
          addLine('')
          setDisplayPlasma(true)
        }
        break
      }
      case 'clear':
        setLines([])
        break
      case 'help':
        addLine('')
        addLine("Press 'tab' for auto complete, 'esc' to exit programs")
        addLine('')
        addLine('LS       List current directory contents')
        addLine('CD       Change directory (.., /, folder)')
        addLine('START    Open a file in current directory')
        addLine('CLEAR    Clear terminal output')
        addLine('HELP     Show this message')
        addLine('')
        break
      default:
        addLine(`Command not found: '${cmd}'`)
        addLine('')
    }

    setInputText('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand()
      e.preventDefault()
    } else if (e.key === 'Escape' && displayPlasma) {
      setDisplayPlasma(false)
      addLine('Program exited.')
      addLine('')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Tab completion for commands
      const cmds = ['ls', 'cd', 'start', 'clear', 'help']
      const trimmed = inputText.trim().toLowerCase()
      if (trimmed) {
        const matches = cmds.filter(c => c.startsWith(trimmed))
        if (matches.length === 1) setInputText(matches[0])
      }
    } else if (e.key.length === 1 || e.key === 'Backspace') {
      playSound('/Sounds/KeyboardPressed.mp3')
    }
  }

  const asciiArt = ` █████╗██╗ ██╗ ████╗ █████╗ ██╗    ██╗██████╗    ████╗
██╔═══╝██║ ██║██╔═██╗██╔═██╗██║    ██║██╔═══╝   ██╔═██╗
██║    ██████║██████║█████╔╝██║    ██║█████╗    ██████║
██║    ██╔═██║██╔═██║██╔═██╗██║    ██║██╔══╝    ██╔═██║
╚█████╗██║ ██║██║ ██║██║ ██║██████╗██║██████╗██╗██║ ██║
 ╚════╝╚═╝ ╚═╝╚═╝ ╚═╝╚═╝ ╚═╝╚═════╝╚═╝╚═════╝╚═╝╚═╝ ╚═╝`

  return (
    <div style={{display:'grid', placeItems:'center', padding:20, height:'100vh', height:'100dvh', background:'linear-gradient(180deg,#0f2b48,#071428)'}}>
      <Frame style={{width:780, maxWidth:'95vw', zIndex:10}}>
        <Window>
          <WindowHeader>
            <span style={{fontWeight:700}}>C:\ WIZLI-OS Terminal</span>
          </WindowHeader>
          <WindowContent
            ref={contentRef}
            style={{
              height:460, maxHeight:'70vh', padding:12,
              background:'#000', color:'#0f0',
              fontFamily:'VT323, Consolas, monospace', fontSize:14,
              overflow:'auto',
              msOverflowStyle:'none', scrollbarWidth:'none',
            }}
          >
            <style>{`.win-term-content::-webkit-scrollbar{display:none}`}</style>
            <div className="win-term-content" style={{whiteSpace:'pre-wrap'}}>
              {!booted ? (
                <div style={{textAlign:'center',paddingTop:60}}>
                  <pre style={{color:'#ffd66b',fontSize:12,lineHeight:1.15}}>{asciiArt}</pre>
                  <div style={{color:'#0f0',marginTop:16}}>Booting WIZLI-OS... {bootProgress}%</div>
                  <div style={{width:200,height:3,background:'rgba(255,255,255,0.06)',borderRadius:2,margin:'8px auto 0',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${bootProgress}%`,background:'linear-gradient(90deg,#ffd66b,#ff8a00)',borderRadius:2,transition:'width 60ms linear'}} />
                  </div>
                </div>
              ) : displayPlasma ? (
                <pre style={{color:'#8ff',textAlign:'center',paddingTop:40}}>
{`  ░▒▓█ PLASMA SCREENSAVER █▓▒░

    ╔═══════════════════╗
    ║  ░░▓▓▓▓▓▓▓▓▓░░  ║
    ║  ▒▒▓▓████▓▓▒▒  ║
    ║  ▓▓████████▓▓  ║
    ║  ▒▒▓▓████▓▓▒▒  ║
    ║  ░░▓▓▓▓▓▓▓▓▓░░  ║
    ╚═══════════════════╝

  Press ESC to exit`}
                </pre>
              ) : (
                <div>
                  {lines.map(l => <div key={l.id}>{l.text}</div>)}
                  <div style={{display:'flex', gap:8, marginTop:4}}>
                    <span style={{color:'#0f0', fontWeight:700, whiteSpace:'nowrap'}}>{directory}&gt;</span>
                    <input
                      ref={inputRef}
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={onKeyDown}
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                      style={{
                        background:'transparent',border:'none',color:'#0f0',
                        outline:'none',width:'100%',fontFamily:'inherit',
                        fontSize:'inherit',caretColor:'#0f0',padding:0,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </WindowContent>
          <div style={{display:'flex', gap:8, padding:'8px 12px', alignItems:'center', background:'#c0c0c0'}}>
            <Button onClick={executeCommand} disabled={!booted}>Run</Button>
            <Button onClick={() => { setLines([]); setInputText('') }} disabled={!booted}>CLS</Button>
            <div style={{flex:1}} />
            <span style={{fontSize:11,color:'#666',fontFamily:'VT323,monospace'}}>WIZLI-OS 2.9.0</span>
          </div>
        </Window>
      </Frame>
    </div>
  )
}
