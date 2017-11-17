import {
  Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef,
  SimpleChanges
} from '@angular/core';

import { FeedService } from '../../../../../services';

@Component({
  selector: 'app-attachment-post',
  templateUrl: './attachment-post.component.html',
  styleUrls: ['./attachment-post.component.scss']
})
export class AttachmentPostComponent implements OnInit, OnChanges {
  @Input() feed;
  @Input() imageSrc: string;
  @Input() loadImgId: string;
  @Input() editable: boolean;
  @ViewChild('text_input') textInput: ElementRef;
  @Output() onDoAction = new EventEmitter();
  public linkData = null;
  public text: string;
  public isLinkData = false;
  private pastedValue: string;

  constructor(private feedService: FeedService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.text = this.editable ? this.parseTextFromHtml(this.feed.text) : this.feed.text;
    const isImageSrc = !!changes['imageSrc'] && !!changes['imageSrc']['currentValue'];
    if (!isImageSrc) {
      this.isLinkData = !!this.feed.linkData;
      this.linkData = this.isLinkData ? {...this.feed.linkData} : null;
    }
  }

  parseTextFromHtml(str: string) {
    const temporalDivElement = document.createElement('div');
    temporalDivElement.innerHTML = str;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || '';
  }

  saveOrCancel(flag: boolean) {
    if (!flag) {
      this.onDoAction.emit({key: 'cancel', payload: null});
      return;
    }

    const text = this.textInput.nativeElement.innerText;
    const attachment = !!this.loadImgId ? [this.loadImgId] : [];
    const linkData = !!this.linkData && this.linkData.show ? this.linkData : null;
    this.onDoAction.emit({key: 'save', payload: {flag, text, linkData, attachment}});
  }

  onPaste(data) {
    let pastedValue = '';
    if (!data.clipboardData) { // IE11
      pastedValue = window['clipboardData'].getData('text');
    } else {
      pastedValue = data.clipboardData.getData('text/plain');
    }
    this.pastedValue = pastedValue;
    const regx = /(\b(((https?|ftp):\/\/)|www.)[A-Z0-9+&@#\/%?=~_|!:,.;-]*[-A-Z0-9+&@#\/%=~_|])/gim;
    if (this.pastedValue.search(regx) !== -1) {
      this.feedService.urlInfo(pastedValue)
        .subscribe(res => {
          this.text = this.textInput.nativeElement.innerText.replace(this.pastedValue, ' ' + this.pastedValue);
          this.textInput.nativeElement.innerText = this.text;
          this.linkData = Object.assign({}, res.data, {show: true});
          this.isLinkData = true;
        });
    }
  }

  hideAttachedData() {
    this.linkData.show = false;
    this.onDoAction.emit({key: 'showLinkData', payload: false});
  }

  removeImage() {
    this.onDoAction.emit({key: 'removeImage', payload: null});
  }

}