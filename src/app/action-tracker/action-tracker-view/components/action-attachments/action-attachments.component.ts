import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionItemDto } from '../../../../proxy/risk-managment-system/risks/dtos/models';

interface Attachment {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
  size?: string;
}

@Component({
  selector: 'app-action-attachments',
  templateUrl: './action-attachments.component.html',
  styleUrls: ['./action-attachments.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ActionAttachmentsComponent {
  @Input() action!: ActionItemDto;
  
  selectedFile: File | null = null;
  
  // Mock data for demonstration
  mockAttachments: Attachment[] = [
    {
      id: '1',
      name: 'Password Policy Document.pdf',
      type: 'pdf',
      uploadedBy: 'John Smith',
      uploadDate: '10/16/2023',
      size: '2.5 MB'
    },
    {
      id: '2',
      name: 'Implementation Report.xlsx',
      type: 'excel',
      uploadedBy: 'John Smith',
      uploadDate: '11/10/2023',
      size: '1.8 MB'
    }
  ];

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      // Here you would typically upload the file to your backend
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        name: this.selectedFile.name,
        type: this.getFileType(this.selectedFile.name),
        uploadedBy: 'Current User', // This should come from authentication service
        uploadDate: new Date().toLocaleDateString(),
        size: this.formatFileSize(this.selectedFile.size)
      };
      
      this.mockAttachments.push(newAttachment);
      this.selectedFile = null;
      
      // Reset file input
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  private getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'xls':
      case 'xlsx': return 'excel';
      case 'doc':
      case 'docx': return 'document';
      case 'png':
      case 'jpg':
      case 'jpeg': return 'image';
      default: return 'file';
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadAttachment(attachment: Attachment): void {
    // Here you would implement the actual download logic
    console.log('Downloading:', attachment.name);
  }
}
