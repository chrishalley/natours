/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  console.log('updateSettings');
  console.log({ data, type });
  const url = `http://localhost:8000/api/v1/users/${
    type === 'password' ? 'updateMyPassword' : 'updateMe'
  }`;
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type === 'password' ? 'Password' : 'Details'} updated successfully!`
      );
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
