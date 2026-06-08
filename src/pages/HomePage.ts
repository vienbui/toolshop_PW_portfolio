import { Page, Locator } from "@playwright/test";

export class HomePage {
     private page:Page
    private logo:Locator
    private menuDropdown: Locator
    private signOutBtn:Locator


    constructor(page:Page) {
        this.page = page
        this.logo = page.locator('.navbar-brand')
        this.signOutBtn = page.locator('[data-test="nav-sign-out"]')
        this.menuDropdown =page.locator('[data-test="nav-menu"]')
    }

    async navigateToHomePage(){
        await this.page.goto('/')
    }

   getHomePageLogo(){
        return this.logo
   }

   getUserNameMenu(){
        return this.menuDropdown
   }

   async clickMenuDropdown(){
     await this.menuDropdown.click()
   }

   async signOut(){
     await this.clickMenuDropdown()
     await this.signOutBtn.click()
   }
}