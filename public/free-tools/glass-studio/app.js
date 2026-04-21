/**
 * Luxe Glass & Pattern Studio - app.js
 * Core engine for real-time glassmorphism and SVG pattern generation.
 */

const STATE = {
    glass: {
        blur: 20,
        opacity: 0.1,
        tint: '#ffffff',
        border: 1,
        shadow: 30
    },
    patterns: {
        noise: 0.15,
        points: [
            { id: 1, x: 20, y: 30, color: '#FFB382' },
            { id: 2, x: 80, y: 20, color: '#FF7B54' },
            { id: 3, x: 50, y: 80, color: '#C9A35F' }
        ]
    }
};

const PRESETS = {
    desert: {
        glass: { blur: 24, opacity: 0.08, tint: '#ffffff', border: 1, shadow: 40 },
        patterns: { noise: 0.12, points: [
            { id: Date.now()+1, x: 10, y: 20, color: '#FFD194' },
            { id: Date.now()+2, x: 90, y: 30, color: '#D1913C' },
            { id: Date.now()+3, x: 40, y: 70, color: '#FFB382' }
        ]}
    },
    midnight: {
        glass: { blur: 40, opacity: 0.05, tint: '#121216', border: 1, shadow: 20 },
        patterns: { noise: 0.08, points: [
            { id: Date.now()+4, x: 20, y: 20, color: '#121216' },
            { id: Date.now()+5, x: 80, y: 80, color: '#2E5090' },
            { id: Date.now()+6, x: 50, y: 50, color: '#1A1A1E' }
        ]}
    },
    opal: {
        glass: { blur: 16, opacity: 0.15, tint: '#E29587', border: 2, shadow: 50 },
        patterns: { noise: 0.25, points: [
            { id: Date.now()+7, x: 30, y: 20, color: '#D4E2D4' },
            { id: Date.now()+8, x: 70, y: 40, color: '#E29587' },
            { id: Date.now()+9, x: 50, y: 80, color: '#FFF5E4' }
        ]}
    },
    vanta: {
        glass: { blur: 64, opacity: 0.2, tint: '#050507', border: 1, shadow: 10 },
        patterns: { noise: 0.05, points: [
            { id: Date.now()+10, x: 0, y: 0, color: '#050507' },
            { id: Date.now()+11, x: 100, y: 100, color: '#1A1A1E' },
            { id: Date.now()+12, x: 50, y: 50, color: '#0A0A0C' }
        ]}
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const glassCard = document.getElementById('glass-card');
    const patternLayer = document.getElementById('pattern-layer');
    const noiseLayer = document.getElementById('noise-layer');
    const meshPointsContainer = document.getElementById('mesh-points');
    const meshControlsList = document.getElementById('mesh-controls-list');
    const cssOutput = document.getElementById('css-output');
    const svgOutput = document.getElementById('svg-output');
    const drawer = document.getElementById('code-drawer');
    const toast = document.getElementById('toast');

    // Initialize
    initUI();
    renderAll();

    // --- Core Rendering Functions ---

    function renderAll() {
        renderGlass();
        renderBackground();
        updateCode();
    }

    function renderGlass() {
        const { blur, opacity, tint, border, shadow } = STATE.glass;
        
        // Convert tint to RGBA
        const rgba = hexToRgba(tint, opacity);
        
        glassCard.style.backdropFilter = `blur(${blur}px) saturate(180%)`;
        glassCard.style.webkitBackdropFilter = `blur(${blur}px) saturate(180%)`;
        glassCard.style.backgroundColor = rgba;
        glassCard.style.borderWidth = `${border}px`;
        glassCard.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, ${shadow / 100})`;
    }

    function renderBackground() {
        const { noise, points } = STATE.patterns;
        
        // Update Noise
        noiseLayer.style.opacity = noise;

        // Generate Mesh Gradient SVG
        let svgMesh = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">`;
        svgMesh += `<defs>`;
        points.forEach((p, index) => {
            svgMesh += `
            <radialGradient id="grad-${p.id}" cx="${p.x}%" cy="${p.y}%" r="60%">
                <stop offset="0%" stop-color="${p.color}" stop-opacity="0.8" />
                <stop offset="100%" stop-color="${p.color}" stop-opacity="0" />
            </radialGradient>`;
        });
        svgMesh += `</defs>`;
        
        // Solid black base
        svgMesh += `<rect width="100%" height="100%" fill="#050507" />`;
        
        // Apply gradients
        points.forEach(p => {
            svgMesh += `<rect width="100%" height="100%" fill="url(#grad-${p.id})" />`;
        });
        svgMesh += `</svg>`;

        // Apply to background layer
        const encodedSvg = btoa(svgMesh);
        patternLayer.style.backgroundImage = `url('data:image/svg+xml;base64,${encodedSvg}')`;

        // Sync Draggable Points on Stage
        renderPointsOnStage();
        renderPointControls();
    }

    function renderPointsOnStage() {
        meshPointsContainer.innerHTML = '';
        STATE.patterns.points.forEach(p => {
            const pointEl = document.createElement('div');
            pointEl.className = 'mesh-point';
            pointEl.style.left = `${p.x}%`;
            pointEl.style.top = `${p.y}%`;
            pointEl.style.backgroundColor = p.color;
            pointEl.dataset.id = p.id;

            // Simple Drag Logic
            pointEl.onmousedown = (e) => {
                e.preventDefault();
                const stage = document.getElementById('stage');
                const rect = stage.getBoundingClientRect();

                function move(e) {
                    let lx = ((e.clientX - rect.left) / rect.width) * 100;
                    let ly = ((e.clientY - rect.top) / rect.height) * 100;
                    lx = Math.max(0, Math.min(100, lx));
                    ly = Math.max(0, Math.min(100, ly));
                    
                    p.x = lx;
                    p.y = ly;
                    pointEl.style.left = `${lx}%`;
                    pointEl.style.top = `${ly}%`;
                    renderBackground();
                    updateCode();
                }

                function stop() {
                    window.removeEventListener('mousemove', move);
                    window.removeEventListener('mouseup', stop);
                }

                window.addEventListener('mousemove', move);
                window.addEventListener('mouseup', stop);
            };

            meshPointsContainer.appendChild(pointEl);
        });
    }

    function renderPointControls() {
        meshControlsList.innerHTML = '';
        STATE.patterns.points.forEach((p, i) => {
            const row = document.createElement('div');
            row.className = 'control-group';
            row.style.borderLeft = `3px solid ${p.color}`;
            row.style.paddingLeft = '10px';
            row.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                    <span style="font-size:0.7rem; color:var(--ivory-muted)">Point ${i+1}</span>
                    <button class="delete-point" data-id="${p.id}" style="background:none; border:none; color:#f44; cursor:pointer; font-size:0.7rem;">×</button>
                </div>
                <input type="color" value="${p.color}" class="point-color-picker" data-id="${p.id}">
            `;
            meshControlsList.appendChild(row);
        });

        // Add Listeners to the new controls
        document.querySelectorAll('.point-color-picker').forEach(input => {
            input.oninput = (e) => {
                const point = STATE.patterns.points.find(p => p.id == e.target.dataset.id);
                if (point) {
                    point.color = e.target.value;
                    renderBackground();
                }
            };
        });

        document.querySelectorAll('.delete-point').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.dataset.id;
                STATE.patterns.points = STATE.patterns.points.filter(p => p.id != id);
                renderBackground();
            };
        });
    }

    function updateCode() {
        const { blur, opacity, tint, border, shadow } = STATE.glass;
        const rgba = hexToRgba(tint, opacity);
        
        // CSS Output
        const css = `.glass-element {
    background: ${rgba};
    backdrop-filter: blur(${blur}px) saturate(180%);
    -webkit-backdrop-filter: blur(${blur}px) saturate(180%);
    border-radius: 32px;
    border: ${border}px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, ${shadow / 100});
}`;
        cssOutput.textContent = css;

        // SVG Output (Simplified for display)
        const svgRaw = patternLayer.style.backgroundImage.replace('url("data:image/svg+xml;base64,', '').replace('")', '');
        svgOutput.textContent = atob(svgRaw);
    }

    // --- UI Logic ---

    function initUI() {
        // Tab Switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`panel-${btn.dataset.tab}`).classList.add('active');
            };
        });

        // Glass Inputs
        linkInput('blur', (v) => { STATE.glass.blur = v; renderAll(); });
        linkInput('opacity', (v) => { STATE.glass.opacity = v; renderAll(); });
        linkInput('tint', (v) => { STATE.glass.tint = v; renderAll(); });
        linkInput('border', (v) => { STATE.glass.border = v; renderAll(); });
        linkInput('shadow', (v) => { STATE.glass.shadow = v; renderAll(); });

        // Pattern Inputs
        linkInput('noise', (v) => { STATE.patterns.noise = v; renderAll(); });

        // Add Point
        document.getElementById('add-point').onclick = () => {
            STATE.patterns.points.push({
                id: Date.now(),
                x: 40 + Math.random() * 20,
                y: 40 + Math.random() * 20,
                color: '#c9a35f'
            });
            renderBackground();
        };

        // Randomize
        document.getElementById('randomize').onclick = () => {
            STATE.patterns.points.forEach(p => {
                p.x = Math.random() * 100;
                p.y = Math.random() * 100;
            });
            renderBackground();
        };

        // Presets
        document.querySelectorAll('.preset-card').forEach(card => {
            card.onclick = () => {
                const preset = PRESETS[card.dataset.preset];
                if (preset) {
                    STATE.glass = { ...preset.glass };
                    STATE.patterns = { ...preset.patterns };
                    syncInputsToState();
                    renderAll();
                }
            };
        });

        // Drawer Toggle
        document.getElementById('toggle-drawer').onclick = () => {
            drawer.classList.toggle('open');
        };

        // Copy Buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.onclick = () => {
                const type = btn.dataset.copy;
                const text = type === 'glass' ? cssOutput.textContent : svgOutput.textContent;
                navigator.clipboard.writeText(text);
                showToast();
            };
        });
    }

    function linkInput(id, callback) {
        const input = document.getElementById(`input-${id}`);
        const display = document.getElementById(`val-${id}`);
        input.oninput = (e) => {
            const val = e.target.value;
            if (display) display.textContent = (id === 'opacity') ? val : (id === 'blur' || id === 'border') ? val + 'px' : val + '%';
            callback(val);
        };
    }

    function syncInputsToState() {
        // Sync sliders and color pickers after a preset load
        Object.keys(STATE.glass).forEach(key => {
            const el = document.getElementById(`input-${key}`);
            if (el) el.value = STATE.glass[key];
            const disp = document.getElementById(`val-${key}`);
            if (disp) disp.textContent = STATE.glass[key] + (key === 'blur' ? 'px' : '');
        });
        document.getElementById('input-noise').value = STATE.patterns.noise;
        document.getElementById('val-noise').textContent = STATE.patterns.noise;
    }

    // --- Helpers ---

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function showToast() {
        toast.hidden = false;
        setTimeout(() => toast.hidden = true, 2000);
    }
});
