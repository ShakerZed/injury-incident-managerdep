import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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
            }}
          />
        </div>

        {/* Milestone Checkbox */}
        <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255, 221, 85, 0.1)', borderRadius: '5px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.isMilestone}
              onChange={(e) => setFormData({ ...formData, isMilestone: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '13px', color: '#ffdd55', fontWeight: 'bold' }}>
              🏆 Mark as Milestone Achievement
            </span>
          </label>
        </div>

        {/* Milestone Fields (conditional) */}
        {formData.isMilestone && (
          <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255, 221, 85, 0.05)', borderRadius: '5px', border: '1px solid rgba(255, 221, 85, 0.3)' }}>
            <div style={{ marginBottom: '12px' }}>
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
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value="stability">🛡️ Stability (pain control)</option>
                <option value="mobility">🦵 Mobility (ROM restored)</option>
                <option value="brace">🧱 Bracing & Control</option>
                <option value="mobility-brace">💪 ROM + Core Control</option>
                <option value="impact">💥 Return to Impact</option>
                <option value="sport-skill">🤼 Sport-Specific Skills</option>
                <option value="contact">⚡ Return to Contact</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ffdd55', fontSize: '12px' }}>
                Milestone Tier (1-6): {formData.milestoneTier}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={formData.milestoneTier}
                onChange={(e) => setFormData({ ...formData, milestoneTier: e.target.value })}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#888', marginTop: '4px' }}>
                <span>Minor</span>
                <span>Medium</span>
                <span>Major</span>
                <span>Legendary</span>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', color: '#ffdd55', fontSize: '12px' }}>
                Achievement Label (optional)
              </label>
              <input
                type="text"
                value={formData.milestoneLabel}
                onChange={(e) => setFormData({ ...formData, milestoneLabel: e.target.value })}
                placeholder="e.g., 'Pain-free toe touch' or leave blank to use title"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '5px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              background: '#333',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '10px',
              background: '#ff33ff',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Add Update
          </button>
        </div>
      </form>
    </div>
  );
};

