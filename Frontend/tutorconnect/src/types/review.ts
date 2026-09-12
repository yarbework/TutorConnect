export interface Review {
  id: string;
  engagementId: string;
  reviewerId: string;
  revieweeId: string;
  reviewerRole: 'GUARDIAN' | 'TUTOR';
  rating: number;
  tags: string[];
  comment: string;
  createdAt: string;
  reviewer?: {
    id: string;
    email: string;
  };
}

export interface CreateReviewInput {
  engagementId: string;
  rating: number;
  tags?: string[];
  comment: string;
}