const API_BASE = 'http://localhost:3001/api/v1';

let state = {
  role: 'TUTOR',
  token: null,
  profile: null,
};

document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) window.lucide.createIcons();
  setupDragAndDrop();
  await switchRole('TUTOR');
});

function setupDragAndDrop() {
  const dropzone = document.getElementById('dropzone-box');
  const fileInput = document.getElementById('file-pdf-input');
  if (!dropzone || !fileInput) return;

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropzone.addEventListener(
      eventName,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-active');
      },
      false,
    );
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropzone.addEventListener(
      eventName,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-active');
      },
      false,
    );
  });

  dropzone.addEventListener(
    'drop',
    (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;

      if (files && files.length > 0) {
        if (files[0].type !== 'application/pdf' && !files[0].name.toLowerCase().endsWith('.pdf')) {
          alert('Please select or drop a valid PDF document (.pdf)');
          return;
        }
        fileInput.files = files;
        updateSelectedFileLabel(fileInput);
      }
    },
    false,
  );
}

window.switchRole = async function (role) {
  state.role = role;
  const pill = document.getElementById('user-display-pill');
  const btnTutor = document.getElementById('btn-tab-tutor');
  const btnAdmin = document.getElementById('btn-tab-admin');

  if (role === 'TUTOR') {
    pill.textContent = 'Logged in as: Mr. Yarbe Mohaz (Tutor)';
    btnTutor.classList.add('active');
    btnAdmin.classList.remove('active');
    document.getElementById('view-tutor').classList.add('active');
    document.getElementById('view-admin').classList.remove('active');
    await loginDemoUser('tutor.david@tutorconnect.com', 'password123');
    await loadTutorProfile();
  } else {
    pill.textContent = 'Logged in as: System Administrator (Admin)';
    btnAdmin.classList.add('active');
    btnTutor.classList.remove('active');
    document.getElementById('view-admin').classList.add('active');
    document.getElementById('view-tutor').classList.remove('active');
    await loginDemoUser('admin@tutorconnect.com', 'password123');
    await loadAdminPendingAudits();
  }
};

async function loginDemoUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (json.accessToken) {
      state.token = json.accessToken;
    }
  } catch (e) {
    console.error('Demo auth error:', e);
  }
}

async function loadTutorProfile() {
  if (!state.token) return;
  try {
    const res = await fetch(`${API_BASE}/portfolio/my-profile`, {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    const profile = await res.json();
    state.profile = profile;

    // Render FR-PROF-03 Status & PDF Link
    const badge = document.getElementById('audit-status-badge');
    badge.className = `audit-badge badge-${profile.verificationStatus}`;
    badge.innerHTML = `<i data-lucide="clock"></i> Status: ${profile.verificationStatus}`;

    const pdfBtn = document.getElementById('link-view-pdf');
    if (profile.credentialPdfUrl) {
      pdfBtn.style.display = 'inline-flex';
      pdfBtn.href = profile.credentialPdfUrl;
      pdfBtn.innerHTML = `<i data-lucide="external-link"></i> View Uploaded PDF (${profile.credentialFilename || 'Degree.pdf'})`;
    } else {
      pdfBtn.style.display = 'none';
    }

    if (profile.adminReviewNote) {
      const banner = document.getElementById('admin-feedback-banner');
      banner.style.display = 'block';
      document.getElementById('admin-feedback-text').textContent = profile.adminReviewNote;
    } else {
      document.getElementById('admin-feedback-banner').style.display = 'none';
    }

    // Render FR-PROF-04 Parameters
    document.getElementById('input-rate').value = profile.hourlyRate || 50;
    document.getElementById('input-radius').value = profile.geographicRadiusKm || 20;
    document.getElementById('radius-val').textContent = profile.geographicRadiusKm || 20;

    const modes = profile.teachingModes || [];
    document.getElementById('mode-online').checked = modes.includes('ONLINE');
    document.getElementById('mode-tutor-home').checked = modes.includes('IN_PERSON_TUTOR_HOME');
    document.getElementById('mode-student-home').checked = modes.includes('IN_PERSON_STUDENT_HOME');

    renderWeeklyMatrix(profile.availabilityCalendar || {});
    if (window.lucide) window.lucide.createIcons();
  } catch (e) {
    console.error('Load profile error:', e);
  }
}

function renderWeeklyMatrix(calendarObj) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const container = document.getElementById('weekly-calendar-matrix');
  if (!container) return;

  container.innerHTML = days
    .map((day) => {
      const slots = calendarObj[day] || [];
      const slotsHtml =
        slots.length > 0
          ? slots.map((s) => `<span class="time-chip">${s.start} - ${s.end}</span>`).join('')
          : '<span class="time-chip" style="opacity:0.4;">Unavailable</span>';

      return `
      <div class="day-row">
        <span class="day-name">${day}</span>
        <div class="time-slots">${slotsHtml}</div>
      </div>
    `;
    })
    .join('');
}

window.updateSelectedFileLabel = function (input) {
  const label = document.getElementById('selected-file-label');
  if (input.files && input.files[0]) {
    label.textContent = `Selected File: ${input.files[0].name} (${(input.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
  }
};

window.handlePdfUpload = async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('file-pdf-input');
  if (!fileInput.files || !fileInput.files[0]) {
    alert('Please select or drag & drop a PDF document first.');
    return;
  }

  const formData = new FormData();
  formData.append('credentialPdf', fileInput.files[0]);

  try {
    const res = await fetch(`${API_BASE}/portfolio/upload-credentials`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${state.token}` },
      body: formData,
    });

    const json = await res.json();
    alert(`🎉 PDF Credential uploaded successfully! Document is now tagged as PENDING_AUDIT and sent to Admin Queue.`);
    await loadTutorProfile();
  } catch (err) {
    console.error('Upload error:', err);
  }
};

