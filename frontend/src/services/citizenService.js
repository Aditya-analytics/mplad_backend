export const SUBMISSION_STATUS = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTION_INITIATED: 'ACTION_INITIATED',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

export const INITIAL_SUBMISSIONS = [
  {
    id: 'SUB-2026-004821',
    referenceId: 'MPL-CIT-2026-004821',
    type: 'COMPLAINT',
    projectId: 'MPLAD-2026-004',
    projectTitle: 'Construction of Community Health Center Ward 12',
    category: 'Incomplete Work',
    categoryLabel: 'Incomplete Work',
    citizenName: 'Pooja Deshmukh',
    citizenEmail: 'verified@demo.in',
    isVerified: true,
    district: 'Pune',
    state: 'Maharashtra',
    date: '2026-02-28T09:40:00.000Z',
    status: SUBMISSION_STATUS.UNDER_REVIEW,
    rating: null,
    content: 'The official dashboard reports this Community Health Center as 100% complete and handed over on 15 Feb 2026. However, on-ground inspection reveals that the top floor lacks roof waterproofing, external plastering is missing, and electrical wiring is incomplete. No medical staff or equipment are present.',
    evidence: [
      {
        name: 'site_facade_inspection.jpg',
        size: '2.4 MB',
        type: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=600&q=80',
      },
    ],
    aiCorrelation: 'Multiple citizen reports are associated with this project. Potential risk signal detected — administrative review required.',
    timeline: [
      { step: 'Submitted', date: '2026-02-28 09:40', done: true, note: 'Submitted by citizen via MPLADS portal' },
      { step: 'Received by Administrator', date: '2026-02-28 10:15', done: true, note: 'Logged in MoSPI Central Grievance Ledger' },
      { step: 'Under Review', date: '2026-03-01 11:30', done: true, note: 'Assigned to District Vigilance Officer, Pune Collectorate' },
      { step: 'Action Initiated', date: null, done: false, note: 'Statutory inspection memo pending' },
      { step: 'Resolved', date: null, done: false, note: 'Rectification & final compliance audit' },
    ],
  },
  {
    id: 'SUB-2026-003192',
    referenceId: 'MPL-CIT-2026-003192',
    type: 'COMMENT',
    projectId: 'MPLAD-2026-001',
    projectTitle: 'Solar High-Mast Lighting at Public Bus Stand',
    category: 'Work Progress',
    categoryLabel: 'Work Progress',
    citizenName: 'Pooja Deshmukh',
    citizenEmail: 'verified@demo.in',
    isVerified: true,
    district: 'Pune',
    state: 'Maharashtra',
    date: '2026-03-01T14:15:00.000Z',
    status: SUBMISSION_STATUS.APPROVED,
    rating: 4,
    content: 'Three out of four high masts illuminate the depot grounds brightly. The night visibility for commuters has significantly improved. Awaiting completion of the final terminal mast near platform 4.',
    evidence: [],
    aiCorrelation: 'Sentiment analysis positive. Alignment with reported 85% completion.',
    timeline: [
      { step: 'Submitted', date: '2026-03-01 14:15', done: true, note: 'Submitted by citizen' },
      { step: 'Approved for Public Display', date: '2026-03-02 10:00', done: true, note: 'Approved by MoSPI Content Moderator' },
    ],
  },
  {
    id: 'SUB-2026-002819',
    referenceId: 'MPL-CIT-2026-002819',
    type: 'RATING',
    projectId: 'MPLAD-2026-001',
    projectTitle: 'Solar High-Mast Lighting at Public Bus Stand',
    category: 'Timeliness',
    categoryLabel: 'Timeliness',
    citizenName: 'Aarav Patel',
    citizenEmail: 'citizen@demo.in',
    isVerified: false,
    district: 'Pune',
    state: 'Maharashtra',
    date: '2026-03-02T11:20:00.000Z',
    status: SUBMISSION_STATUS.SUBMITTED,
    rating: 4,
    categoriesRating: {
      workQuality: 4,
      progress: 4,
      timeliness: 3,
      communityBenefit: 5,
    },
    content: 'Rating: 4/5 for Solar High-Mast Lighting at Public Bus Stand',
    evidence: [],
    aiCorrelation: 'Baseline rating aggregated into project community score.',
    timeline: [
      { step: 'Submitted', date: '2026-03-02 11:20', done: true, note: 'Submitted — Awaiting Review' },
    ],
  },
  {
    id: 'SUB-2026-001944',
    referenceId: 'MPL-CIT-2026-001944',
    type: 'COMPLAINT',
    projectId: 'MPLAD-2026-002',
    projectTitle: 'Smart Classroom & Computer Lab Equipment for Girls School',
    category: 'Work Delayed',
    categoryLabel: 'Work Delayed',
    citizenName: 'Pooja Deshmukh',
    citizenEmail: 'verified@demo.in',
    isVerified: true,
    district: 'Nagpur',
    state: 'Maharashtra',
    date: '2026-01-15T09:00:00.000Z',
    status: SUBMISSION_STATUS.ACTION_INITIATED,
    rating: null,
    content: 'Work has been stalled for over 4 months despite computer terminals being delivered to school premises. Packing boxes remain uninspected in the library storeroom.',
    evidence: [
      {
        name: 'uninstalled_terminals.jpg',
        size: '1.8 MB',
        type: 'image/jpeg',
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      },
    ],
    aiCorrelation: 'Correlates with 74-day predicted delay in ML milestone tracking.',
    timeline: [
      { step: 'Submitted', date: '2026-01-15 09:00', done: true, note: 'Citizen filed grievance' },
      { step: 'Received by Administrator', date: '2026-01-15 11:00', done: true, note: 'Logged in portal' },
      { step: 'Under Review', date: '2026-01-16 14:00', done: true, note: 'Review by DEO Nagpur' },
      { step: 'Action Initiated', date: '2026-01-20 10:30', done: true, note: 'PWD electrical wiring contract dispatched' },
      { step: 'Resolved', date: null, done: false, note: 'Pending final installation signoff' },
    ],
  },
];

