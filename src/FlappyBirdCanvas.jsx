import React, { useEffect, useRef } from 'react';
import startGame from './flappy-bird.js';   // stub for now

export default function FlappyBirdCanvas(){
  const ref = useRef();
  useEffect(()=> startGame(ref.current),[]);
  return <canvas ref={ref} style={{position:'fixed',inset:0,width:'100vw',height:'100vh',background:'#000',zIndex:10}}/>;
}
