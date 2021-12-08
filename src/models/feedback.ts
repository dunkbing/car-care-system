export type CreateFeedbackRequestParams = {
  rescueDetailId: number;
  comment: string;
  point: number;
  images?: Array<any>;
};

export type UpdateFeedbackRequestParams = {
  feedbackId: number;
  comment: string;
  point: number;
};