window.handleProfileUpdate = async function (e) {
  e.preventDefault();
  const modes = [];
  if (document.getElementById('mode-online').checked) modes.push('ONLINE');
  if (document.getElementById('mode-tutor-home').checked) modes.push('IN_PERSON_TUTOR_HOME');
  if (document.getElementById('mode-student-home').checked) modes.push('IN_PERSON_STUDENT_HOME');

  const body = {
    hourlyRate: Number(document.getElementById('input-rate').value),
    geographicRadiusKm: Number(document.getElementById('input-radius').value),
    teachingModes: modes,
    availabilityCalendar: JSON.stringify(state.profile?.availabilityCalendar || {}),
  };

  try {
    const res = await fetch(`${API_BASE}/portfolio/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    alert('✅ FR-PROF-04 Availability parameters and teaching modes saved successfully!');
    await loadTutorProfile();
  } catch (err) {
    console.error('Update profile error:', err);
  }
};

async function loadAdminPendingAudits() {
  if (!state.token) return;
  try {
    const res = await fetch(`${API_BASE}/portfolio/admin/pending-audits`, {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    const list = await res.json();

    const container = document.getElementById('admin-pending-list');
    if (!container) return;

    if (!list || list.length === 0) {
      container.innerHTML = `<div class="dropzone-sub" style="padding:20px; text-align:center;">No pending background credential audits awaiting review. Switch to Tutor View to upload a PDF!</div>`;
      return;
    }

    container.innerHTML = list
      .map(
        (item) => `
      <div class="pending-audit-item">
        <div>
          <h3>${item.user.fullName} (${item.user.email})</h3>
          <p class="dropzone-sub">Uploaded Document: <strong>${item.credentialFilename || 'Degree_Certificate.pdf'}</strong></p>
          <a href="${item.credentialPdfUrl || '#'}" target="_blank" style="color:var(--primary); font-size:0.85rem; font-weight:700; display:inline-flex; align-items:center; gap:4px; margin-top:6px;">
            📄 Inspect Uploaded PDF Document
          </a>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn-primary" style="background:var(--emerald);" onclick="auditDecision('${item.id}', 'APPROVED')">
            <i data-lucide="check-circle"></i> Approve Degree
          </button>
          <button class="btn-primary" style="background:var(--rose);" onclick="auditDecision('${item.id}', 'REJECTED')">
            <i data-lucide="x-circle"></i> Reject
          </button>
        </div>
      </div>
    `,
      )
      .join('');

    if (window.lucide) window.lucide.createIcons();
  } catch (e) {
    console.error('Load admin pending error:', e);
  }
}

window.auditDecision = async function (profileId, status) {
  const note = prompt(`Enter review note for status ${status}:`, `Verified background credentials against university registry.`);
  if (note === null) return;

  try {
    const res = await fetch(`${API_BASE}/portfolio/admin/verify-credentials/${profileId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ status, note }),
    });

    const json = await res.json();
    alert(`Audit status updated to ${status}!`);
    await loadAdminPendingAudits();
  } catch (e) {
    console.error('Audit decision error:', e);
  }
};
