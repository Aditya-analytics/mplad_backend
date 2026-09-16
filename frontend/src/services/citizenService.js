import apiClient from './apiClient';

export const SUBMISSION_STATUS = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTION_INITIATED: 'ACTION_INITIATED',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

const NOTIFS_KEY = 'mplads_admin_notifs';

export const citizenService = {
  async getSubmissions() {
    try {
      const response = await apiClient.get('/citizen/submissions');
      return response.data;
    } catch (error) {
      console.error('Error fetching submissions', error);
      return [];
    }
  },

  async getCitizenSubmissions(citizenEmail) {
    try {
      const response = await apiClient.get(`/citizen/submissions?email=${encodeURIComponent(citizenEmail || '')}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching citizen submissions', error);
      return [];
    }
  },

  async addSubmission(newSub) {
    try {
      const response = await apiClient.post('/citizen/submissions', newSub);
      
      // Keep local notifications for admin prototype
      this.addAdminNotification({
        id: `notif-${Date.now()}`,
        title: `New Citizen ${newSub.type === 'COMPLAINT' ? 'Complaint' : newSub.type === 'COMMENT' ? 'Comment' : 'Rating'}`,
        message: `A ${newSub.isVerified ? 'verified' : ''} citizen submitted a ${newSub.type.toLowerCase()} regarding "${newSub.projectTitle || newSub.projectId}".`,
        submissionId: response.data.id,
        timestamp: new Date().toISOString(),
        read: false,
      });

      return response.data;
    } catch (error) {
      console.error('Error adding submission', error);
      throw error;
    }
  },

  async deleteComment(submissionId, citizenEmail) {
    try {
      await apiClient.delete(`/citizen/submissions/${submissionId}?email=${encodeURIComponent(citizenEmail)}`);
      return true;
    } catch (error) {
      console.error('Error deleting comment', error);
      throw error;
    }
  },

  async updateSubmissionStatus(submissionId, newStatus, adminNote = '') {
    try {
      // In a real app we'd pass adminNote too, but our quick backend just takes status query param for now
      const response = await apiClient.put(`/citizen/submissions/${submissionId}/status?status=${newStatus}`);
      return response.data;
    } catch (error) {
      console.error('Error updating status', error);
      throw error;
    }
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
