import { Component } from '@angular/core';
import { FileUploadService } from './file-upload.service';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  uploadProgress = 0;

  constructor(private fileUploadService: FileUploadService) {}

  onFileSelected(event: Event) {
    this.uploadProgress = 0;

    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      this.fileUploadService.uploadFileInChunks(file).subscribe({
        next: (response) => {
          this.uploadProgress = Math.round((this.uploadProgress + 1) * (100 / Math.ceil(file.size / this.fileUploadService.chunkSize)));
        },
        error: (error) => {
          console.error('Upload failed:', error);
        },
        complete: () => {
          this.uploadProgress = 100
          console.log('Upload complete');
        },
      });
    }
  }
}
