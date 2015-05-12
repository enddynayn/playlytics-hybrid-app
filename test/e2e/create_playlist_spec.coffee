describe 'Playlists', ->
  browser.executeScript('window.localStorage.clear();')
  beforeEach ->
    # browser.get('http://localhost:8100')
    # browser.executeScript('window.localStorage.clear();')
    browser.waitForAngular()

  it "should find playlist", ->
    element(By.linkText('Playlists')).click()
    expect(browser.getCurrentUrl()).toEqual('http://localhost:8100/#/tab/playlists')

  it "should be able add new playlist", ->
    element(By.model('data.newPlaylist')).sendKeys('shakira')
    element(By.buttonText('Submit')).click()
    expect(element(By.css('.track-title')).isPresent()).toEqual(true)
