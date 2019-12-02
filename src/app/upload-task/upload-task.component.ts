import {Component, Input, OnInit} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {finalize, tap} from 'rxjs/operators';
import {FileService} from './service/file.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ICard} from '../card/icard';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.css']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;

  @Input() card: ICard;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;


  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private fileService: FileService
  ) {
  }

  fireForm = this.fb.group({
    id: [''],
    url: [''],
    card: [''],
  });

  ngOnInit() {
    this.startUpload();
    this.fireForm = this.fb.group({
      id: [''],
      url: [''],
      card: [''],
    });
  }

  startUpload() {

    // The storage path
    const path = `test/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    const fileType = this.file.name.split('.');

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise().then();
        this.db.collection('files').add({downloadURL: this.downloadURL, path});

        const {value} = this.fireForm;
        value.url = this.downloadURL.toString();
        value.card = this.card;
        value.type = fileType[1];
        value.fileName = fileType[0];
        console.log(value);

        this.fileService.createFile(value).subscribe(next => {
          console.log(next);
          console.log('success upload file');
        }, error => {
          console.log('fail to upload file');
        });
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
