// Jesus Youth Family Gathering 2026 - Intercession Module

// Secret admin password required to reset data (changeable anytime)
const ADMIN_RESET_PASSWORD = 'jy2026';

const SUBZONES = [
  "Lourdes",
  "Basilica",
  "Pattikad",
  "Kandassankadavu",
  "Puthur",
  "Pudukkad",
  "Ollur",
  "Pazhuvil",
  "Palayoor",
  "Mattom",
  "Kottekad",
  "Parappur",
  "Wadakkanchery",
  "Velur",
  "Erumappetty",
  "Chelakara"
];

// Clean baseline state starting from zero for deployment
const DEFAULT_INTERCESSION_STATE = {
  totalMasses: 0,
  totalRosaries: 0,
  totalAdorationHours: 0,
  totalIntercessors: 0,
  subzoneStats: {
    "Lourdes": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Basilica": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Pattikad": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Kandassankadavu": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Puthur": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Pudukkad": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Ollur": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Pazhuvil": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Palayoor": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Mattom": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Kottekad": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Parappur": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Wadakkanchery": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Velur": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Erumappetty": { masses: 0, rosaries: 0, adoration: 0, count: 0 },
    "Chelakara": { masses: 0, rosaries: 0, adoration: 0, count: 0 }
  },
  recentContributions: []
};

class IntercessionManager {
  constructor() {
    this.storageKey = 'jy_intercession_live_v2';
    this.cleanLegacyStorage();
    this.state = this.loadState();
    this.init();
  }

