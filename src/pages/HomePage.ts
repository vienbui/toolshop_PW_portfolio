import { Page, Locator } from "@playwright/test";

export class HomePage {
     private page:Page
    private logo:Locator
    private menu:Locator


    constructor(page:Page) {
        this.page = page
        this.logo = page.locator('.navbar-brand')
        this.menu = page.locator('#menu')
    }

   getHomePageLogo(){
        return this.logo
   }

   getUserNameMenu(){
        return this.menu
   }
}