const InjuryTimeline = () => {
  const mountRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Use refs for animation state to avoid rebuilding scene
  const isRotatingRef = useRef(true);
  const selectedIndexRef = useRef(null);
  const hoveredIndexRef = useRef(null);
  
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const eventSpheresRef = useRef([]);
  const spherePositionsRef = useRef([]);
  const milestoneBurstsRef = useRef([]);
  const targetCameraPosition = useRef(new THREE.Vector3(0, 5, 15));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

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

  // Trigger milestone burst VFX
  const triggerMilestoneBurst = (scene, position, tier = 1) => {
    const group = new THREE.Group();
    group.position.copy(position);

    const disposables = { geometries: [], materials: [], textures: [] };

    // Color and intensity based on tier
    const tierColors = [0xaaaaaa, 0xffffaa, 0xffffaa, 0xffdd55, 0xff88ff, 0xff00ff];
    const color = tierColors[Math.min(tier, tierColors.length - 1)];
    const intensity = 0.5 + (tier * 0.15);
    
    // Beam: vertical light column
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

    // Ring pulse (tier 2+)
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

    // Spark burst
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

  // Timeline data - moved outside useEffect for navigation access
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

  // Save to localStorage whenever timeline data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('injuryTimelineData', JSON.stringify(timelineData));
    }
  }, [timelineData]);

  // Restore selection after timeline data changes (by stable ID)
  useEffect(() => {
    if (selectedEventId) {
      const newIndex = timelineData.findIndex(event => event.id === selectedEventId);
      if (newIndex !== -1) {
        setSelectedIndex(newIndex);
        setSelectedEvent(timelineData[newIndex]);
        selectedIndexRef.current = newIndex;
      } else {
        // Event was deleted, clear selection
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

    // Reset refs to prevent duplicates in React 18 Strict Mode
    eventSpheresRef.current = [];
    spherePositionsRef.current = [];

    // Scene setup - ONLY RUNS ONCE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      1, // Will be set properly below
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(Math.min(dpr, 2));
    rendererRef.current = renderer;
    
    // Set initial size from container rect (not window)
    const { width, height } = mountRef.current.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x4488ff, 0.5, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Create timeline path
    const eventSpheres = [];

    // Reuse geometry and cache materials for performance
    const sharedSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sharedGlowGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    
    // Milestone geometries (different shapes for visual distinction)
    const milestoneGeometry = new THREE.OctahedronGeometry(0.35, 0);
    const milestoneGlowGeometry = new THREE.OctahedronGeometry(0.42, 0);
    
    const materialCache = {};

    const getMaterial = (color, isMilestone = false) => {
      const key = `${color}_${isMilestone}`;
      if (!materialCache[key]) {
        materialCache[key] = new THREE.MeshPhongMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: isMilestone ? 0.5 : 0.3,
          shininess: isMilestone ? 150 : 100,
          transparent: true,
          opacity: 1.0,
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
          opacity: isMilestone ? 0.3 : 0.2,
        });
      }
      return materialCache[glowKey];
    };

    timelineData.forEach((event, index) => {
      const denom = Math.max(1, timelineData.length - 1);
      const t = index / denom;
      const angle = t * Math.PI * 2;
      const radius = 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (10 - event.pain) * 0.5 - 2;

      // Color based on type (milestone events get golden tint)
      let color;
      if (event.isMilestone) {
        color = 0xffdd55; // Golden for milestones
      } else {
        switch (event.type) {
          case 'injury':
            color = 0xff3333;
            break;
          case 'intervention':
            color = 0xffaa33;
            break;
          case 'rest':
            color = 0x6666ff;
            break;
          case 'assessment':
            color = 0x33ff99;
            break;
          case 'pt':
            color = 0xff33ff;
            break;
          default:
            color = 0xffffff;
        }
      }

      // Create sphere for event using appropriate geometry and material
      const geometry = event.isMilestone ? milestoneGeometry : sharedSphereGeometry;
      const glowGeometry = event.isMilestone ? milestoneGlowGeometry : sharedGlowGeometry;
      const material = getMaterial(color, event.isMilestone);
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      sphere.userData = { event, index, baseColor: color };
      scene.add(sphere);
      eventSpheres.push(sphere);
      
      // Store in ref for persistent access
      eventSpheresRef.current.push(sphere);
      
      // Store position for camera targeting
      spherePositionsRef.current.push(new THREE.Vector3(x, y, z));

      // Create glow effect using cached glow material
      const glowMaterial = getGlowMaterial(color, event.isMilestone);
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(sphere.position);
      scene.add(glow);
      
      // Add rotating halo ring for milestones
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

      // Create connection line to next point (reuse denom for consistency)
      if (index < timelineData.length - 1) {
        const nextT = (index + 1) / denom;
        const nextAngle = nextT * Math.PI * 2;
        const nextX = Math.cos(nextAngle) * radius;
        const nextZ = Math.sin(nextAngle) * radius;
        const nextY = (10 - timelineData[index + 1].pain) * 0.5 - 2;

        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, y, z),
          new THREE.Vector3(nextX, nextY, nextZ),
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x4488ff,
          linewidth: 2, // Note: linewidth is ignored on most platforms; consider Line2 for thick lines
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      }
    });

    // Create central axis
    const axisGeometry = new THREE.CylinderGeometry(0.05, 0.05, 10, 32);
    const axisMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      emissive: 0x111111,
    });
    const axis = new THREE.Mesh(axisGeometry, axisMaterial);
    axis.position.y = 0;
    scene.add(axis);
    
    // Add "START" marker at first event
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

    // Pain level indicator rings with labels
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
      
      // Add text labels at key pain levels (0, 5, 10)
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

    // Mouse interaction - scoped to canvas with proper rect mapping
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
        
        // Trigger milestone burst VFX if this is a milestone
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
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('pointerdown', onCanvasPointer);
    renderer.domElement.addEventListener('pointermove', onCanvasMove);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate camera around scene or smoothly move to target
      if (isRotatingRef.current) {
        camera.position.x = Math.cos(time * 0.3) * 15;
        camera.position.z = Math.sin(time * 0.3) * 15;
        camera.position.y = 5; // Fixed Y for horizontal orbit; adjust if vertical orbit needed
        camera.lookAt(0, 0, 0);
        currentLookAt.current.set(0, 0, 0);
      } else {
        // Smooth camera transition to target
        camera.position.lerp(targetCameraPosition.current, 0.1);
        
        // Fix: Actually lerp the lookAt target
        currentLookAt.current.lerp(targetLookAt.current, 0.1);
        camera.lookAt(currentLookAt.current);
      }

      // Pulse and highlight event spheres
      eventSpheres.forEach((sphere, index) => {
        const isSelected = selectedIndexRef.current === index;
        const isHovered = hoveredIndexRef.current === index;
        const isMilestone = sphere.userData.event.isMilestone;
        
        // Pulsing effect (milestones pulse slower and subtler)
        const pulseSpeed = isMilestone ? 1.5 : 2;
        const pulseAmount = isMilestone ? 0.05 : 0.1;
        const basePulse = Math.sin(time * pulseSpeed + index * 0.5) * pulseAmount;
        
        if (isSelected) {
          // Selected: larger, brighter, no pulse
          const baseScale = isMilestone ? 1.3 : 1.3;
          sphere.scale.set(baseScale, baseScale, baseScale);
          sphere.material.emissiveIntensity = isMilestone ? 0.8 : 0.6;
        } else if (isHovered) {
          // Hovered: slightly larger, brighter
          const baseScale = isMilestone ? 1.25 : 1.2;
          sphere.scale.set(baseScale, baseScale, baseScale);
          sphere.material.emissiveIntensity = isMilestone ? 0.7 : 0.5;
        } else {
          // Default: pulse normally
          const baseScale = isMilestone ? 1.1 : 1.0;
          const scale = baseScale + basePulse;
          sphere.scale.set(scale, scale, scale);
          sphere.material.emissiveIntensity = isMilestone ? 0.5 : 0.3;
        }
        
        // Dim non-selected spheres when something is selected (only change opacity)
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

      // Update milestone bursts
      const now = performance.now();
      milestoneBurstsRef.current = milestoneBurstsRef.current.filter((b) => {
        const t = (now - b.start) / b.duration;

        if (t >= 1) {
          // Remove and dispose
          scene.remove(b.group);
          b.disposables.geometries.forEach((g) => g.dispose());
          b.disposables.materials.forEach((m) => m.dispose());
          b.disposables.textures.forEach((tx) => tx.dispose());
          return false;
        }

        // Easing
        const easeOut = 1 - Math.pow(1 - t, 3);

        // Beam: fade in fast, fade out later
        const beamFade = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
        b.beam.material.opacity = Math.max(0, beamFade) * 0.9;
        b.beam.scale.x = 1.2 + easeOut * 1.0;
        b.beam.scale.y = 7.0 + easeOut * 3.0;

        // Ring: expand and fade (if exists)
        if (b.ring) {
          b.ring.material.opacity = (1 - t) * 0.8;
          const s = 1 + easeOut * 8;
          b.ring.scale.set(s, s, s);
        }

        // Sparks: integrate velocity, fade
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

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const { width, height } = mountRef.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Call once after mount to handle immediate layout shifts
    handleResize();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('pointerdown', onCanvasPointer);
      renderer.domElement.removeEventListener('pointermove', onCanvasMove);
      window.removeEventListener('resize', handleResize);
      
      // Use Sets to track disposed resources and avoid double-disposal
      const disposedGeometries = new Set();
      const disposedMaterials = new Set();
      const disposedTextures = new Set();
      
      scene.traverse((obj) => {
        // Dispose geometry once
        const geo = obj.geometry;
        if (geo && !disposedGeometries.has(geo)) {
          disposedGeometries.add(geo);
          geo.dispose();
        }
        
        // Dispose material(s) and textures once
        const disposeMat = (mat) => {
          if (!mat || disposedMaterials.has(mat)) return;
          disposedMaterials.add(mat);
          
          // Dispose texture if present
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
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [timelineData]); // Rebuild when timeline data changes

  // Focus camera on selected event
  useEffect(() => {
    if (selectedIndex !== null && spherePositionsRef.current[selectedIndex] && cameraRef.current) {
      const spherePos = spherePositionsRef.current[selectedIndex];
      
      // Calculate camera position: offset from sphere to get good viewing angle
      const offset = new THREE.Vector3();
      offset.copy(spherePos).normalize().multiplyScalar(6); // Distance from sphere
      offset.y += 2; // Raise camera slightly
      
      const newCameraPos = new THREE.Vector3();
      newCameraPos.addVectors(spherePos, offset);
      
      targetCameraPosition.current.copy(newCameraPos);
      targetLookAt.current.copy(spherePos);
      
      // Update refs
      selectedIndexRef.current = selectedIndex;
      isRotatingRef.current = false;
    } else if (selectedIndex === null) {
      // Reset to orbit view
      isRotatingRef.current = true;
      selectedIndexRef.current = null;
    }
  }, [selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!selectedEvent) return;
      
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        goToPreviousEvent();
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        goToNextEvent();
      } else if (event.key === 'Escape') {
        setSelectedEvent(null);
        setSelectedIndex(null);
        setSelectedEventId(null);
        selectedIndexRef.current = null;
        isRotatingRef.current = true;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedEvent, selectedIndex]);

  // Navigation functions
  const goToPreviousEvent = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      setSelectedEvent(timelineData[newIndex]);
      setSelectedEventId(timelineData[newIndex].id);
      selectedIndexRef.current = newIndex;
    }
  };

  const goToNextEvent = () => {
    if (selectedIndex < timelineData.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      setSelectedEvent(timelineData[newIndex]);
      setSelectedEventId(timelineData[newIndex].id);
      selectedIndexRef.current = newIndex;
    }
  };

  // Timeline management functions
  const addNewEvent = (newEvent) => {
    // Generate stable ID from hours and title
    const safeTitle = newEvent.title.replace(/[^a-zA-Z0-9]/g, '_');
    const eventWithId = {
      ...newEvent,
      id: `${newEvent.hours}-${safeTitle}`,
    };
    const updatedTimeline = [...timelineData, eventWithId].sort((a, b) => a.hours - b.hours);
    setTimelineData(updatedTimeline);
    setShowAddForm(false);
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
          setTimelineData(imported);
        } catch (error) {
          alert('Error importing timeline: Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetTimeline = () => {
    if (confirm('Reset to default timeline? This will erase all your custom data.')) {
      setTimelineData(initialTimelineData);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('injuryTimelineData');
      }
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Info Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '400px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#ff33ff' }}>
          Injury Recovery Timeline
        </h1>
        <div style={{ marginBottom: '10px', padding: '8px', background: 'rgba(255, 51, 255, 0.1)', borderRadius: '5px' }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#ff33ff' }}>
            <strong>{timelineData.length} events</strong> tracked over <strong>{Math.round(timelineData[timelineData.length - 1]?.hours || 0)}h</strong>
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#aaa' }}>
            Pain: {timelineData[0]?.pain}/10 → {timelineData[timelineData.length - 1]?.pain}/10 
            ({Math.round((1 - timelineData[timelineData.length - 1]?.pain / timelineData[0]?.pain) * 100)}% improvement)
          </p>
        </div>
        <p style={{ margin: '5px 0', fontSize: '14px', color: '#aaa' }}>
          Track your recovery progress in 3D. Click events to view details.
        </p>
        <p style={{ margin: '5px 0 15px 0', fontSize: '12px', color: '#666' }}>
          Arrow keys navigate events. ESC to close. Export to save or share your timeline.
        </p>
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
              padding: '10px',
              background: '#ff33ff',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold',
            }}
          >
            + Add Update
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={exportTimeline}
              style={{
                flex: 1,
                padding: '8px',
                background: '#4488ff',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '11px',
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
                padding: '8px',
                background: '#4488ff',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '11px',
                textAlign: 'center',
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
        </div>
        
        {/* Quick Instructions */}
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: 'rgba(68, 136, 255, 0.1)', 
          borderRadius: '5px',
          border: '1px solid rgba(68, 136, 255, 0.3)'
        }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', color: '#4488ff' }}>
            💡 For Others to Use:
          </p>
          <p style={{ margin: '0', fontSize: '10px', color: '#aaa', lineHeight: '1.4' }}>
            1. Click "Add Update" to log progress<br/>
            2. Export timeline to save your data<br/>
            3. Share the exported file with others<br/>
            4. They can Import to view your recovery<br/>
            <span style={{ fontSize: '9px', color: '#666' }}>📦 Auto-saved to browser</span>
          </p>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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

      {/* Event Detail Panel */}
      {selectedEvent && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '400px',
            backdropFilter: 'blur(10px)',
            border: selectedEvent.isMilestone 
              ? '2px solid rgba(255, 221, 85, 0.6)' 
              : '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: selectedEvent.isMilestone
              ? '0 0 20px rgba(255, 221, 85, 0.3)'
              : 'none',
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {selectedEvent.isMilestone && (
            <div style={{
              marginBottom: '12px',
              padding: '8px 12px',
              background: 'rgba(255, 221, 85, 0.2)',
              borderRadius: '5px',
              border: '1px solid rgba(255, 221, 85, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '20px' }}>
                {selectedEvent.milestone?.type === 'stability' && '🛡️'}
                {selectedEvent.milestone?.type === 'mobility' && '🦵'}
                {selectedEvent.milestone?.type === 'brace' && '🧱'}
                {selectedEvent.milestone?.type === 'mobility-brace' && '💪'}
                {selectedEvent.milestone?.type === 'impact' && '💥'}
                {selectedEvent.milestone?.type === 'sport-skill' && '🤼'}
                {selectedEvent.milestone?.type === 'contact' && '⚡'}
                {!selectedEvent.milestone?.type && '🏆'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', color: '#ffdd55', fontWeight: 'bold' }}>
                  MILESTONE - Tier {selectedEvent.milestone?.tier || 1}
                </div>
                <div style={{ fontSize: '11px', color: '#ffffaa', marginTop: '2px' }}>
                  {selectedEvent.milestone?.label}
                </div>
              </div>
            </div>
          )}
          
          <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', color: selectedEvent.isMilestone ? '#ffdd55' : '#4488ff' }}>
            {selectedEvent.title}
          </h2>
          <p style={{ margin: '5px 0', fontSize: '12px', color: '#888' }}>
            {selectedEvent.date} (+{selectedEvent.hours}h)
          </p>
          <div
            style={{
              margin: '10px 0',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '5px',
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
        `}
      </style>
    </div>
  );
};

export default InjuryTimeline;
