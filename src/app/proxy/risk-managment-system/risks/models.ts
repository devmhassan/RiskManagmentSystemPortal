import type { EntityDto } from '@abp/ng.core';
import type { ActionStatus } from '../domain/shared/enums/action-status.enum';

export interface ActionAttachmentDto extends EntityDto<number> {
  fileName?: string;
  originalFileName?: string;
  contentType?: string;
  fileSize: number;
  uploadedBy?: string;
  creationTime?: string;
  fileUrl?: string;
  uploadedDate?: string;
  preventionActionId?: number;
  mitigationActionId?: number;
}

export interface ActionCommentDto extends EntityDto<number> {
  content?: string;
  comment?: string;
  authorName?: string;
  commentedBy?: string;
  creationTime?: string;
  commentedDate?: string;
  lastModificationTime?: string;
  preventionActionId?: number;
  mitigationActionId?: number;
}

export interface CreateActionCommentDto {
  content: string;
  authorName: string;
  preventionActionId?: number;
  mitigationActionId?: number;
}

export interface UpdateActionStatusDto {
  status: ActionStatus;
  notes?: string;
}

export interface UploadActionAttachmentDto {
  fileName: string;
  contentType: string;
  fileContent: number[];
  uploadedBy: string;
  preventionActionId?: number;
  mitigationActionId?: number;
}

export interface UploadActionAttachmentRequest {
  uploadedBy?: string;
  preventionActionId?: number;
  mitigationActionId?: number;
}
