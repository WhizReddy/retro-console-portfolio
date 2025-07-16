import React, { useEffect, useRef, useCallback } from 'react';
import { createScrollConfig } from '../src/config/scrollConfig.js';

export default function ScrollIntroManager({
  stage,
  onStageChange,
  lockScroll,
  setLockScroll,
  config = {}
}) {
  const scrollConfig = createScrollConfig(config);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Throttled scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (lockScroll) return;
    
    const currentScrollY = window.scrollY;
    lastScrollY.current = currentScrollY;

    if (!ticking.current) {
      requestAnimationFrame(() => {
        const y = lastScrollY.current;
        
        // Determine new stage based on scroll position
        let newStage = stage;
        
        if (y >= scrollConfig.thresholds.monitorGuidance && stage < 2) {
          newStage = 2;
        } else if (y >= scrollConfig.thresholds.developerInfo && stage < 1) {
          newStage = 1;
        } else if (y < scrollConfig.thresholds.introWarning && stage > 0) {
          newStage = 0;
        }

        // Only update if stage actually changed
        if (newStage !== stage) {
          console.log(`Stage changed from ${stage} to ${newStage} at scroll position ${y}px`);
          onStageChange(newStage);
        }

        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [stage, lockScroll, onStageChange, scrollConfig.thresholds]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle scroll locking
  useEffect(() => {
    if (lockScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [lockScroll]);

  return null; // This component only manages scroll behavior
}