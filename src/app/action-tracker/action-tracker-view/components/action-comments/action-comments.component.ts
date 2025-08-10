import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionItemDto } from '../../../../proxy/risk-managment-system/risks/dtos/models';

export interface ActionComment {
  id: string;
  author: string;
  content: string;
  createdDate: string;
  avatar?: string;
}

@Component({
  selector: 'app-action-comments',
  templateUrl: './action-comments.component.html',
  styleUrls: ['./action-comments.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ActionCommentsComponent {
  @Input() action: ActionItemDto | null = null;
  
  newComment = '';
  
  // Mock comments data based on the attached images
  comments: ActionComment[] = [
    {
      id: '1',
      author: 'John Smith',
      content: 'Started implementation of password policy in Active Directory',
      createdDate: '10/16/2023, 12:30:00 PM'
    },
    {
      id: '2',
      author: 'John Smith',
      content: 'Updated policy to require 12 characters minimum',
      createdDate: '10/25/2023, 5:15:00 PM'
    },
    {
      id: '3',
      author: 'John Smith',
      content: 'Completed implementation and tested with security team',
      createdDate: '11/10/2023, 6:45:00 PM'
    }
  ];

  addComment(): void {
    if (this.newComment.trim()) {
      const comment: ActionComment = {
        id: Date.now().toString(),
        author: 'Current User', // In real app, get from auth service
        content: this.newComment.trim(),
        createdDate: new Date().toLocaleString()
      };
      
      this.comments.push(comment);
      this.newComment = '';
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getUserAvatarClass(author: string): string {
    // Simple hash-based color assignment
    const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-secondary'];
    const hash = author.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
}
