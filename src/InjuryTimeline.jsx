import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Animated counter component for "Event #X logged" toast
const EventLoggedToast = ({ eventNumber, onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Animate count up
    const duration = 600;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * eventNumber));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
    
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [eventNumber, onComplete]);
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '-100px'})`,
      background: 'linear-gradient(135deg, rgba(255, 51, 255, 0.95), rgba(136, 68, 255, 0.95))',
      padding: '12px 24px',
      borderRadius: '30px',
      boxShadow: '0 8px 32px rgba(255, 51, 255, 0.5)',
      zIndex: 2000,
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
    }}>
      <span style={{ 
        color: 'white', 
        fontWeight: '600', 
        fontSize: '16px',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        letterSpacing: '0.5px',
      }}>
        ✨ Event #{count} logged
      </span>
    </div>
  );
};

// Live time since injury counter component
const TimeSinceInjury = ({ injuryDate }) => {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const updateElapsed = () => {
      const now = new Date();
      const diff = now - injuryDate;
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsed({ days, hours, minutes, seconds });
    };
    
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [injuryDate]);
  
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#ff33ff',
          fontVariantNumeric: 'tabular-nums',
        }}>{elapsed.days}</div>
        <div style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>days</div>
      </div>
      <span style={{ color: '#444', fontSize: '20px', fontWeight: '300' }}>:</span>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#ff33ff',
          fontVariantNumeric: 'tabular-nums',
        }}>{String(elapsed.hours).padStart(2, '0')}</div>
        <div style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>hrs</div>
      </div>
      <span style={{ color: '#444', fontSize: '20px', fontWeight: '300' }}>:</span>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#ff33ff',
          fontVariantNumeric: 'tabular-nums',
        }}>{String(elapsed.minutes).padStart(2, '0')}</div>
        <div style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>min</div>
      </div>
      <span style={{ color: '#444', fontSize: '20px', fontWeight: '300' }}>:</span>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#aa66ff',
          fontVariantNumeric: 'tabular-nums',
          opacity: 0.8,
        }}>{String(elapsed.seconds).padStart(2, '0')}</div>
        <div style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>sec</div>
      </div>
    </div>
  );
};

// Pain trend indicator component
const PainTrendIndicator = ({ timelineData }) => {
  if (!timelineData || timelineData.length < 2) return null;
  
  const peakPain = Math.max(...timelineData.map(e => e.pain));
  const currentPain = timelineData[timelineData.length - 1]?.pain || 0;
  const painDrop = peakPain - currentPain;
  const isImproving = painDrop > 0;
  const isWorsening = painDrop < 0;
  
  // Calculate trend over last 3 events
  const recentEvents = timelineData.slice(-3);
  let trend = 'stable';
  if (recentEvents.length >= 2) {
    const recentChange = recentEvents[0].pain - recentEvents[recentEvents.length - 1].pain;
    if (recentChange > 0) trend = 'improving';
    else if (recentChange < 0) trend = 'worsening';
  }
  
  const trendColors = {
    improving: '#33ff99',
    stable: '#ffaa33',
    worsening: '#ff3333',
  };
  
  const trendArrows = {
    improving: '↓',
    stable: '→',
    worsening: '↑',
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '8px',
      border: `1px solid ${trendColors[trend]}40`,
    }}>
      <span style={{
        fontSize: '24px',
        color: trendColors[trend],
        fontWeight: 'bold',
        lineHeight: 1,
        textShadow: `0 0 10px ${trendColors[trend]}60`,
      }}>
        {trendArrows[trend]}
      </span>
      <div>
        <div style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: trendColors[trend],
        }}>
          {painDrop > 0 ? `${painDrop} pts from peak` : painDrop < 0 ? `${Math.abs(painDrop)} pts above baseline` : 'Stable'}
        </div>
        <div style={{ fontSize: '10px', color: '#888' }}>
          Peak: {peakPain}/10 → Now: {currentPain}/10
        </div>
      </div>
    </div>
  );
};

// Form component for adding new recovery updates
const AddUpdateForm = ({ onClose, onSubmit, lastEvent }) => {
  const [formData, setFormData] = useState({
    date: new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    }),
    title: '',
    description: '',
    pain: lastEvent?.pain || 5,
    type: 'assessment',
    hours: lastEvent ? lastEvent.hours + 1 : 0,
    functional: '',
    isMilestone: false,
    milestoneTier: 1,
    milestoneLabel: '',
    milestoneType: 'stability',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      date: formData.date,
      title: formData.title,
      description: formData.description,
      pain: Number(formData.pain),
      type: formData.type,
      hours: Number(formData.hours),
      functional: formData.functional,
    };
    
    if (formData.isMilestone) {
      eventData.isMilestone = true;
      eventData.milestone = {
        tier: Number(formData.milestoneTier),
        label: formData.milestoneLabel || formData.title,
        type: formData.milestoneType,
      };
    }
    
    onSubmit(eventData);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)',
    }}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} style={{
        background: 'rgba(20, 20, 20, 0.95)',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '500px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#ff33ff', fontSize: '24px' }}>
          Add Recovery Update
        </h2>
        <p style={{ margin: '0 0 20px 0', fontSize: '11px', color: '#666' }}>
          Press Enter to submit, Esc to cancel
        </p>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '12px' }}>
            Date/Time
          </label>
          <input
            type="text"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '12px' }}>
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            autoFocus
            placeholder="e.g., Morning Assessment, PT Session 4"
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '12px' }}>
            Event Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          >
            <option value="assessment">Assessment</option>
            <option value="pt">PT Session</option>
            <option value="intervention">Intervention</option>
            <option value="rest">Rest Period</option>
            <option value="injury">Injury/Setback</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '12px' }}>
            Pain Level: {formData.pain}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={formData.pain}
            onChange={(e) => setFormData({ ...formData, pain: e.target.value })}
            style={{
              width: '100%',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#666' }}>
            <span>No Pain</span>
            <span>Worst Pain</span>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '12px' }}>
            Hours Since Injury
          </label>
          <input
            type="number"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            required
            min="0"
            step="0.1"
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              color: 'white',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '12px' }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            placeholder="Describe what happened or what treatment was done..."
            rows="3"
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              color: 'white',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#aaa', fontSize: '12px' }}>
            Functional Status
          </label>
          <textarea
            value={formData.functional}
            onChange={(e) => setFormData({ ...formData, functional: e.target.value })}
            required
            placeholder="ROM, movement quality, specific tests performed..."
            rows="2"
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              color: 'white',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Milestone Checkbox */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.isMilestone}
              onChange={(e) => setFormData({ ...formData, isMilestone: e.target.checked })}
              style={{ marginRight: '10px' }}
            />
            <span style={{ color: '#ffdd55', fontSize: '14px' }}>🏆 Mark as Milestone Achievement</span>
          </label>
        </div>

        {/* Milestone Options (shown when milestone checked) */}
        {formData.isMilestone && (
          <div style={{
            padding: '15px',
            background: 'rgba(255, 221, 85, 0.1)',
            borderRadius: '8px',
            marginBottom: '15px',
            border: '1px solid rgba(255, 221, 85, 0.3)',
          }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ffdd55', fontSize: '12px' }}>
                Milestone Tier (1-6)
              </label>
              <select
                value={formData.milestoneTier}
                onChange={(e) => setFormData({ ...formData, milestoneTier: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 221, 85, 0.3)',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="1">Tier 1 - Stability</option>
                <option value="2">Tier 2 - ROM</option>
                <option value="3">Tier 3 - Strength</option>
                <option value="4">Tier 4 - Endurance</option>
                <option value="5">Tier 5 - Sport Specific</option>
                <option value="6">Tier 6 - Contact</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ffdd55', fontSize: '12px' }}>
                Milestone Type
              </label>
              <select
                value={formData.milestoneType}
                onChange={(e) => setFormData({ ...formData, milestoneType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 221, 85, 0.3)',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="stability">🛡️ Stability</option>
                <option value="mobility">🦵 Mobility</option>
                <option value="brace">🧱 Bracing</option>
                <option value="mobility-brace">💪 Mobility + Brace</option>
                <option value="impact">💥 Impact Tolerance</option>
                <option value="sport-skill">🤼 Sport Skill</option>
                <option value="contact">⚡ Contact</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ffdd55', fontSize: '12px' }}>
                Milestone Label (optional)
              </label>
              <input
                type="text"
                value={formData.milestoneLabel}
                onChange={(e) => setFormData({ ...formData, milestoneLabel: e.target.value })}
                placeholder="e.g., First pain-free breakfall"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 221, 85, 0.3)',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '12px',
              background: '#ff33ff',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Add Event
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 20px',
              background: '#333',
              border: '1px solid #555',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const InjuryTimeline = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [showEventToast, setShowEventToast] = useState(false);
  const [toastEventNumber, setToastEventNumber] = useState(0);
  const selectedIndexRef = useRef(null);
  const hoveredIndexRef = useRef(null);
  const isRotatingRef = useRef(true);
  const eventSpheresRef = useRef([]);
  const spherePositionsRef = useRef([]);
  const milestoneBurstsRef = useRef([]);
  const particleSystemRef = useRef(null);
  const orbitalTrailsRef = useRef([]);
  const targetCameraPosition = useRef(new THREE.Vector3(0, 5, 15));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  // Camera orbit controls
  const isDraggingRef = useRef(false);
  const cameraAngleRef = useRef(0);
  const cameraElevationRef = useRef(0.3);
  const cameraDistanceRef = useRef(15);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const autoRotateSpeedRef = useRef(0.3);

  // Helper: create radial texture for VFX
  const makeRadialTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0.0, 'rgba(255,255,255,1)');
    g.addColorStop(0.2, 'rgba(255,255,255,0.7)');
    g.addColorStop(1.0, 'rgba(255,255,255,0)');

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  };

  // Create particle dust system (nebula effect)
  const createParticleDust = (scene) => {
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a large sphere around the scene
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 5 + Math.random() * 20;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 2;
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Subtle color variation (purple/blue/pink nebula)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Purple
        colors[i * 3] = 0.6 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (colorChoice < 0.66) {
        // Blue
        colors[i * 3] = 0.2 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        // Pink/magenta
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
      }
      
      sizes[i] = 0.02 + Math.random() * 0.04;
      
      // Slow drift velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData.velocities = velocities;
    scene.add(particles);
    
    return particles;
  };

  // Trigger milestone burst VFX
  const triggerMilestoneBurst = (scene, position, tier = 1) => {
    const group = new THREE.Group();
    group.position.copy(position);

    const disposables = { geometries: [], materials: [], textures: [] };

    const tierColors = [0xaaaaaa, 0xffffaa, 0xffffaa, 0xffdd55, 0xff88ff, 0xff00ff];
    const color = tierColors[Math.min(tier, tierColors.length - 1)];
    const intensity = 0.5 + (tier * 0.15);
    
    const tex = makeRadialTexture();
    disposables.textures.push(tex);

    const beamMat = new THREE.SpriteMaterial({
      map: tex,
      color,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    disposables.materials.push(beamMat);

    const beam = new THREE.Sprite(beamMat);
    beam.position.set(0, 2.0, 0);
    beam.scale.set(1.5 * intensity, 8.0 * intensity, 1);
    group.add(beam);

    if (tier >= 2) {
      const ringGeo = new THREE.TorusGeometry(0.6, 0.03, 16, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      disposables.geometries.push(ringGeo);
      disposables.materials.push(ringMat);

      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.1;
      group.add(ring);
    }

    const sparkCount = 40 + (tier * 20);
    const positions = new Float32Array(sparkCount * 3);
    const velocities = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = Math.random() * 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.6 * intensity;
      velocities[i * 3 + 1] = (1.5 + Math.random() * 1.2) * intensity;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.6 * intensity;
    }

    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    sparkGeo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    disposables.geometries.push(sparkGeo);

    const sparkMat = new THREE.PointsMaterial({
      color,
      size: 0.08 * intensity,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    disposables.materials.push(sparkMat);

    const sparks = new THREE.Points(sparkGeo, sparkMat);
    group.add(sparks);

    scene.add(group);

    milestoneBurstsRef.current.push({
      group,
      beam,
      ring: tier >= 2 ? group.children.find(c => c instanceof THREE.Mesh) : null,
      sparks,
      start: performance.now(),
      duration: 800 + (tier * 100),
      disposables,
    });
  };

  // Timeline data
  const initialTimelineData = [
    {
      id: '0-INJURY_EVENT',
      date: 'Dec 28, 12:00 PM',
      title: 'INJURY EVENT',
      description: 'Uchi mata → flat back landing. Immediate left hip flexor + lower back pain. Rotational grip break → complete seizure.',
      pain: 10,
      type: 'injury',
      hours: 0,
      functional: 'Forward flexion: first few inches only. Unable to continue training.',
    },
    {
      id: '2.5-First_Intervention',
      date: 'Dec 28, 2:30 PM',
      title: 'First Intervention',
      description: '2× Ibuprofen administered',
      pain: 8,
      type: 'intervention',
      hours: 2.5,
      functional: 'Pain at rest 3-4/10, movement 5-6/10',
      isMilestone: true,
      milestone: {
        tier: 1,
        label: 'First pain control',
        type: 'stability',
      },
    },
    {
      id: '5-Rest_Period',
      date: 'Dec 28, 5-7:30 PM',
      title: 'Rest Period',
      description: '2.5 hour nap for recovery',
      pain: 6,
      type: 'rest',
      hours: 5,
      functional: 'Pain reduction beginning',
    },
    {
      id: '8-Initial_Assessment',
      date: 'Dec 28, 8:00 PM',
      title: 'Initial Assessment',
      description: 'First improvement noted. Rotation feels okay while standing.',
      pain: 5,
      type: 'assessment',
      hours: 8,
      functional: 'Pain at rest: 2-3/10. Rotation improved. Forward flexion still limited.',
      isMilestone: true,
      milestone: {
        tier: 1,
        label: 'Baseline function restored',
        type: 'stability',
      },
    },
    {
      id: '23-PT_Session_1',
      date: 'Dec 29, 11:00 AM',
      title: 'PT Session 1',
      description: 'WGS (4×5), Shinbox (3×8), Scorpion (2×8)',
      pain: 6,
      type: 'pt',
      hours: 23,
      functional: 'Core bracing 4-5/10 pain. Sit-ups difficult.',
    },
    {
      id: '27.5-PT_Session_2_BREAKTHROUGH',
      date: 'Dec 29, 3:30 PM',
      title: 'PT Session 2 - BREAKTHROUGH',
      description: 'DNS Star Reach (2×10), WGS (2×4), Shinbox (2×8), Scorpion (2×5). DNS provided immediate hip relief!',
      pain: 3,
      type: 'pt',
      hours: 27.5,
      functional: '✓ Can touch toes! ✓ Core bracing pain-free! ✓ Breakfall pain-free!',
      isMilestone: true,
      milestone: {
        tier: 3,
        label: 'ROM Restored + Core Control',
        type: 'mobility-brace',
      },
    },
    {
      id: '30.5-PT_Session_3',
      date: 'Dec 29, 6:30 PM',
      title: 'PT Session 3',
      description: 'Same protocol + Dead Bugs (1×10) added',
      pain: 2,
      type: 'pt',
      hours: 30.5,
      functional: 'Significantly better. TVA engagement still painful.',
    },
    {
      id: '47.75-Day_3_Morning',
      date: 'Dec 30, 11:45 AM',
      title: 'Day 3 Morning',
      description: 'Morning stiffness 5/10. Sleep catching/shifting noted.',
      pain: 4,
      type: 'assessment',
      hours: 47.75,
      functional: 'Standing breakfall uncomfortable. Regression from evening metrics.',
    },
    {
      id: '50-PT_Session_Reduced_Volume',
      date: 'Dec 30, 2:00 PM',
      title: 'PT Session - Reduced Volume',
      description: 'DNS Star Reach (2×10), Scorpion (2×5), Dead Bugs (1×10)',
      pain: 2,
      type: 'pt',
      hours: 50,
      functional: '✓ Substantially better! ✓ Core pain-free both directions! ✓ Seated breakfall pain-free!',
      isMilestone: true,
      milestone: {
        tier: 4,
        label: 'Pain-free breakfall (seated)',
        type: 'impact',
      },
    },
    {
      id: '52.83-PT_Session_Standing_Breakfall',
      date: 'Dec 30, 4:50 PM',
      title: 'PT Session - Standing Breakfall Cleared',
      description: 'Scorpion (2×5), Dead Bugs (1×16), WGS (1×5 each side), DNS Star Reach (1×8 each side). Less stiffness overall.',
      pain: 2,
      type: 'pt',
      hours: 52.83,
      functional: '✓ Standing breakfall PAIN-FREE! ✓ 2 seated breakfalls pain-free! ✓ TVA only painful with very aggressive bracing (major improvement). Overall less stiffness.',
      isMilestone: true,
      milestone: {
        tier: 4,
        label: 'Standing breakfall pain-free',
        type: 'impact',
      },
    },
  ];

  // Load timeline data from localStorage or use initial data
  const [timelineData, setTimelineData] = useState(() => {
    if (typeof window === 'undefined') return initialTimelineData;
    const saved = localStorage.getItem('injuryTimelineData');
    return saved ? JSON.parse(saved) : initialTimelineData;
  });

  // Calculate injury date from first event
  const injuryDate = React.useMemo(() => {
    // Parse "Dec 28, 12:00 PM" format from first event
    const firstEvent = timelineData[0];
    if (!firstEvent) return new Date();
    
    // Try to parse the date string
    const dateStr = firstEvent.date;
    const currentYear = new Date().getFullYear();
    const parsed = new Date(`${dateStr} ${currentYear}`);
    
    // If invalid, return current date
    if (isNaN(parsed.getTime())) return new Date();
    return parsed;
  }, [timelineData]);

  // Save to localStorage whenever timeline data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('injuryTimelineData', JSON.stringify(timelineData));
    }
  }, [timelineData]);

  // Restore selection after timeline data changes
  useEffect(() => {
    if (selectedEventId) {
      const newIndex = timelineData.findIndex(event => event.id === selectedEventId);
      if (newIndex !== -1) {
        setSelectedIndex(newIndex);
        setSelectedEvent(timelineData[newIndex]);
        selectedIndexRef.current = newIndex;
      } else {
        setSelectedEventId(null);
        setSelectedEvent(null);
        setSelectedIndex(null);
        selectedIndexRef.current = null;
        isRotatingRef.current = true;
      }
    }
  }, [timelineData, selectedEventId]);

  useEffect(() => {
    if (!mountRef.current) return;

    eventSpheresRef.current = [];
    spherePositionsRef.current = [];
    orbitalTrailsRef.current = [];

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a14);
    scene.fog = new THREE.Fog(0x0a0a14, 15, 60);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(Math.min(dpr, 2));
    rendererRef.current = renderer;
    
    const { width, height } = mountRef.current.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x6666ff, 0.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(10, 15, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff33ff, 0.4);
    rimLight.position.set(-10, 5, -10);
    scene.add(rimLight);

    const accentLight1 = new THREE.PointLight(0x4488ff, 1.5, 50);
    accentLight1.position.set(5, 8, 5);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0xff33ff, 1.2, 50);
    accentLight2.position.set(-5, -3, -8);
    scene.add(accentLight2);
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Create particle dust (nebula effect)
    const particles = createParticleDust(scene);
    particleSystemRef.current = particles;

    // Create timeline elements
    const eventSpheres = [];
    const sharedSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sharedGlowGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const milestoneGeometry = new THREE.OctahedronGeometry(0.35, 0);
    const milestoneGlowGeometry = new THREE.OctahedronGeometry(0.42, 0);
    
    const materialCache = {};

    const getMaterial = (color, isMilestone = false) => {
      const key = `${color}_${isMilestone}`;
      if (!materialCache[key]) {
        materialCache[key] = new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: isMilestone ? 0.6 : 0.4,
          metalness: isMilestone ? 0.8 : 0.6,
          roughness: isMilestone ? 0.2 : 0.4,
          transparent: false,
        });
      }
      return materialCache[key];
    };

    const getGlowMaterial = (color, isMilestone = false) => {
      const glowKey = `glow_${color}_${isMilestone}`;
      if (!materialCache[glowKey]) {
        materialCache[glowKey] = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: isMilestone ? 0.4 : 0.25,
        });
      }
      return materialCache[glowKey];
    };

    // Calculate positions and create objects
    const positions = [];
    timelineData.forEach((event, index) => {
      const denom = Math.max(1, timelineData.length - 1);
      const t = index / denom;
      const angle = t * Math.PI * 2;
      const radius = 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (10 - event.pain) * 0.5 - 2;
      
      positions.push({ x, y, z, angle, radius });

      let color;
      if (event.isMilestone) {
        color = 0xffdd55;
      } else {
        switch (event.type) {
          case 'injury': color = 0xff3333; break;
          case 'intervention': color = 0xffaa33; break;
          case 'rest': color = 0x6666ff; break;
          case 'assessment': color = 0x33ff99; break;
          case 'pt': color = 0xff33ff; break;
          default: color = 0xffffff;
        }
      }

      const geometry = event.isMilestone ? milestoneGeometry : sharedSphereGeometry;
      const glowGeometry = event.isMilestone ? milestoneGlowGeometry : sharedGlowGeometry;
      const material = getMaterial(color, event.isMilestone);
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      sphere.userData = { event, index, baseColor: color };
      scene.add(sphere);
      eventSpheres.push(sphere);
      eventSpheresRef.current.push(sphere);
      spherePositionsRef.current.push(new THREE.Vector3(x, y, z));

      const glowMaterial = getGlowMaterial(color, event.isMilestone);
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(sphere.position);
      scene.add(glow);
      
      // Milestone halo
      if (event.isMilestone) {
        const haloGeo = new THREE.TorusGeometry(0.5, 0.02, 16, 64);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xffffaa,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.copy(sphere.position);
        halo.rotation.x = Math.PI / 2;
        halo.userData = { type: 'halo', eventIndex: index };
        scene.add(halo);
      }

      // Create orbital trail for each event
      const trailLength = 60;
      const trailPositions = new Float32Array(trailLength * 3);
      const trailOpacities = new Float32Array(trailLength);
      
      for (let i = 0; i < trailLength; i++) {
        const trailAngle = angle - (i * 0.02);
        trailPositions[i * 3] = Math.cos(trailAngle) * radius;
        trailPositions[i * 3 + 1] = y;
        trailPositions[i * 3 + 2] = Math.sin(trailAngle) * radius;
        trailOpacities[i] = 1 - (i / trailLength);
      }
      
      const trailGeometry = new THREE.BufferGeometry();
      trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      
      const trailMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
      });
      
      const trail = new THREE.Line(trailGeometry, trailMaterial);
      trail.userData = { eventIndex: index, baseAngle: angle, radius, y, color };
      scene.add(trail);
      orbitalTrailsRef.current.push(trail);
    });

    // Enhanced constellation lines (connecting adjacent events)
    for (let i = 0; i < positions.length - 1; i++) {
      const curr = positions[i];
      const next = positions[i + 1];
      
      // Create gradient line effect with multiple segments
      const linePoints = [];
      const segments = 20;
      
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        linePoints.push(new THREE.Vector3(
          curr.x + (next.x - curr.x) * t,
          curr.y + (next.y - curr.y) * t,
          curr.z + (next.z - curr.z) * t
        ));
      }
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.userData = { type: 'constellation' };
      scene.add(line);
    }

    // Central axis
    const axisGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 32);
    const axisMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      emissive: 0x111111,
    });
    const axis = new THREE.Mesh(axisGeometry, axisMaterial);
    axis.position.y = 0;
    scene.add(axis);
    
    // Text sprite helper
    const createTextSprite = (text, color) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 128;
      context.fillStyle = color;
      context.font = 'bold 60px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, 128, 64);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(3, 1.5, 1);
      return sprite;
    };
    
    if (spherePositionsRef.current.length > 0) {
      const startPos = spherePositionsRef.current[0];
      const startMarker = createTextSprite('START', '#ff3333');
      startMarker.position.set(startPos.x, startPos.y + 1, startPos.z);
      scene.add(startMarker);
      
      const endPos = spherePositionsRef.current[spherePositionsRef.current.length - 1];
      const endMarker = createTextSprite('NOW', '#33ff99');
      endMarker.position.set(endPos.x, endPos.y + 1, endPos.z);
      scene.add(endMarker);
    }

    // Pain level rings
    for (let i = 0; i <= 10; i++) {
      const ringGeometry = new THREE.TorusGeometry(8, 0.02, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL((1 - i / 10) * 0.3, 0.8, 0.5),
        transparent: true,
        opacity: 0.2,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = (10 - i) * 0.5 - 2;
      scene.add(ring);
      
      if (i === 0 || i === 5 || i === 10) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.font = 'bold 40px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`Pain ${i}`, 64, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(9, (10 - i) * 0.5 - 2, 0);
        sprite.scale.set(2, 1, 1);
        scene.add(sprite);
      }
    }

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onCanvasPointer = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(eventSpheres);

      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        setSelectedEvent(clicked.userData.event);
        setSelectedIndex(clicked.userData.index);
        setSelectedEventId(clicked.userData.event.id);
        selectedIndexRef.current = clicked.userData.index;
        isRotatingRef.current = false;
        
        // Calculate camera position to zoom in front of selected event
        const spherePos = clicked.position.clone();
        const direction = spherePos.clone().normalize();
        // Position camera closer to the sphere, offset outward from center
        targetCameraPosition.current.set(
          spherePos.x + direction.x * 4,
          spherePos.y + 2,
          spherePos.z + direction.z * 4
        );
        targetLookAt.current.copy(spherePos);
        
        if (clicked.userData.event.isMilestone) {
          const tier = clicked.userData.event.milestone?.tier || 1;
          triggerMilestoneBurst(scene, clicked.position, tier);
        }
      } else {
        setSelectedEvent(null);
        setSelectedIndex(null);
        setSelectedEventId(null);
        selectedIndexRef.current = null;
        isRotatingRef.current = true;
      }
    };

    const onCanvasMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(eventSpheres);

      if (intersects.length > 0) {
        hoveredIndexRef.current = intersects[0].object.userData.index;
        renderer.domElement.style.cursor = 'pointer';
      } else {
        hoveredIndexRef.current = null;
        renderer.domElement.style.cursor = 'grab';
      }
    };

    renderer.domElement.addEventListener('pointerdown', onCanvasPointer);
    renderer.domElement.addEventListener('pointermove', onCanvasMove);

    // Orbit controls
    const onOrbitStart = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, camera);
      const intersects = raycaster.intersectObjects(eventSpheresRef.current);
      
      if (intersects.length === 0) {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        renderer.domElement.style.cursor = 'grabbing';
      }
    };
    
    const onOrbitMove = (e) => {
      if (!isDraggingRef.current) return;
      
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;
      
      cameraAngleRef.current -= deltaX * 0.005;
      cameraElevationRef.current += deltaY * 0.005;
      cameraElevationRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraElevationRef.current));
      
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    
    const onOrbitEnd = () => {
      isDraggingRef.current = false;
      renderer.domElement.style.cursor = 'grab';
    };
    
    renderer.domElement.addEventListener('mousedown', onOrbitStart);
    renderer.domElement.addEventListener('mousemove', onOrbitMove);
    renderer.domElement.addEventListener('mouseup', onOrbitEnd);
    window.addEventListener('mouseup', onOrbitEnd);
    
    // Touch events
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = renderer.domElement.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, camera);
        const intersects = raycaster.intersectObjects(eventSpheresRef.current);
        
        if (intersects.length === 0) {
          isDraggingRef.current = true;
          lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };
    
    const onTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastMousePosRef.current.x;
      const deltaY = touch.clientY - lastMousePosRef.current.y;
      
      cameraAngleRef.current -= deltaX * 0.005;
      cameraElevationRef.current += deltaY * 0.005;
      cameraElevationRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraElevationRef.current));
      
      lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
    };
    
    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };
    
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Camera movement
      if (isRotatingRef.current && !isDraggingRef.current) {
        cameraAngleRef.current = time * autoRotateSpeedRef.current;
      }
      
      if (isRotatingRef.current) {
        const angle = cameraAngleRef.current;
        const elevation = cameraElevationRef.current;
        const distance = cameraDistanceRef.current;
        
        camera.position.x = Math.cos(angle) * Math.cos(elevation) * distance;
        camera.position.y = Math.sin(elevation) * distance + 5;
        camera.position.z = Math.sin(angle) * Math.cos(elevation) * distance;
        camera.lookAt(0, 0, 0);
        currentLookAt.current.set(0, 0, 0);
      } else {
        camera.position.lerp(targetCameraPosition.current, 0.1);
        currentLookAt.current.lerp(targetLookAt.current, 0.1);
        camera.lookAt(currentLookAt.current);
      }

      // Update particle dust (nebula drift)
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.getAttribute('position');
        const velocities = particleSystemRef.current.userData.velocities;
        
        for (let i = 0; i < positions.count; i++) {
          positions.array[i * 3] += velocities[i * 3];
          positions.array[i * 3 + 1] += velocities[i * 3 + 1];
          positions.array[i * 3 + 2] += velocities[i * 3 + 2];
          
          // Wrap around bounds
          const dist = Math.sqrt(
            positions.array[i * 3] ** 2 +
            positions.array[i * 3 + 1] ** 2 +
            positions.array[i * 3 + 2] ** 2
          );
          if (dist > 25) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 5 + Math.random() * 5;
            positions.array[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions.array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 2;
            positions.array[i * 3 + 2] = r * Math.cos(phi);
          }
        }
        positions.needsUpdate = true;
        
        // Subtle rotation
        particleSystemRef.current.rotation.y += 0.0003;
      }

      // Update orbital trails
      orbitalTrailsRef.current.forEach((trail) => {
        const { baseAngle, radius, y } = trail.userData;
        const positions = trail.geometry.getAttribute('position');
        const trailLength = positions.count;
        
        for (let i = 0; i < trailLength; i++) {
          const trailAngle = baseAngle + time * 0.1 - (i * 0.02);
          positions.array[i * 3] = Math.cos(trailAngle) * radius;
          positions.array[i * 3 + 1] = y;
          positions.array[i * 3 + 2] = Math.sin(trailAngle) * radius;
        }
        positions.needsUpdate = true;
      });

      // Pulse event spheres
      eventSpheres.forEach((sphere, index) => {
        const isSelected = selectedIndexRef.current === index;
        const isHovered = hoveredIndexRef.current === index;
        const isMilestone = sphere.userData.event.isMilestone;
        
        const pulseSpeed = isMilestone ? 1.5 : 2;
        const pulseAmount = isMilestone ? 0.05 : 0.1;
        const basePulse = Math.sin(time * pulseSpeed + index * 0.5) * pulseAmount;
        
        if (isSelected) {
          const baseScale = isMilestone ? 1.3 : 1.3;
          sphere.scale.set(baseScale, baseScale, baseScale);
          sphere.material.emissiveIntensity = isMilestone ? 0.8 : 0.6;
        } else if (isHovered) {
          const baseScale = isMilestone ? 1.25 : 1.2;
          sphere.scale.set(baseScale, baseScale, baseScale);
          sphere.material.emissiveIntensity = isMilestone ? 0.7 : 0.5;
        } else {
          const baseScale = isMilestone ? 1.1 : 1.0;
          const scale = baseScale + basePulse;
          sphere.scale.set(scale, scale, scale);
          sphere.material.emissiveIntensity = isMilestone ? 0.5 : 0.3;
        }
        
        if (selectedIndexRef.current !== null && !isSelected) {
          sphere.material.opacity = 0.4;
        } else {
          sphere.material.opacity = 1.0;
        }
      });

      // Rotate milestone halos
      scene.traverse((obj) => {
        if (obj.userData.type === 'halo') {
          obj.rotation.z = time * 0.5;
        }
      });

      // Pulse constellation lines
      scene.traverse((obj) => {
        if (obj.userData.type === 'constellation') {
          obj.material.opacity = 0.2 + Math.sin(time * 0.5) * 0.1;
        }
      });

      // Update milestone bursts
      const now = performance.now();
      milestoneBurstsRef.current = milestoneBurstsRef.current.filter((b) => {
        const t = (now - b.start) / b.duration;

        if (t >= 1) {
          scene.remove(b.group);
          b.disposables.geometries.forEach((g) => g.dispose());
          b.disposables.materials.forEach((m) => m.dispose());
          b.disposables.textures.forEach((tx) => tx.dispose());
          return false;
        }

        const easeOut = 1 - Math.pow(1 - t, 3);

        const beamFade = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
        b.beam.material.opacity = Math.max(0, beamFade) * 0.9;
        b.beam.scale.x = 1.2 + easeOut * 1.0;
        b.beam.scale.y = 7.0 + easeOut * 3.0;

        if (b.ring) {
          b.ring.material.opacity = (1 - t) * 0.8;
          const s = 1 + easeOut * 8;
          b.ring.scale.set(s, s, s);
        }

        b.sparks.material.opacity = (1 - t) * 0.9;
        const posAttr = b.sparks.geometry.getAttribute('position');
        const velAttr = b.sparks.geometry.getAttribute('velocity');
        for (let i = 0; i < posAttr.count; i++) {
          posAttr.array[i * 3 + 0] += velAttr.array[i * 3 + 0] * 0.016;
          posAttr.array[i * 3 + 1] += velAttr.array[i * 3 + 1] * 0.016;
          posAttr.array[i * 3 + 2] += velAttr.array[i * 3 + 2] * 0.016;
        }
        posAttr.needsUpdate = true;

        return true;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const { width, height } = mountRef.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('pointerdown', onCanvasPointer);
      renderer.domElement.removeEventListener('pointermove', onCanvasMove);
      window.removeEventListener('resize', handleResize);
      
      renderer.domElement.removeEventListener('mousedown', onOrbitStart);
      window.removeEventListener('mousemove', onOrbitMove);
      window.removeEventListener('mouseup', onOrbitEnd);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      
      const disposedGeometries = new Set();
      const disposedMaterials = new Set();
      const disposedTextures = new Set();
      
      scene.traverse((obj) => {
        const geo = obj.geometry;
        if (geo && !disposedGeometries.has(geo)) {
          disposedGeometries.add(geo);
          geo.dispose();
        }
        
        const disposeMat = (mat) => {
          if (!mat || disposedMaterials.has(mat)) return;
          disposedMaterials.add(mat);
          
          if (mat.map && !disposedTextures.has(mat.map)) {
            disposedTextures.add(mat.map);
            mat.map.dispose();
          }
          
          mat.dispose();
        };
        
        if (Array.isArray(obj.material)) {
          obj.material.forEach(disposeMat);
        } else {
          disposeMat(obj.material);
        }
      });

      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [timelineData]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showAddForm) return;
      
      // Helper to update camera target
      const updateCameraTarget = (index) => {
        if (spherePositionsRef.current[index]) {
          const spherePos = spherePositionsRef.current[index];
          const direction = spherePos.clone().normalize();
          targetCameraPosition.current.set(
            spherePos.x + direction.x * 4,
            spherePos.y + 2,
            spherePos.z + direction.z * 4
          );
          targetLookAt.current.copy(spherePos);
        }
      };
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectedIndex === null) {
          setSelectedIndex(0);
          setSelectedEvent(timelineData[0]);
          setSelectedEventId(timelineData[0].id);
          selectedIndexRef.current = 0;
          isRotatingRef.current = false;
          updateCameraTarget(0);
        } else if (selectedIndex < timelineData.length - 1) {
          const newIndex = selectedIndex + 1;
          setSelectedIndex(newIndex);
          setSelectedEvent(timelineData[newIndex]);
          setSelectedEventId(timelineData[newIndex].id);
          selectedIndexRef.current = newIndex;
          updateCameraTarget(newIndex);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedIndex === null) {
          const lastIndex = timelineData.length - 1;
          setSelectedIndex(lastIndex);
          setSelectedEvent(timelineData[lastIndex]);
          setSelectedEventId(timelineData[lastIndex].id);
          selectedIndexRef.current = lastIndex;
          isRotatingRef.current = false;
          updateCameraTarget(lastIndex);
        } else if (selectedIndex > 0) {
          const newIndex = selectedIndex - 1;
          setSelectedIndex(newIndex);
          setSelectedEvent(timelineData[newIndex]);
          setSelectedEventId(timelineData[newIndex].id);
          selectedIndexRef.current = newIndex;
          updateCameraTarget(newIndex);
        }
      } else if (e.key === 'Escape') {
        setSelectedEvent(null);
        setSelectedIndex(null);
        setSelectedEventId(null);
        selectedIndexRef.current = null;
        isRotatingRef.current = true;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedEvent, selectedIndex, showAddForm, timelineData]);

  // Navigation functions
  const goToPreviousEvent = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      setSelectedEvent(timelineData[newIndex]);
      setSelectedEventId(timelineData[newIndex].id);
      selectedIndexRef.current = newIndex;
      
      // Update camera target to new event position
      if (spherePositionsRef.current[newIndex]) {
        const spherePos = spherePositionsRef.current[newIndex];
        const direction = spherePos.clone().normalize();
        targetCameraPosition.current.set(
          spherePos.x + direction.x * 4,
          spherePos.y + 2,
          spherePos.z + direction.z * 4
        );
        targetLookAt.current.copy(spherePos);
      }
    }
  };

  const goToNextEvent = () => {
    if (selectedIndex < timelineData.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      setSelectedEvent(timelineData[newIndex]);
      setSelectedEventId(timelineData[newIndex].id);
      selectedIndexRef.current = newIndex;
      
      // Update camera target to new event position
      if (spherePositionsRef.current[newIndex]) {
        const spherePos = spherePositionsRef.current[newIndex];
        const direction = spherePos.clone().normalize();
        targetCameraPosition.current.set(
          spherePos.x + direction.x * 4,
          spherePos.y + 2,
          spherePos.z + direction.z * 4
        );
        targetLookAt.current.copy(spherePos);
      }
    }
  };

  // Timeline management
  const addNewEvent = (newEvent) => {
    const safeTitle = newEvent.title.replace(/[^a-zA-Z0-9]/g, '_');
    const eventWithId = {
      ...newEvent,
      id: `${newEvent.hours}-${safeTitle}`,
    };
    const updatedTimeline = [...timelineData, eventWithId].sort((a, b) => a.hours - b.hours);
    setTimelineData(updatedTimeline);
    setShowAddForm(false);
    
    // Show toast with event count animation
    setToastEventNumber(updatedTimeline.length);
    setShowEventToast(true);
  };

  const exportTimeline = () => {
    const dataStr = JSON.stringify(timelineData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `injury-timeline-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const importTimeline = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          
          if (Array.isArray(imported)) {
            if (confirm(`Replace entire timeline with ${imported.length} events? This will erase your current data.`)) {
              setTimelineData(imported);
              alert('Timeline replaced successfully!');
            }
          } else if (imported && typeof imported === 'object' && imported.id) {
            const existingIndex = timelineData.findIndex(e => e.id === imported.id);
            
            if (existingIndex !== -1) {
              if (confirm(`Event "${imported.title}" already exists. Replace it?`)) {
                const updatedData = [...timelineData];
                updatedData[existingIndex] = imported;
                setTimelineData(updatedData);
                alert('Event updated successfully!');
              }
            } else {
              const updatedData = [...timelineData, imported];
              updatedData.sort((a, b) => a.hours - b.hours);
              setTimelineData(updatedData);
              
              // Show toast
              setToastEventNumber(updatedData.length);
              setShowEventToast(true);
            }
          } else {
            alert('Invalid format: Please import either a single event object or an array of events');
          }
        } catch (error) {
          alert('Error importing timeline: Invalid JSON file\n\n' + error.message);
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const resetTimeline = () => {
    if (confirm('Reset to default timeline? This will erase all your custom data and reload the page.')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('injuryTimelineData');
        window.location.reload();
      }
    }
  };

  const clearTimeline = () => {
    if (confirm('Start a fresh timeline? This will clear all data and create an empty timeline for a new injury.')) {
      const emptyTimeline = [{
        id: '0-START',
        date: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        title: 'START - New Injury',
        description: 'Click "Add Update" to begin tracking your recovery',
        pain: 0,
        type: 'assessment',
        hours: 0,
        functional: 'Ready to track recovery progress',
      }];
      setTimelineData(emptyTimeline);
      if (typeof window !== 'undefined') {
        localStorage.setItem('injuryTimelineData', JSON.stringify(emptyTimeline));
        window.location.reload();
      }
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Event Logged Toast */}
      {showEventToast && (
        <EventLoggedToast 
          eventNumber={toastEventNumber} 
          onComplete={() => setShowEventToast(false)} 
        />
      )}
      
      {/* Toggle Panel Button */}
      {!isPanelVisible && (
        <button
          onClick={() => setIsPanelVisible(true)}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'linear-gradient(135deg, rgba(255, 51, 255, 0.95), rgba(136, 68, 255, 0.95))',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            width: '54px',
            height: '54px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            color: 'white',
            boxShadow: '0 8px 24px rgba(255, 51, 255, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 51, 255, 1), rgba(136, 68, 255, 1))';
            e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 51, 255, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2) inset';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 51, 255, 0.95), rgba(136, 68, 255, 0.95))';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 51, 255, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
          }}
        >
          ☰
        </button>
      )}
      
      {/* Mobile overlay */}
      {isPanelVisible && typeof window !== 'undefined' && window.innerWidth <= 768 && (
        <div
          onClick={() => setIsPanelVisible(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 998,
            animation: 'fadeIn 0.3s ease',
          }}
        />
      )}
      
      {/* Left Info Panel */}
      {isPanelVisible && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            maxWidth: '350px',
            width: 'calc(100vw - 40px)',
            maxHeight: 'calc(100vh - 40px)',
            overflowY: 'auto',
            background: 'rgba(10, 10, 20, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '15px',
            borderRadius: '15px',
            color: 'white',
            zIndex: 999,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'slideIn 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <h1 style={{ margin: 0, fontSize: window.innerWidth < 480 ? '18px' : '22px', color: '#ff33ff' }}>
              Recovery Timeline
            </h1>
            <button
              onClick={() => setIsPanelVisible(false)}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 51, 255, 0.25), rgba(136, 68, 255, 0.25))',
                border: '1px solid rgba(255, 51, 255, 0.4)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#ff88ff',
                marginLeft: '10px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: '300',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 51, 255, 0.4), rgba(136, 68, 255, 0.4))';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.color = '#ffaaff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 51, 255, 0.25), rgba(136, 68, 255, 0.25))';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = '#ff88ff';
              }}
              title="Hide panel"
            >
              ×
            </button>
          </div>
          
          {/* Live Time Since Injury Counter */}
          <div style={{ 
            marginBottom: '12px', 
            padding: '12px', 
            background: 'linear-gradient(135deg, rgba(255, 51, 255, 0.15), rgba(68, 136, 255, 0.15))', 
            borderRadius: '10px',
            border: '1px solid rgba(255, 51, 255, 0.2)',
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
              Time Since Injury
            </p>
            <TimeSinceInjury injuryDate={injuryDate} />
          </div>
          
          {/* Stats row */}
          <div style={{ marginBottom: '10px', padding: '8px', background: 'rgba(255, 51, 255, 0.1)', borderRadius: '5px' }}>
            <p style={{ margin: '0', fontSize: '12px', color: '#ff33ff' }}>
              <strong>{timelineData.length} events</strong> tracked over <strong>{Math.round(timelineData[timelineData.length - 1]?.hours || 0)}h</strong>
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#aaa' }}>
              Pain: {timelineData[0]?.pain}/10 → {timelineData[timelineData.length - 1]?.pain}/10 
              ({Math.round((1 - timelineData[timelineData.length - 1]?.pain / timelineData[0]?.pain) * 100)}% improvement)
            </p>
          </div>
          
          {/* Pain Trend Indicator */}
          <div style={{ marginBottom: '12px' }}>
            <PainTrendIndicator timelineData={timelineData} />
          </div>
          
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#aaa' }}>
            Track your recovery progress in 3D. Click events to view details.
          </p>
          <p style={{ margin: '5px 0 15px 0', fontSize: '12px', color: '#666' }}>
            Arrow keys navigate events. ESC to close. Export to save or share your timeline.
          </p>
          
          {/* Legend */}
          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '15px', height: '15px', background: '#ff3333', marginRight: '10px', borderRadius: '50%' }}></div>
              <span>Injury Event</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '15px', height: '15px', background: '#ff33ff', marginRight: '10px', borderRadius: '50%' }}></div>
              <span>PT Session</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '15px', height: '15px', background: '#33ff99', marginRight: '10px', borderRadius: '50%' }}></div>
              <span>Assessment</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '15px', height: '15px', background: '#ffaa33', marginRight: '10px', borderRadius: '50%' }}></div>
              <span>Intervention</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '15px', height: '15px', background: '#6666ff', marginRight: '10px', borderRadius: '50%' }}></div>
              <span>Rest Period</span>
            </div>
          </div>
          <p style={{ marginTop: '15px', fontSize: '11px', color: '#666' }}>
            Height = Pain level (lower is better)
          </p>
          
          {/* Management Buttons */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #ff33ff, #aa22cc)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(255, 51, 255, 0.3)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ff55ff, #cc44ee)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 51, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ff33ff, #aa22cc)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 51, 255, 0.3)';
              }}
            >
              + Add Update
            </button>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={exportTimeline}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'linear-gradient(135deg, #4488ff, #2266dd)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(68, 136, 255, 0.3)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #5599ff, #3377ee)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(68, 136, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #4488ff, #2266dd)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(68, 136, 255, 0.3)';
                }}
              >
                Export
              </button>
              
              <label style={{ flex: 1 }}>
                <input
                  type="file"
                  accept=".json"
                  onChange={importTimeline}
                  style={{ display: 'none' }}
                />
                <div style={{
                  padding: '10px',
                  background: 'linear-gradient(135deg, #4488ff, #2266dd)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(68, 136, 255, 0.3)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #5599ff, #3377ee)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(68, 136, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #4488ff, #2266dd)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(68, 136, 255, 0.3)';
                }}>
                  Import
                </div>
              </label>
            </div>
            
            <button
              onClick={resetTimeline}
              style={{
                padding: '6px',
                background: '#ff3333',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              Reset to Default
            </button>
            
            <button
              onClick={clearTimeline}
              style={{
                padding: '6px',
                background: '#ffaa33',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '10px',
              }}
            >
              🆕 Start Fresh Timeline
            </button>
          </div>
          
          {/* Achievements Panel */}
          {timelineData.filter(e => e.isMilestone).length > 0 && (
            <div style={{
              marginTop: '15px',
              padding: '12px',
              background: 'rgba(255, 221, 85, 0.1)',
              borderRadius: '5px',
              border: '1px solid rgba(255, 221, 85, 0.3)',
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#ffdd55', fontWeight: 'bold' }}>
                🏆 Milestones Achieved
              </h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '6px',
                maxHeight: '200px',
                overflowY: 'auto',
                paddingRight: '5px'
              }}>
                {timelineData.filter(e => e.isMilestone).map((event) => {
                  const tierColors = {
                    1: '#aaaaaa',
                    2: '#ffffaa',
                    3: '#ffdd55',
                    4: '#ff88ff',
                    5: '#ff00ff',
                    6: '#ff0088',
                  };
                  const typeIcons = {
                    'stability': '🛡️',
                    'mobility': '🦵',
                    'brace': '🧱',
                    'mobility-brace': '💪',
                    'impact': '💥',
                    'sport-skill': '🤼',
                    'contact': '⚡',
                  };
                  
                  const tier = event.milestone?.tier || 1;
                  const type = event.milestone?.type || 'stability';
                  const label = event.milestone?.label || event.title;
                  const icon = typeIcons[type] || '✓';
                  const color = tierColors[tier] || '#aaaaaa';
                  
                  return (
                    <button
                      key={event.id}
                      onClick={() => {
                        const idx = timelineData.findIndex(e => e.id === event.id);
                        if (idx !== -1) {
                          setSelectedIndex(idx);
                          setSelectedEvent(event);
                          setSelectedEventId(event.id);
                          selectedIndexRef.current = idx;
                          isRotatingRef.current = false;
                        }
                      }}
                      style={{
                        padding: '8px',
                        background: selectedEventId === event.id 
                          ? 'rgba(255, 221, 85, 0.2)' 
                          : 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${color}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 221, 85, 0.15)';
                        e.currentTarget.style.transform = 'translateX(3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = selectedEventId === event.id 
                          ? 'rgba(255, 221, 85, 0.2)' 
                          : 'rgba(0, 0, 0, 0.3)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>{icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '11px', color: color, fontWeight: 'bold' }}>
                          Tier {tier}
                        </div>
                        <div style={{ fontSize: '10px', color: '#ccc', marginTop: '2px' }}>
                          {label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Event Detail Panel */}
      {selectedEvent && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            maxWidth: '350px',
            width: 'calc(100vw - 40px)',
            maxHeight: 'calc(100vh - 40px)',
            overflowY: 'auto',
            background: 'rgba(10, 10, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '15px',
            borderRadius: '15px',
            color: 'white',
            zIndex: 100,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'slideIn 0.3s ease',
          }}
        >
          {selectedEvent.isMilestone && (
            <div style={{
              marginBottom: '10px',
              padding: '8px 12px',
              background: 'linear-gradient(135deg, rgba(255, 221, 85, 0.2), rgba(255, 170, 0, 0.2))',
              borderRadius: '8px',
              border: '1px solid rgba(255, 221, 85, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '20px' }}>🏆</span>
              <div>
                <div style={{ fontSize: '11px', color: '#ffdd55', fontWeight: 'bold' }}>
                  MILESTONE - Tier {selectedEvent.milestone?.tier || 1}
                </div>
                <div style={{ fontSize: '10px', color: '#ccc' }}>
                  {selectedEvent.milestone?.label || selectedEvent.title}
                </div>
              </div>
            </div>
          )}
          
          <h2 style={{ 
            margin: '0 0 6px 0', 
            fontSize: '21px', 
            color: selectedEvent.isMilestone ? '#ffdd55' : '#66aaff',
            fontWeight: '600',
            letterSpacing: '-0.3px',
          }}>
            {selectedEvent.title}
          </h2>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#999', fontWeight: '500' }}>
            {selectedEvent.date} (+{selectedEvent.hours}h)
          </p>
          <div
            style={{
              margin: '12px 0',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.6' }}>
              {selectedEvent.description}
            </p>
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', marginRight: '10px', color: '#aaa' }}>Pain Level:</span>
              <div
                style={{
                  flex: 1,
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(selectedEvent.pain / 10) * 100}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, #00ff00, #ffff00, #ff0000)`,
                    backgroundPosition: `${100 - (selectedEvent.pain / 10) * 100}% 0`,
                  }}
                ></div>
              </div>
              <span style={{ fontSize: '14px', marginLeft: '10px', fontWeight: 'bold' }}>
                {selectedEvent.pain}/10
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#bbb', margin: '10px 0 0 0', lineHeight: '1.5' }}>
              <strong style={{ color: '#ff33ff' }}>Functional Status:</strong><br />
              {selectedEvent.functional}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedEvent(null);
              setSelectedIndex(null);
              setSelectedEventId(null);
              selectedIndexRef.current = null;
              isRotatingRef.current = true;
            }}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              background: '#4488ff',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Close
          </button>
          
          {/* Navigation Arrows */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '15px',
            gap: '10px'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousEvent();
              }}
              disabled={selectedIndex === 0}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedIndex === 0 ? '#333' : '#ff33ff',
                border: 'none',
                borderRadius: '5px',
                color: selectedIndex === 0 ? '#666' : 'white',
                cursor: selectedIndex === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (selectedIndex !== 0) {
                  e.target.style.background = '#cc00cc';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIndex !== 0) {
                  e.target.style.background = '#ff33ff';
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>←</span>
              Previous
            </button>
            
            <div style={{
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '5px',
              fontSize: '12px',
              color: '#aaa',
              whiteSpace: 'nowrap'
            }}>
              {selectedIndex + 1} / {timelineData.length}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextEvent();
              }}
              disabled={selectedIndex === timelineData.length - 1}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedIndex === timelineData.length - 1 ? '#333' : '#ff33ff',
                border: 'none',
                borderRadius: '5px',
                color: selectedIndex === timelineData.length - 1 ? '#666' : 'white',
                cursor: selectedIndex === timelineData.length - 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (selectedIndex !== timelineData.length - 1) {
                  e.target.style.background = '#cc00cc';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIndex !== timelineData.length - 1) {
                  e.target.style.background = '#ff33ff';
                }
              }}
            >
              Next
              <span style={{ fontSize: '18px' }}>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Update Form */}
      {showAddForm && (
        <AddUpdateForm
          onClose={() => setShowAddForm(false)}
          onSubmit={addNewEvent}
          lastEvent={timelineData[timelineData.length - 1]}
        />
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
            width: 8px;
          }
          
          div::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }
          
          div::-webkit-scrollbar-thumb {
            background: rgba(255, 51, 255, 0.5);
            border-radius: 4px;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 51, 255, 0.7);
          }
          
          /* Mobile optimizations */
          @media (max-width: 768px) {
            body {
              font-size: 14px;
            }
          }
          
          @media (max-width: 480px) {
            h1 {
              font-size: 18px !important;
            }
            h2 {
              font-size: 16px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InjuryTimeline;