  cleanLegacyStorage() {
    try {
      // Purge all legacy development storage keys from previous sessions
      localStorage.removeItem('jy_thrissur_intercession_2026');
      localStorage.removeItem('jy_thrissur_intercession_prod_v1');
    } catch (e) {}
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If data contains old mock names, force clean reset to 0
        const hasMockEntries = parsed.recentContributions && parsed.recentContributions.some(
          c => c.name === 'Jerin Davis' || c.name === 'Mariette Varghese' || c.name === 'Paulson K. J.'
        );
        if (hasMockEntries) {
          localStorage.removeItem(this.storageKey);
          return JSON.parse(JSON.stringify(DEFAULT_INTERCESSION_STATE));
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not load intercession from localStorage', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_INTERCESSION_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save intercession to localStorage', e);
    }
  }

  init() {
    this.populateSubzoneDropdown();
    this.renderStats(false);
    this.renderSubzoneStats();
    this.bindEvents();
  }

  populateSubzoneDropdown() {
    const select = document.getElementById('intercession-subzone');
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>-- Select Your Subzone --</option>';
    SUBZONES.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub;
      opt.textContent = `${sub} Subzone`;
      select.appendChild(opt);
    });
  }

  bindEvents() {
    const form = document.getElementById('intercession-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Steppers for masses and rosaries
    document.querySelectorAll('.stepper-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;

        let val = parseInt(input.value, 10) || 0;
        if (btn.classList.contains('increment')) {
          val += 1;
        } else if (btn.classList.contains('decrement')) {
          val = Math.max(0, val - 1);
        }
        input.value = val;
      });
    });

    // Real-time adoration validation warning
    const adorationInput = document.getElementById('intercession-adoration');
    const adorationError = document.getElementById('adoration-validation-msg');
    if (adorationInput && adorationError) {
      adorationInput.addEventListener('input', () => {
        const minutes = parseFloat(adorationInput.value) || 0;
        if (minutes > 0 && minutes < 30) {
          adorationError.classList.remove('hidden');
          adorationError.textContent = '⚠️ Eucharistic Adoration must be at least 30 minutes.';
        } else {
          adorationError.classList.add('hidden');
        }
      });
    }

    // Modal close button
    const closeBtn = document.getElementById('modal-close-btn');
    const modal = document.getElementById('success-modal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    }

    // Hidden Admin reset triggers (completely unnoticeable to ordinary visitors)
    const adminTrigger = document.getElementById('admin-reset-trigger');
    if (adminTrigger) {
      adminTrigger.addEventListener('click', () => {
        this.promptAdminReset();
      });
    }

    const liveBadge = document.getElementById('live-tracker-badge');
    if (liveBadge) {
      // Secret double-click shortcut on the "Live Tracker" badge
      liveBadge.addEventListener('dblclick', () => {
        this.promptAdminReset();
      });
    }
  }

  promptAdminReset() {
    const entered = window.prompt("🔒 Admin Authorization\n\nEnter the administrator password to reset intercession data to zero:");
    if (entered === null) {
      return; // Admin cancelled
    }

    if (entered.trim() !== ADMIN_RESET_PASSWORD) {
      alert("❌ Access denied: Incorrect administrator password.");
      return;
    }

    const confirmWipe = window.confirm(
      "⚠️ Admin Verification Successful.\n\nAre you sure you want to completely erase all recorded prayers and reset counters to zero?"
    );

    if (confirmWipe) {
      this.clearAllData(true);
      alert("✅ All intercession data has been successfully reset to zero.");
    }
  }

  clearAllData(authorized = false) {
    if (!authorized) {
      this.promptAdminReset();
      return;
    }

    // 1. Wipe out browser storage for this app
    localStorage.removeItem(this.storageKey);
    this.cleanLegacyStorage();
    
    // 2. Overwrite state with clean zeroes baseline
    this.state = JSON.parse(JSON.stringify(DEFAULT_INTERCESSION_STATE));
    this.saveState();
    
    // 3. Refresh the user interface elements
    this.renderStats(false);
    this.renderSubzoneStats();
    
    console.log("Spiritual dashboard reset successfully to zero by administrator!");
  }

  handleSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('intercession-name');
    const subzoneSelect = document.getElementById('intercession-subzone');
    const massInput = document.getElementById('intercession-masses');
    const rosaryInput = document.getElementById('intercession-rosaries');
    const adorationInput = document.getElementById('intercession-adoration');
    const generalError = document.getElementById('form-error-msg');
    const adorationError = document.getElementById('adoration-validation-msg');

    if (generalError) generalError.classList.add('hidden');
    if (adorationError) adorationError.classList.add('hidden');

    const name = nameInput.value.trim();
    const subzone = subzoneSelect.value;
    const masses = parseInt(massInput.value, 10) || 0;
    const rosaries = parseInt(rosaryInput.value, 10) || 0;
    const adorationMins = parseFloat(adorationInput.value) || 0;

    // Validation
    if (!name || name.length < 2) {
      this.showError('Please enter your full name.');
      nameInput.focus();
      return;
    }

    if (!subzone || !SUBZONES.includes(subzone)) {
      this.showError('Please select your subzone from the list.');
      subzoneSelect.focus();
      return;
    }

    // Adoration minimum rule
    if (adorationMins > 0 && adorationMins < 30) {
      if (adorationError) {
        adorationError.classList.remove('hidden');
        adorationError.textContent = '⚠️ Adoration spent must be a minimum of 30 minutes.';
      }
      this.showError('Adoration spent must be a minimum of 30 minutes.');
      adorationInput.focus();
      return;
    }

    // Must offer at least one type of intercession
    if (masses === 0 && rosaries === 0 && adorationMins === 0) {
      this.showError('Please enter at least one Holy Mass, Rosary, or at least 30 mins of Adoration.');
      return;
    }

    // Convert adoration minutes to hours
    const adorationHours = adorationMins / 60;

    // Update state
    this.state.totalMasses += masses;
    this.state.totalRosaries += rosaries;
    this.state.totalAdorationHours = parseFloat((this.state.totalAdorationHours + adorationHours).toFixed(1));
    this.state.totalIntercessors += 1;

    // Update subzone stats
    if (!this.state.subzoneStats[subzone]) {
      this.state.subzoneStats[subzone] = { masses: 0, rosaries: 0, adoration: 0, count: 0 };
    }
    this.state.subzoneStats[subzone].masses += masses;
    this.state.subzoneStats[subzone].rosaries += rosaries;
    this.state.subzoneStats[subzone].adoration = parseFloat((this.state.subzoneStats[subzone].adoration + adorationHours).toFixed(1));
    this.state.subzoneStats[subzone].count += 1;

    // Prepend to recent contributions
    this.state.recentContributions.unshift({
      name: name,
      subzone: subzone,
      masses: masses,
      rosaries: rosaries,
      adoration: parseFloat(adorationHours.toFixed(1)),
      timestamp: 'Just now'
    });

    if (this.state.recentContributions.length > 8) {
      this.state.recentContributions.pop();
    }

    this.saveState();
    this.renderStats(true);
    this.renderSubzoneStats();

    // Show celebration confetti & modal
    this.triggerConfetti();
    this.showSuccessModal(name, subzone, masses, rosaries, adorationMins);

    // Reset inputs
    massInput.value = '0';
    rosaryInput.value = '0';
    adorationInput.value = '0';
    nameInput.value = '';
    subzoneSelect.selectedIndex = 0;
  }

  showError(msg) {
    const errorEl = document.getElementById('form-error-msg');
    if (errorEl) {
      errorEl.textContent = `⚠️ ${msg}`;
      errorEl.classList.remove('hidden');
    } else {
      alert(msg);
    }
  }

  triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff']
      });
    }
  }

  showSuccessModal(name, subzone, masses, rosaries, adorationMins) {
    const modal = document.getElementById('success-modal');
    const msgEl = document.getElementById('modal-details');
    if (!modal || !msgEl) return;

    let parts = [];
    if (masses > 0) parts.push(`✝️ ${masses} Holy Mass${masses > 1 ? 'es' : ''}`);
    if (rosaries > 0) parts.push(`📿 ${rosaries} Rosar${rosaries > 1 ? 'ies' : 'y'}`);
    if (adorationMins >= 30) {
      const hrs = (adorationMins / 60).toFixed(1);
      parts.push(`🕊️ ${adorationMins} mins (${hrs} hrs) Adoration`);
    }

    msgEl.innerHTML = `
      <p class="text-base text-slate-700 mb-2">Thank you, <strong class="text-navy-900">${name}</strong> from <span class="text-amber-600 font-semibold">${subzone} Subzone</span>!</p>
      <div class="bg-amber-50 p-3 rounded-lg border border-amber-200 text-sm text-amber-900 font-medium mb-3">
        ${parts.join(' &bull; ')}
      </div>
      <p class="text-xs text-slate-500">Your prayers have been united with thousands across Thrissur Zone for the outpouring of the Holy Spirit at Family Gathering 2026.</p>
    `;

    modal.classList.remove('hidden');
  }

  renderStats(animate = false) {
    this.animateValue('stat-masses', this.state.totalMasses, animate);
    this.animateValue('stat-rosaries', this.state.totalRosaries, animate);
    this.animateValue('stat-adoration', this.state.totalAdorationHours, animate, true);
    this.animateValue('stat-intercessors', this.state.totalIntercessors, animate);
  }

  animateValue(id, target, animate, isDecimal = false) {
    const el = document.getElementById(id);
    if (!el) return;

    if (!animate) {
      el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
      return;
    }

    const current = parseFloat(el.textContent.replace(/,/g, '')) || 0;
    const diff = target - current;
    const duration = 1000;
    const startTime = performance.now();

    function update(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = current + diff * progress;
      el.textContent = isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  renderSubzoneStats() {
    const tbody = document.getElementById('subzone-stats-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Sort subzones: active participants first, then standard alphabetical order
    const sortedSubzones = [...SUBZONES].sort((a, b) => {
      const statsA = this.state.subzoneStats[a] || { count: 0, masses: 0, rosaries: 0, adoration: 0 };
      const statsB = this.state.subzoneStats[b] || { count: 0, masses: 0, rosaries: 0, adoration: 0 };
      if (statsB.count !== statsA.count) {
        return statsB.count - statsA.count;
      }
      return a.localeCompare(b);
    });

    sortedSubzones.forEach((sub, idx) => {
      const data = this.state.subzoneStats[sub] || { masses: 0, rosaries: 0, adoration: 0, count: 0 };
      const hasActivity = data.count > 0 || data.masses > 0 || data.rosaries > 0 || data.adoration > 0;
      
      const tr = document.createElement('tr');
      tr.className = `subzone-row transition-colors ${hasActivity ? 'bg-amber-50/20' : ''}`;
      tr.innerHTML = `
        <td class="py-2.5 px-3">
          <div class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-full ${hasActivity ? 'bg-amber-500 text-white font-bold' : 'bg-slate-100 text-slate-400 font-medium'} flex items-center justify-center text-[10px] shrink-0">
              ${idx + 1}
            </span>
            <span class="font-semibold text-slate-800 text-xs">${sub}</span>
          </div>
        </td>
        <td class="py-2.5 px-2 text-center text-xs font-bold ${data.masses > 0 ? 'text-red-700 bg-red-50/40 rounded' : 'text-slate-400'}">
          ${data.masses}
        </td>
        <td class="py-2.5 px-2 text-center text-xs font-bold ${data.rosaries > 0 ? 'text-blue-700 bg-blue-50/40 rounded' : 'text-slate-400'}">
          ${data.rosaries}
        </td>
        <td class="py-2.5 px-2 text-center text-xs font-bold ${data.adoration > 0 ? 'text-amber-700 bg-amber-50/40 rounded' : 'text-slate-400'}">
          ${data.adoration}h
        </td>
        <td class="py-2.5 px-2 text-center">
          <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold ${data.count > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}">
            ${data.count}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.intercessionManager = new IntercessionManager();
  window.clearIntercessionData = () => window.intercessionManager.promptAdminReset();
});
