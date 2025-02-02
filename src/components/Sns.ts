import { html, css, CSSResultGroup } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TaingElement } from './Taing';

@customElement('sns-group')
export class Sns extends TaingElement {
  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        display: flex;
        column-gap: var(--size-2);
        padding-block: var(--size-2);
        @media (min-width: 48rem) {
          padding-block: var(--size-3);
        }
        @media (min-width: 120rem) {
          column-gap: var(--size-5);
          padding-block: var(--size-6);
        }
      }

      .btn-sns {
        display: inline-block;
        block-size: var(--size-6);
        background-color: var(--gray800);
        background-position: 50%;
        background-size: contain;
        background-repeat: no-repeat;
        border-radius: 50%;
        aspect-ratio: 1/1;
        transition: block-size 0.3s;

        &.youtube {
          background-image: url('/assets/images/icon/sns_youtube.svg');
        }
        &.instragram {
          background-image: url('/assets/images/icon/sns_instra.svg');
        }
        &.twitter {
          background-image: url('/assets/images/icon/sns_twitter.svg');
        }
        &.facebook {
          background-image: url('/assets/images/icon/sns_facebook.svg');
        }

        @media (min-width: 48rem) {
          block-size: 1.875rem;
        }
        @media (min-width: 120rem) {
          block-size: 3.25rem;
        }
      }
    `,
  ];

  snsList = [
    { snsName: 'youtube', url: '' },
    { snsName: 'instragram', url: '' },
    { snsName: 'twitter', url: '' },
    { snsName: 'facebook', url: '' },
  ];

  render() {
    return html`
      ${this.snsList.map(({ snsName, url }) => {
        return html`
          <a
            href="${url || '/'}"
            title="${snsName} 사이트로 이동합니다."
            class="btn-sns ${snsName}"
            target="_blank"
            rel="noopener noreferrer"
            ><span class="sr-only">${snsName}</span></a
          >
        `;
      })}
    `;
  }
}
