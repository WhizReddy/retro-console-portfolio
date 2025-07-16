# Design Document

## Overview

The scroll-based intro system will enhance the existing stage-based camera system in App.jsx to provide progressive disclosure of information about the developer and guide users toward the Game Boy monitor interaction. The design leverages the current scroll thresholds and overlay system while adding new UI components for smooth user onboarding.

## Architecture

The system builds upon the existing scroll-stage architecture with these key components:

### Current System Analysis
- **Stage System**: Already implements 4 stages (0-3) with scroll thresholds at 150px, 600px, and 1000px
- **Camera Animation**: Uses react-spring for smooth camera transitions between stages
- **Overlay System**: Existing AboutOverlay component shows at stage 1
- **Lock Mechanism**: Prevents scroll during overlay display

### Enhanced Architecture
The new system will:
1. **Extend the existing overlay system** with multiple overlay types
2. **Add scroll progress indicators** to show user progression
3. **Implement smooth transitions** between different information states
4. **Maintain existing camera behavior** while adding UI enhancements

## Components and Interfaces

### 1. ScrollIntroManager Component
**Purpose**: Orchestrates the scroll-based introduction flow
**Location**: `src/components/ScrollIntroManager.jsx`

```javascript
interface ScrollIntroManagerProps {
  stage: number;
  onStageChange: (stage: number) => void;
  lockScroll: boolean;
  setLockScroll: (locked: boolean) => void;
}
```

**Responsibilities**:
- Manages scroll event listeners and threshold detection
- Coordinates overlay display timing
- Handles smooth transitions between intro states
- Provides configurable scroll thresholds

### 2. IntroOverlay Component
**Purpose**: Displays developer introduction message
**Location**: `src/components/IntroOverlay.jsx`

```javascript
interface IntroOverlayProps {
  visible: boolean;
  onDismiss: () => void;
  animationState: 'entering' | 'visible' | 'exiting';
}
```

**Features**:
- Fade-in animation when scroll threshold is reached
- Non-blocking overlay (allows continued scrolling)
- Auto-dismiss after timeout or manual dismiss
- Responsive design for different screen sizes

### 3. MonitorGuidance Component
**Purpose**: Guides users toward the Game Boy monitor
**Location**: `src/components/MonitorGuidance.jsx`

```javascript
interface MonitorGuidanceProps {
  visible: boolean;
  monitorPosition: [number, number, number];
  cameraPosition: [number, number, number];
}
```

**Features**:
- Animated arrow or indicator pointing to monitor
- Contextual message about interaction
- 3D-aware positioning that follows monitor in viewport
- Pulse animation to draw attention

### 4. ScrollProgressIndicator Component
**Purpose**: Shows user progress through the scroll experience
**Location**: `src/components/ScrollProgressIndicator.jsx`

```javascript
interface ScrollProgressIndicatorProps {
  currentStage: number;
  totalStages: number;
  stageNames: string[];
}
```

**Features**:
- Minimal progress dots or bar
- Stage labels for context
- Smooth progress transitions
- Positioned unobtrusively in corner

## Data Models

### ScrollConfig Interface
```javascript
interface ScrollConfig {
  thresholds: {
    introWarning: number;      // Default: 100px
    developerInfo: number;     // Default: 300px  
    monitorGuidance: number;   // Default: 700px
    gameActivation: number;    // Default: 1000px
  };
  timings: {
    overlayDelay: number;      // Default: 600ms
    autoHideDelay: number;     // Default: 5000ms
    transitionDuration: number; // Default: 300ms
  };
  messages: {
    warning: string;
    introduction: string;
    monitorGuidance: string;
  };
}
```

### ScrollState Interface
```javascript
interface ScrollState {
  currentStage: number;
  scrollPosition: number;
  isLocked: boolean;
  activeOverlay: 'none' | 'intro' | 'guidance';
  hasSeenIntro: boolean;
  hasReachedMonitor: boolean;
}
```

## Error Handling

### Scroll Event Throttling
- Implement throttling to prevent excessive scroll event processing
- Use requestAnimationFrame for smooth animations
- Debounce rapid scroll changes to avoid flickering

### Fallback Behavior
- If scroll events fail to register, provide manual navigation buttons
- Graceful degradation for users with disabled JavaScript
- Fallback to existing overlay system if new components fail

### Performance Considerations
- Lazy load overlay components until needed
- Use CSS transforms for animations instead of layout changes
- Implement intersection observer for efficient scroll detection

## Testing Strategy

### Unit Tests
1. **ScrollIntroManager**
   - Test scroll threshold detection accuracy
   - Verify stage transition logic
   - Test scroll lock/unlock functionality
   - Validate configuration handling

2. **Overlay Components**
   - Test animation states and transitions
   - Verify responsive behavior
   - Test auto-dismiss functionality
   - Validate accessibility features

3. **Integration Tests**
   - Test complete scroll flow from start to Game Boy activation
   - Verify camera coordination with overlay system
   - Test scroll lock during overlay display
   - Validate smooth transitions between stages

### Visual Testing
- Test on different screen sizes and orientations
- Verify overlay positioning and readability
- Test animation smoothness and timing
- Validate 3D scene integration

### User Experience Testing
- Test scroll sensitivity and threshold appropriateness
- Verify message clarity and timing
- Test accessibility with keyboard navigation
- Validate mobile touch scroll behavior

## Implementation Notes

### Integration with Existing System
- Extend current `stage` state management in App.jsx
- Enhance existing `AboutOverlay` component rather than replacing
- Maintain compatibility with existing camera animation system
- Preserve current Game Boy interaction functionality

### Performance Optimizations
- Use React.memo for overlay components to prevent unnecessary re-renders
- Implement scroll event throttling with requestAnimationFrame
- Lazy load overlay content until first scroll interaction
- Use CSS-in-JS for dynamic styling to avoid style recalculation

### Accessibility Considerations
- Provide keyboard navigation alternatives to scrolling
- Include ARIA labels for screen readers
- Ensure sufficient color contrast for overlay text
- Support reduced motion preferences

### Mobile Considerations
- Adjust scroll thresholds for touch devices
- Optimize overlay sizing for mobile screens
- Handle touch scroll momentum and inertia
- Test on various mobile browsers and devices