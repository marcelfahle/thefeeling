import { describe, expect, it } from 'vitest'
import { decodeEntities, htmlToText, projectSummary, truncate } from './text'

describe('text helpers', () => {
  it('decodes entities', () => {
    expect(decodeEntities('D&uuml;sseldorf &amp; &ldquo;Hi&rdquo; &#8211; &#x2014;')).toBe('Düsseldorf & “Hi” – —')
  })
  it('strips html and markdown', () => {
    expect(htmlToText('<p>A <strong>b</strong><br />c</p><p>d</p>')).toBe('A b c d')
    expect(htmlToText('**THE FEELING**  \n[Book us](mailto:x)')).toBe('THE FEELING Book us')
  })
  it('truncates at a word boundary', () => {
    expect(truncate('one two three four', 12)).toBe('one two…')
    expect(truncate('short', 12)).toBe('short')
  })
  it('splits the credit paragraph', () => {
    const html =
      '<div style="text-align: left;"><p><span>Porsche Bank<br /></span><span><strong>Ads and Social Media Campaign</strong><br /></span><em><span>Car Subscription</span></em></p><span>Do you still <i>own</i> a car?</span></div>'
    expect(projectSummary(html)).toEqual({
      client: 'Porsche Bank',
      kind: 'Ads and Social Media Campaign',
      subject: 'Car Subscription',
      body: 'Do you still own a car?',
    })
  })
  it('separates an italic subject from a run-on story', () => {
    const html =
      '<p><span>WDR<br /></span><span><strong>Social Media Ad Campaign</strong><br /></span><em>Podcast “Heimatmysterium”</em> Life is a weird thing.</p><p>More.</p>'
    expect(projectSummary(html)).toMatchObject({
      subject: 'Podcast “Heimatmysterium”',
      body: 'Life is a weird thing. More.',
    })
  })
  it('treats a long third line as story, not subject', () => {
    const long =
      'Meditation, a regular workout, fresh food, being nice to other people – forget about all that. Just jewelry.'
    expect(projectSummary(`<p>Onsanto<br><strong>Logo Design</strong><br>${long}</p>`)).toMatchObject({
      subject: '',
      body: long,
    })
  })
  it('falls back to body only', () => {
    expect(projectSummary('<p>Just a sentence.</p>')).toEqual({
      client: '',
      kind: '',
      subject: '',
      body: 'Just a sentence.',
    })
    expect(projectSummary(null).body).toBe('')
  })
})
