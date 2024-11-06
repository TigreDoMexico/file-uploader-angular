import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadUrl = 'http://127.0.0.1:16234/post';
  public readonly chunkSize = 20 * 1024 * 1024; // 5 MB

  constructor(private http: HttpClient) { }

  uploadFileInChunks(file: File): Observable<any> {
    const totalChunks = Math.ceil(file.size / this.chunkSize);
    const uploadObservables: Observable<any>[] = [];

    console.log('Total Chunks: ' + totalChunks);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.chunkSize;
      const end = Math.min(start + this.chunkSize, file.size);
      const chunk = file.slice(start, end);
      const chunkNumber = i + 1;

      const formData = new FormData();
      formData.append('file', chunk, file.name);
      formData.append('chunkNumber', chunkNumber.toString());
      formData.append('totalChunks', totalChunks.toString());

      uploadObservables.push(this.uploadChunk(formData));
    }

    return new Observable((observer) => {
      uploadObservables.forEach((upload) => {
        upload.subscribe({
          next: (response) => observer.next(response),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      });
    });
  }

  private uploadChunk(formData: FormData): Observable<any> {
    return this.http.post(this.uploadUrl, formData);
  }
}
