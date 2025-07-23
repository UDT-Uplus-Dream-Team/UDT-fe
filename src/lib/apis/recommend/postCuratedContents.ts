import axiosInstance from '@lib/apis/axiosInstance';

interface PostCurateResponse {
  success: boolean;
  message?: string;
}

export const postCuratedContent = async (
  contentId: number,
): Promise<PostCurateResponse> => {
  try {
    const response = await axiosInstance.post(
      '/api/v1/contents/recommendations/contents',
      { contentId },
    );

    if (response.status === 201) {
      return {
        success: true,
        message:
          response.data?.message || '컨텐츠가 성공적으로 저장되었습니다.',
      };
    }

    return {
      success: false,
      message: '컨텐츠 저장에 실패했습니다.',
    };
  } catch (error: unknown) {
    console.error('저장 실패:', error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : '컨텐츠 저장 중 오류가 발생했습니다.',
    };
  }
};
