import axiosInstance from '@lib/apis/axiosInstance';

export const postUploadImages = (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  return axiosInstance.post<{ uploadedFileUrls: string[] }>(
    '/api/files/images',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};
