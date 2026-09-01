import { BadRequestException } from '@nestjs/common';
import { JobStatus } from '../enums/job.enums';

export class JobStateMachine {
  /**
   * Finite State Transition Map defining allowed next states.
   */
  private static readonly TRANSITIONS: Record<JobStatus, JobStatus[]> = {
    [JobStatus.DRAFT]: [JobStatus.PUBLISHED, JobStatus.ARCHIVED],
    [JobStatus.PUBLISHED]: [JobStatus.IN_REVIEW, JobStatus.ARCHIVED, JobStatus.DRAFT],
    [JobStatus.IN_REVIEW]: [JobStatus.AWARDED, JobStatus.PUBLISHED, JobStatus.ARCHIVED],
    [JobStatus.AWARDED]: [JobStatus.COMPLETED, JobStatus.ARCHIVED],
    [JobStatus.COMPLETED]: [JobStatus.ARCHIVED],
    [JobStatus.ARCHIVED]: [], // Terminal state
  };

  public static validateTransition(currentStatus: JobStatus, targetStatus: JobStatus): void {
    if (currentStatus === targetStatus) {
      return;
    }

    const allowedTransitions = this.TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(targetStatus)) {
      throw new BadRequestException(
        `Invalid status transition from '${currentStatus}' to '${targetStatus}'. Allowed: [${allowedTransitions.join(', ')}]`,
      );
    }
  }
}