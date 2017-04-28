import { TicsUiPage } from './app.po';

describe('tics-ui App', () => {
  let page: TicsUiPage;

  beforeEach(() => {
    page = new TicsUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
