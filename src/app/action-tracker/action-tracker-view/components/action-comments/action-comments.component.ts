import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionDetailsDto } from '../../../../proxy/risk-managment-system/risks/dtos/models';
import { ActionCommentDto, CreateActionCommentDto } from '../../../../proxy/risk-managment-system/risks/models';
import { ActionType } from '../../../../proxy/risk-managment-system/domain/shared/enums/action-type.enum';
import { ActionCommentService } from '../../../../proxy/risk-managment-system/actions/action-comment.service';

@Component({
  selector: 'app-action-comments',
  templateUrl: './action-comments.component.html',
  styleUrls: ['./action-comments.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ActionCommentsComponent implements OnInit, OnChanges {
  @Input() action: ActionDetailsDto | null = null;
  
  comments: ActionCommentDto[] = [];
  newComment = '';
  loading = false;
  error: string | null = null;
  submittingComment = false;

  constructor(private actionCommentService: ActionCommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['action'] && this.action) {
      this.loadComments();
    }
  }

  private loadComments(): void {
    if (!this.action?.actionId) {
      return;
    }

    this.loading = true;
    this.error = null;
    
    const actionId = parseInt(this.action.actionId, 10);
    if (isNaN(actionId)) {
      this.error = 'Invalid action ID';
      this.loading = false;
      return;
    }

    // Determine if this is a prevention or mitigation action based on action type
    const isPreventive = this.action.type === ActionType.Preventive;
    
    const request$ = isPreventive
      ? this.actionCommentService.getByPreventionActionId(actionId)
      : this.actionCommentService.getByMitigationActionId(actionId);

    request$.subscribe({
      next: (comments) => {
        this.comments = comments || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.error = 'Failed to load comments';
        this.loading = false;
        // Fall back to comments from action details if available
        this.comments = this.action?.comments || [];
      }
    });
  }

  addComment(): void {
    if (!this.newComment.trim() || !this.action?.actionId) {
      return;
    }

    this.submittingComment = true;
    this.error = null;

    const actionId = parseInt(this.action.actionId, 10);
    if (isNaN(actionId)) {
      this.error = 'Invalid action ID';
      this.submittingComment = false;
      return;
    }

    const createCommentDto: CreateActionCommentDto = {
      content: this.newComment.trim(),
      authorName: 'Current User', // TODO: Get from auth service
      ...(this.action.type === ActionType.Preventive 
        ? { preventionActionId: actionId }
        : { mitigationActionId: actionId })
    };

    this.actionCommentService.create(createCommentDto).subscribe({
      next: (newComment) => {
        this.comments.push(newComment);
        this.newComment = '';
        this.submittingComment = false;
        // Show success message briefly
        this.showSuccessMessage('Comment added successfully');
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.error = 'Failed to add comment. Please try again.';
        this.submittingComment = false;
      }
    });
  }

  deleteComment(commentId: number): void {
    if (!commentId || !confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    this.actionCommentService.delete(commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== commentId);
        this.showSuccessMessage('Comment deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
        this.error = 'Failed to delete comment. Please try again.';
      }
    });
  }

  private showSuccessMessage(message: string): void {
    // Simple success feedback - could be improved with a toast service
    const originalError = this.error;
    this.error = null;
    console.log(message);
    // You could emit an event here to show a toast notification
  }

  refreshComments(): void {
    this.loadComments();
  }

  getInitials(name?: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getUserAvatarClass(author?: string): string {
    if (!author) return 'bg-secondary';
    // Simple hash-based color assignment
    const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-secondary'];
    const hash = author.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  getAuthorName(comment: ActionCommentDto): string {
    return comment.authorName || comment.commentedBy || 'Unknown User';
  }

  getCommentContent(comment: ActionCommentDto): string {
    return comment.content || comment.comment || '';
  }

  getCommentDate(comment: ActionCommentDto): string {
    return comment.commentedDate || comment.creationTime || comment.lastModificationTime || '';
  }
}
