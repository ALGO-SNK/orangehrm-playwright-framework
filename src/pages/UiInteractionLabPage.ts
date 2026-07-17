import { type FrameLocator, type Locator, type Page } from '@playwright/test';

export class UiInteractionLabPage {
  readonly alertButton: Locator;
  readonly apiStatus: Locator;
  readonly confirmButton: Locator;
  readonly consoleButton: Locator;
  readonly countrySelect: Locator;
  readonly doubleClickButton: Locator;
  readonly doubleClickStatus: Locator;
  readonly downloadLink: Locator;
  readonly dragSource: Locator;
  readonly dropTarget: Locator;
  readonly emailInput: Locator;
  readonly enterprisePlan: Locator;
  readonly eventStatus: Locator;
  readonly fileInput: Locator;
  readonly fetchButton: Locator;
  readonly formStatus: Locator;
  readonly nameInput: Locator;
  readonly newsletterCheckbox: Locator;
  readonly notesEditor: Locator;
  readonly paymentFrame: FrameLocator;
  readonly popupButton: Locator;
  readonly promptButton: Locator;
  readonly saveButton: Locator;
  readonly tooltip: Locator;
  readonly tooltipTrigger: Locator;
  readonly userRows: Locator;
  readonly volumeSlider: Locator;

  constructor(readonly page: Page) {
    this.nameInput = page.getByTestId('name-input');
    this.emailInput = page.getByLabel('Email');
    this.countrySelect = page.getByLabel('Country');
    this.newsletterCheckbox = page.getByLabel('Subscribe to newsletter');
    this.enterprisePlan = page.getByLabel('Enterprise');
    this.volumeSlider = page.getByLabel('Volume');
    this.saveButton = page.getByRole('button', { name: 'Save profile' });
    this.formStatus = page.locator('#form-status');
    this.tooltipTrigger = page.getByRole('button', { name: 'Hover for help' });
    this.tooltip = page.getByRole('tooltip');
    this.doubleClickButton = page.getByRole('button', { name: 'Double-click me' });
    this.doubleClickStatus = page.locator('#double-click-status');
    this.dragSource = page.locator('#drag-source');
    this.dropTarget = page.locator('#drop-target');
    this.notesEditor = page.getByTestId('notes-editor');
    this.alertButton = page.getByRole('button', { name: 'Show alert' });
    this.confirmButton = page.getByRole('button', { name: 'Show confirmation' });
    this.promptButton = page.getByRole('button', { name: 'Show prompt' });
    this.consoleButton = page.getByRole('button', { name: 'Write console message' });
    this.popupButton = page.getByRole('button', { name: 'Open popup' });
    this.downloadLink = page.getByRole('link', { name: 'Download CSV' });
    this.fileInput = page.locator('#file-input');
    this.fetchButton = page.getByRole('button', { name: 'Fetch items' });
    this.eventStatus = page.locator('#event-status');
    this.apiStatus = page.locator('#api-status');
    this.paymentFrame = page.frameLocator('iframe[title="Payment frame"]');
    this.userRows = page.getByRole('table', { name: 'Users' }).getByRole('row');
  }
}
