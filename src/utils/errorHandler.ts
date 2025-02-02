import { message } from 'antd';

export const handleError = (error: any) => {
  if (error.response) {
    // Backend xatolik
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        if (typeof data === 'object') {
          Object.values(data).forEach((errors: any) => {
            if (Array.isArray(errors)) {
              errors.forEach(err => message.error(err));
            }
          });
        } else {
          message.error(data.detail || 'Xatolik yuz berdi');
        }
        break;
      case 401:
        message.error('Avtorizatsiyadan o\'tilmagan');
        break;
      case 403:
        message.error('Ruxsat etilmagan');
        break;
      case 404:
        message.error('Ma\'lumot topilmadi');
        break;
      case 500:
        message.error('Server xatoligi');
        break;
      default:
        message.error('Xatolik yuz berdi');
    }
  } else if (error.request) {
    // Network xatolik
    message.error('Server bilan bog\'lanishda xatolik');
  } else {
    // Boshqa xatoliklar
    message.error('Xatolik yuz berdi');
  }
}; 