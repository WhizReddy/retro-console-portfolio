# Implementation Plan

- [x] 1. Create ScrollIndicator component with retro styling
  - Implement component with fixed positioning at bottom center of viewport
  - Add retro/matrix theme styling with green glow effects and monospace font
  - Include bouncing arrow animation and "SCROLL TO EXPLORE" text
  - _Requirements: 1.1, 1.4, 1.5_

- [x] 2. Implement ScrollIndicator visibility logic and event handling
  - Add state management for visibility (visible/hidden states)
  - Implement auto-hide timer that triggers after 5 seconds
  - Add scroll event listener that immediately hides indicator when user scrolls
  - Ensure proper cleanup of event listeners and timers on component unmount
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. Create GameIndicator component for 3D space positioning
  - Build component using @react-three/drei Html wrapper for 3D positioning
  - Accept position prop as 3D coordinates array and onPlay callback prop
  - Implement emoji display (default 🎮) with transform centering
  - Add click handler that calls onPlay callback with audio feedback
  - _Requirements: 2.1, 2.3_

- [x] 4. Add hover effects and animations to GameIndicator
  - Implement hover state management (idle/hovered states)
  - Add size scaling effect on hover (2.5rem to 3rem font size)
  - Create glow effect that intensifies on hover using CSS drop-shadow
  - Add floating animation using CSS keyframes for continuous up/down movement
  - Ensure smooth transitions for all hover effects
  - _Requirements: 2.2, 2.4, 3.1, 3.2_

- [x] 5. Integrate ScrollIndicator into App.jsx
  - Import ScrollIndicator component in App.jsx
  - Add ScrollIndicator to the main App component return statement
  - Position it outside the Canvas but within the main app container
  - Test that it appears on initial load and disappears correctly
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 6. Integrate GameIndicator into 3D scene
  - Import GameIndicator component in App.jsx
  - Add GameIndicator within the Canvas/Suspense block in the 3D scene
  - Position it near the Game Boy on desk using appropriate 3D coordinates
  - Connect onPlay callback to existing setShowSnakeGame state setter
  - Ensure it renders correctly within the 3D environment
  - _Requirements: 2.1, 2.3, 2.5_

- [x] 7. Add CSS animations and styling
  - Create bounce keyframe animation for ScrollIndicator arrow
  - Implement float keyframe animation for GameIndicator continuous movement
  - Add CSS transitions for smooth hover effects on GameIndicator
  - Ensure all animations are hardware-accelerated and performant
  - Test animations don't interfere with existing 3D scene performance
  - _Requirements: 2.4, 3.1, 3.2_

- [x] 8. Test component integration and user experience
  - Verify ScrollIndicator appears on fresh page load and hides appropriately
  - Test GameIndicator positioning and interaction within 3D scene
  - Confirm game launching works correctly when GameIndicator is clicked
  - Validate that both components use consistent retro theme styling
  - Test responsive behavior on different screen sizes
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.3_