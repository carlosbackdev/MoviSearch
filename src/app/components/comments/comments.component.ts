import { Component, Input, OnInit } from '@angular/core';
import { Endpoints } from '../../endpoints/Endpoints';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentHttpService } from '../../services/comment-http.service';
import { MarkdownModule } from 'ngx-markdown';
import { AuthService } from '../../services/auth.service';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';

@Component({
  selector: 'app-comments',
  imports: [FormsModule, CommonModule, MarkdownModule, AuthModalComponent],
  providers: [CommentHttpService],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {

  @Input() movieId!: number;
  currentUser = localStorage.getItem('username')?.trim() || '';
  config: any = {};
  loading: boolean = true;
  showCommentBox: boolean = false;
  newComment: string = '';
  showLoginModal: boolean = false;
  showListModal: boolean = false;

  constructor(private commentHttpService: CommentHttpService,private authService: AuthService) {}

  ngOnInit(): void {
    this.getComments();
    console.log(this.currentUser);
  }

  getComments(): void {
    this.loading = true;
    this.commentHttpService.get(this.movieId).subscribe({
      next: (comments: any) => {
        this.config = comments;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al obtener los comentarios:', error);
        this.loading = false;
      }
    });
  }

  trackComment(index: number, comment: any): number {
    return comment.id;
  }

  toggleCommentBox(): void {
    if (this.authService.isAuthenticated()) {
      this.showCommentBox = !this.showCommentBox;
      this.showListModal=true;
    } else {
      this.showLoginModal = true;
      return;
    }
  }

  formatText(format: string): void {
    const textarea = document.querySelector('.comment-textarea') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'ul':
        formattedText = `- ${selectedText}`;
        break;
      case 'ol':
        formattedText = `1. ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      case 'code':
        formattedText = "```\n" + selectedText + "\n```";
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }

    textarea.setRangeText(formattedText, start, end, 'end');
  }  

  submitComment(): void {
    if (this.newComment.trim()) {
      this.commentHttpService.post(this.movieId, this.newComment).subscribe({
        next: (response: any) => {
          console.log("Comentario enviado:", response);
          this.getComments(); 
          this.newComment = ''; 
          this.showCommentBox = false; 
        },
        error: (error: any) => {
          console.error("Error al enviar el comentario:", error);
        }
      });
    }
  }

  likeComment(idCommentLike: number){
    if(this.authService.isAuthenticated()){
      this.setLikeComment(idCommentLike);
    }else {
      this.showLoginModal = true;
      return;
    }
  }

  setLikeComment(idCommentLike: number): void{
    this.commentHttpService.postLike(idCommentLike).subscribe(
        () => {
          this.getComments();  
        },
        (error: any) => {
          console.error('Error al eleminar la lista:', error);
        }
      );
    }  

  deleteComment(id: number): void {
    console.log(id);
    this.commentHttpService.deleteComment(id).subscribe(
      () => {
        console.log(`Lista ${id} eliminada`);
        this.getComments();  
      },
      (error: any) => {
        console.error('Error al eleminar la lista:', error);
      }
    );
  }

}