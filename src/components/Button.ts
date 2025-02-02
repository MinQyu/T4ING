import { CSSResultGroup, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { TaingElement } from './Taing';
import { buttonCSS } from '../styles/buttonCSS';

@customElement('t-button')
class Button extends TaingElement {
  static styles: CSSResultGroup = [
    super.styles,
    buttonCSS['t-button'],
    css`
      :host {
        --min-inline-size: 18rem;
        display: block;
        inline-size: var(--min-inline-size);
        margin-inline: auto;

        @media (min-width: 48rem) {
          --min-inline-size: 26rem;
        }
        @media (min-width: 120rem) {
          --min-inline-size: 45.75rem;
        }
      }
    `,
  ];

  @property({ type: String }) buttonType: 'submit' | 'reset' | 'button' =
    'button';
  @property({ type: String }) color: 'primary' | 'secondary' | 'line' | null =
    null;
  @property({ type: Boolean }) disabled = false;

  handleClick() {
    if (this.buttonType === 'submit') {
      const form = this.closest('form');

      if (form) {
        const submitEvent = new Event('submit', {
          bubbles: true,
          cancelable: true,
        });

        form.dispatchEvent(submitEvent);
      }
    }
  }

  render() {
    return html`
      <button
        type=${this.buttonType}
        ?disabled=${this.disabled}
        class=${classMap({
          btn: true,
          [this.color || '']: !!this.color,
        })}
        @click=${this.handleClick}
      >
        <slot>확인</slot>
      </button>
    `;
  }
}
