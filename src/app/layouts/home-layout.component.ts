import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-home-layout',
  template: `
    <app-header></app-header>
  `
  // <router-outlet></router-outlet>
  ,
  styles: []
})
export class HomeLayoutComponent {
  constructor(private translate: TranslateService){
    console.log(" HOME LAYOUT INVOKED");
    translate.setDefaultLang('en');
    this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
    {
      if(event.lang == 'ar')
      {  
        this.translate.setDefaultLang('ar');
        this.translate.use('ar')
        
      } 
      else
      {
        this.translate.setDefaultLang('en');
        this.translate.use('en')
      }
    });
  }

  ngOnInit() {
    console.log(" HOME LAYOUT INVOKED");
  }

}