const STORAGE_KEY = 'mplads_citizen_submissions';
const NOTIFS_KEY = 'mplads_admin_citizen_notifs';

export const citizenService = {
  getSubmissions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
        return INITIAL_SUBMISSIONS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  },

  getCitizenSubmissions(citizenEmail) {
    const all = this.getSubmissions();
    if (!citizenEmail) return all;
    return all.filter((s) => (s.citizenEmail || '').toLowerCase() === citizenEmail.toLowerCase());
  },

  addSubmission(newSub) {
    const all = this.getSubmissions();
    const updated = [newSub, ...all];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also push notification for admin
    this.addAdminNotification({
      id: `notif-${Date.now()}`,
      title: `New Citizen ${newSub.type === 'COMPLAINT' ? 'Complaint' : newSub.type === 'COMMENT' ? 'Comment' : 'Rating'}`,
      message: `A ${newSub.isVerified ? 'verified' : ''} citizen submitted a ${newSub.type.toLowerCase()} regarding "${newSub.projectTitle || newSub.projectId}".`,
      submissionId: newSub.id,
      timestamp: new Date().toISOString(),
      read: false,
    });

    return newSub;
  },

  deleteComment(submissionId, citizenEmail) {
    const all = this.getSubmissions();
    const target = all.find((s) => s.id === submissionId);
    if (!target) throw new Error('Submission not found.');
    if (target.type !== 'COMMENT') throw new Error('Only comments may be deleted.');
    if (citizenEmail && (target.citizenEmail || '').toLowerCase() !== citizenEmail.toLowerCase()) {
      throw new Error('You do not have permission to delete this comment.');
    }
    const filtered = all.filter((s) => s.id !== submissionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  updateSubmissionStatus(submissionId, newStatus, adminNote = '') {
    const all = this.getSubmissions();
    const idx = all.findIndex((s) => s.id === submissionId);
    if (idx === -1) throw new Error('Submission not found.');

    const sub = all[idx];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Update timeline step if applicable
    const updatedTimeline = (sub.timeline || []).map((step) => {
      if (step.step.toUpperCase() === newStatus.replace('_', ' ').toUpperCase() ||
          (newStatus === SUBMISSION_STATUS.UNDER_REVIEW && step.step === 'Under Review') ||
          (newStatus === SUBMISSION_STATUS.ACTION_INITIATED && step.step === 'Action Initiated') ||
          (newStatus === SUBMISSION_STATUS.RESOLVED && step.step === 'Resolved')) {
        return { ...step, done: true, date: nowStr, note: adminNote || step.note };
      }
      return step;
    });

    const updatedSub = {
      ...sub,
      status: newStatus,
      adminNote: adminNote || sub.adminNote,
      timeline: updatedTimeline,
    };

    all[idx] = updatedSub;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return updatedSub;
  },

  getAdminNotifications() {
    try {
      const stored = localStorage.getItem(NOTIFS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addAdminNotification(notif) {
    const current = this.getAdminNotifications();
    const updated = [notif, ...current].slice(0, 20);
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(updated));
  },
};
