import api from './api';

export interface UpdateProfileData {
  fullName: string;
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const userService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async changePassword(data: ChangePasswordData) {
    const response = await api.post('/users/change-password', data);
    return response.data;
  },

  async deleteAccount() {
    const response = await api.delete('/users/account');
    return response.data;
  }
};

export default userService;