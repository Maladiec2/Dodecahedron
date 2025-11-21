/**
 * Harmonic Tuner Logic
 * Handles the interactive rotary knobs and resonance meter.
 */

class RotaryKnob {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.warn(`RotaryKnob: Element ${elementId} not found`);
            return;
        }

        this.display = document.getElementById(elementId.replace('knob', 'disp'));
        this.ringValue = this.element.querySelector('.knob-ring-value');

        this.param = this.element.dataset.param;
        this.min = parseFloat(this.element.dataset.min);
        this.max = parseFloat(this.element.dataset.max);
        this.step = parseFloat(this.element.dataset.step);
        this.value = parseFloat(this.element.dataset.value);

        this.isDragging = false;
        this.startY = 0;
        this.startValue = 0;

        this.init();
    }

    init() {
        this.updateVisuals();

        // Mouse Events
        this.element.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startY = e.clientY;
            this.startValue = this.value;
            document.body.style.cursor = 'ns-resize';

            // Visual feedback
            this.element.style.transform = 'scale(0.95)';

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const deltaY = this.startY - e.clientY; // Drag up to increase
            const range = this.max - this.min;
            const sensitivity = 200; // Pixels for full range

            let newValue = this.startValue + (deltaY / sensitivity) * range;

            // Snap to step
            newValue = Math.round(newValue / this.step) * this.step;

            // Clamp
            newValue = Math.max(this.min, Math.min(this.max, newValue));

            if (newValue !== this.value) {
                this.value = newValue;
                this.updateVisuals();
                this.emitChange();
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                document.body.style.cursor = 'default';
                this.element.style.transform = 'scale(1)';
            }
        });
    }

    updateVisuals() {
        // Update display text
        if (this.display) {
            this.display.textContent = this.value.toFixed(1);
        }

        // Update ring arc
        if (this.ringValue) {
            const range = this.max - this.min;
            const percent = (this.value - this.min) / range;

            // Circumference is approx 220 (2 * PI * 35) - adjusted for new size
            const circumference = 220;
            const offset = circumference - (percent * circumference);

            this.ringValue.style.strokeDashoffset = offset;

            // Color shift based on value
            // 160 (Teal) to 100 (Green)
            const hue = 160 - (percent * 60);
            this.ringValue.style.stroke = `hsl(${hue}, 100%, 50%)`;

            // Add glow effect
            this.ringValue.style.filter = `drop-shadow(0 0 5px hsl(${hue}, 100%, 50%))`;
        }

        // Rotate the knob itself slightly for realism
        const rotationRange = 270; // degrees
        const rotation = -135 + (((this.value - this.min) / (this.max - this.min)) * rotationRange);
        this.element.style.transform = `rotate(${rotation}deg)`;
    }

    emitChange() {
        // Update Quannex
        if (window.Quannex && window.Quannex.updateTuning) {
            window.Quannex.updateTuning(this.param, this.value);

            // Trigger visual refresh
            if (window.refreshVisualization) {
                window.refreshVisualization();
            }

            // Update meter
            if (window.updateResonanceMeter) {
                window.updateResonanceMeter();
            }
        }
    }
}

// Global function to update meter
window.updateResonanceMeter = function () {
    if (!window.Quannex) return;

    const state = window.Quannex.getState();
    const coherence = state.globalCoherence || 0;

    const needle = document.getElementById('meterNeedle');
    const valueDisplay = document.getElementById('meterValue');

    if (!needle || !valueDisplay) return;

    // Map 0-1 to -45deg to +45deg
    const angle = (coherence * 90) - 45;

    needle.style.transform = `rotate(${angle}deg)`;
    valueDisplay.textContent = `${(coherence * 100).toFixed(1)}%`;

    // Visual feedback
    if (coherence > 0.8) {
        needle.classList.add('tuned');
        valueDisplay.style.color = '#00ffcc';
        valueDisplay.style.textShadow = '0 0 10px #00ffcc';
    } else {
        needle.classList.remove('tuned');
        valueDisplay.style.color = '#fff';
        valueDisplay.style.textShadow = 'none';
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Harmonic Tuner] 🎸 Initializing...');

    // Initialize Knobs
    const knobs = [];
    ['Alpha', 'Beta', 'Gamma', 'Delta', 'Kappa'].forEach(name => {
        const knob = new RotaryKnob(`knob${name}`);
        knobs.push(knob);
    });

    // Toggle Panel Logic
    const tunerPanel = document.getElementById('harmonicTuner');
    const tunerToggle = document.getElementById('tunerToggle');
    let isTunerVisible = false;

    if (tunerToggle && tunerPanel) {
        tunerToggle.addEventListener('click', () => {
            isTunerVisible = !isTunerVisible;
            if (isTunerVisible) {
                tunerPanel.classList.add('visible');
                tunerToggle.textContent = '▼ Hide Console';
                tunerToggle.style.animation = 'none'; // Stop pulsing when open
            } else {
                tunerPanel.classList.remove('visible');
                tunerToggle.textContent = '▲ Harmonic Tuner';
            }
        });
    }

    // Tooltip Logic
    const tooltip = document.getElementById('tunerTooltip');
    if (tooltip) {
        const tooltipTitle = tooltip.querySelector('.tooltip-title');
        const tooltipDesc = tooltip.querySelector('.tooltip-desc');

        document.querySelectorAll('.info-icon').forEach(icon => {
            icon.addEventListener('mouseenter', (e) => {
                const title = e.target.dataset.title;
                const desc = e.target.dataset.desc;

                tooltipTitle.textContent = title;
                tooltipDesc.textContent = desc;

                // Position tooltip above the icon
                const rect = e.target.getBoundingClientRect();
                const tunerRect = tunerPanel.getBoundingClientRect();

                // Calculate position relative to the tuner panel
                // Center the tooltip horizontally on the icon
                const tooltipWidth = 240;
                let leftPos = (rect.left - tunerRect.left) - (tooltipWidth / 2) + 10;

                // Clamp to panel bounds
                leftPos = Math.max(10, Math.min(tunerRect.width - tooltipWidth - 10, leftPos));

                tooltip.style.left = leftPos + 'px';
                tooltip.classList.add('visible');
            });

            icon.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });
    }

    // Auto-update meter
    setInterval(window.updateResonanceMeter, 1000);
});
