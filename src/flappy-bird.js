export default function startGame(canvas){
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'lime';
    ctx.font = '32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Flappy Bird coming soon…', canvas.width/2, canvas.height/2);
    return ()=>{};     // cleanup no-op
  }
  