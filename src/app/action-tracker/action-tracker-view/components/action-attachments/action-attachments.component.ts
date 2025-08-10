import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionItemDto } from '../../../../proxy/risk-managment-system/risks/dtos/models';

export interface ActionAttachment {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  fileType: string;
  downloadUrl?: string;
}

@Component({
  selector: 'app-action-attachments',
  templateUrl: './action-attachments.component.html',
  styleUrls: ['./action-attachments.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ActionAttachmentsComponent {
  @Input() action: ActionItemDto | null = null;
  
  selectedFile: File | null = null;
  
  // Mock attachments data based on the attached images
  attachments: ActionAttachment[] = [
    {
      id: '1',
      fileName: 'Password Policy Document.pdf',
      fileSize: '2.5 MB',
      uploadedBy: 'John Smith',
      uploadDate: '10/16/2023',
      fileType: 'pdf'
    },
    {
      id: '2',
      fileName: 'Implementation Report.xlsx',
      fileSize: '1.8 MB',
      uploadedBy: 'John Smith',
      uploadDate: '11/10/2023',
      fileType: 'xlsx'
    }
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      // Mock upload - in real app, upload to server
      const newAttachment: ActionAttachment = {
        id: Date.now().toString(),
        fileName: this.selectedFile.name,
        fileSize: this.formatFileSize(this.selectedFile.size),
        uploadedBy: 'Current User', // In real app, get from auth service
        uploadDate: new Date().toLocaleDateString(),
        fileType: this.getFileExtension(this.selectedFile.name)
      };
      
      this.attachments.push(newAttachment);
      this.selectedFile = null;
      
      // Reset the file input
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  downloadFile(attachment: ActionAttachment): void {
    // Mock download - in real app, download from server
    console.log('Downloading file:', attachment.fileName);
    // You would typically create a download link or call an API endpoint here
  }

  deleteAttachment(attachmentId: string): void {
    this.attachments = this.attachments.filter(a => a.id !== attachmentId);
  }

  getFileIcon(fileType: string): string {
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

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }
}
