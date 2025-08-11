import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestService } from '@abp/ng.core';
import { ActionDetailsDto } from '../../../../proxy/risk-managment-system/risks/dtos/models';
import { ActionAttachmentDto, UploadActionAttachmentDto } from '../../../../proxy/risk-managment-system/risks/models';
import { ActionAttachmentService } from '../../../../proxy/risk-managment-system/actions/action-attachment.service';
import { ActionType } from '../../../../proxy/risk-managment-system/domain/shared/enums/action-type.enum';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-action-attachments',
  templateUrl: './action-attachments.component.html',
  styleUrls: ['./action-attachments.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ActionAttachmentsComponent implements OnInit {
  @Input() action: ActionDetailsDto | null = null;
  
  selectedFile: File | null = null;
  attachments: ActionAttachmentDto[] = [];
  isLoading = false;
  isUploading = false;
  errorMessage = '';

  constructor(
    private actionAttachmentService: ActionAttachmentService,
    private restService: RestService
  ) {}

  ngOnInit(): void {
    this.loadAttachments();
  }

  loadAttachments(): void {
    if (!this.action) return;

    // Use attachments from ActionDetailsDto if available
    if (this.action.attachments && this.action.attachments.length > 0) {
      this.attachments = this.action.attachments;
      return;
    }

    // If no attachments in the DTO, we could load them separately if needed
    // For now, we'll use the attachments from the action details
    this.attachments = [];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile || !this.action) return;

    this.isUploading = true;
    this.errorMessage = '';

    // Convert file to byte array as expected by the backend
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const fileContent = Array.from(uint8Array);

      // Create the DTO structure that matches the backend expectations
      const uploadDto: UploadActionAttachmentDto = {
        fileName: this.selectedFile!.name,
        contentType: this.selectedFile!.type || 'application/octet-stream',
        fileContent: fileContent,
        uploadedBy: 'Current User', // In real app, get from auth service
        // Set the appropriate action ID based on action type - ensure only one is set
        preventionActionId: this.action!.type === ActionType.Preventive ? Number(this.action!.actionId) : undefined,
        mitigationActionId: this.action!.type === ActionType.Mitigation ? Number(this.action!.actionId) : undefined
      };

      console.log('Upload DTO:', {
        fileName: uploadDto.fileName,
        contentType: uploadDto.contentType,
        fileContentLength: uploadDto.fileContent.length,
        uploadedBy: uploadDto.uploadedBy,
        preventionActionId: uploadDto.preventionActionId,
        mitigationActionId: uploadDto.mitigationActionId,
        actionType: this.action!.type,
        actionId: this.action!.actionId
      });

      // Use RestService directly with "input" wrapper as expected by ABP
      this.restService.request<any, ActionAttachmentDto>({
        method: 'POST',
        url: '/api/app/action-attachment/upload',
        body: { input: uploadDto }, // Wrap in "input" object
      }, { apiName: 'Default' })
        .pipe(finalize(() => this.isUploading = false))
        .subscribe({
          next: (attachment) => {
            console.log('Upload successful:', attachment);
            this.attachments.push(attachment);
            this.selectedFile = null;
            
            // Reset the file input
            const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = '';
            }
          },
          error: (error) => {
            console.error('Error uploading file:', error);
            this.errorMessage = error?.error?.message || error?.message || 'Failed to upload file. Please try again.';
          }
        });
    };

    reader.onerror = () => {
      this.isUploading = false;
      this.errorMessage = 'Failed to read file. Please try again.';
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }

  downloadFile(attachment: ActionAttachmentDto): void {
    if (!attachment.id) return;

    this.actionAttachmentService.download(attachment.id)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = attachment.fileName || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error downloading file:', error);
          this.errorMessage = 'Failed to download file. Please try again.';
        }
      });
  }

  deleteAttachment(attachmentId: number): void {
    if (!confirm('Are you sure you want to delete this attachment?')) return;

    this.actionAttachmentService.delete(attachmentId)
      .subscribe({
        next: () => {
          this.attachments = this.attachments.filter(a => a.id !== attachmentId);
        },
        error: (error) => {
          console.error('Error deleting attachment:', error);
          this.errorMessage = 'Failed to delete attachment. Please try again.';
        }
      });
  }

  getFileIcon(attachment: ActionAttachmentDto): string {
    const fileType = this.getFileExtension(attachment.fileName || '');
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'bi-file-earmark-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'bi-file-earmark-word text-primary';
      case 'xls':
      case 'xlsx':
        return 'bi-file-earmark-excel text-success';
      case 'ppt':
      case 'pptx':
        return 'bi-file-earmark-ppt text-warning';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'bi-file-earmark-image text-info';
      case 'zip':
      case 'rar':
        return 'bi-file-earmark-zip text-secondary';
      default:
        return 'bi-file-earmark text-muted';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFormattedFileSize(attachment: ActionAttachmentDto): string {
    return this.formatFileSize(attachment.fileSize || 0);
  }

  getFormattedUploadDate(attachment: ActionAttachmentDto): string {
    if (!attachment.creationTime) return '';
    return new Date(attachment.creationTime).toLocaleDateString();
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }
}
