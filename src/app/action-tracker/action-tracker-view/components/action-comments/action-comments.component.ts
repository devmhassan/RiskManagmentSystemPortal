import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionItemDto } from '../../../../proxy/risk-managment-system/risks/dtos/models';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

@Component({
  selector: 'app-action-comments',
  templateUrl: './action-comments.component.html',
  styleUrls: ['./action-comments.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ActionCommentsComponent {
  @Input() action!: ActionItemDto;
  
  newComment: string = '';
  
  // Mock data for demonstration
  mockComments: Comment[] = [
    {
      id: '1',
      author: 'John Smith',
      content: 'Started implementation of password policy in Active Directory',
      date: '10/16/2023, 12:30:00 PM'
    },
    {
      id: '2',
      author: 'John Smith',
      content: 'Updated policy to require 12 characters minimum',
      date: '10/25/2023, 5:15:00 PM'
    },
    {
      id: '3',
      author: 'John Smith',
      content: 'Completed implementation and tested with security team',
      date: '11/10/2023, 6:45:00 PM'
    }
  ];

  addComment(): void {
    if (this.newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        author: 'Current User', // This should come from authentication service
        content: this.newComment.trim(),
        date: new Date().toLocaleString()
      };
      
      this.mockComments.push(newCommentObj);
      this.newComment = '';
    }
  }
}
