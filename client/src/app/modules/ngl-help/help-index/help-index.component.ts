import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';


interface IHelpBlock {
  name: string
  text: IHelpContent[]
};

interface IHelpContent {
  text: string
  hasIssue: boolean
  issue?: string
};

@Component({
  selector: 'dyno-help-index',
  templateUrl: './help-index.component.html',
  styleUrls: ['./help-index.component.scss']
})
export class HelpIndexComponent implements OnInit {
  public header: string|null = null;
  public content: IHelpBlock[]|null = null;
  private baseUrl = environment.base_url;

  constructor(
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.http.get(`${this.baseUrl}/data/help.json`).subscribe((info: any) => {
      if (info && info.content) {
        this.content = <IHelpBlock[]>(info.content);
      }
    });
  }

}
