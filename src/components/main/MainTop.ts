import { TaingElement } from '../Taing';
import { MainData } from '../../@types/type';
import { customElement, property } from 'lit/decorators.js';
import { html, CSSResultGroup } from 'lit';
import { getTopImageURL } from '../../api/getMainPageURL';
import Swiper from 'swiper';
import mainTopCSS from '../../styles/mainTopCSS';

interface SwiperContainerElement extends HTMLElement {
  swiper: Swiper;
}
@customElement('main-top')
class MainTop extends TaingElement {
  @property({ type: Object }) data: MainData = {
    items: [],
    page: 0,
    perPage: 0,
    totalItems: 0,
    totalPages: 0,
  };
  @property({ type: Array }) slides: Array<{
    img: string;
    title: string;
  }> = [];
  @property({ type: String }) device = super.getDevice;
  @property({ type: Boolean }) isBeginning = true;
  @property({ type: Boolean }) isEnd = false;

  static styles: CSSResultGroup = [super.styles, mainTopCSS];

  get swiperContainer(): SwiperContainerElement | null {
    return this.renderRoot.querySelector(
      'swiper-container'
    ) as SwiperContainerElement | null;
  }

  get swiperInstance(): Swiper | null {
    return this.swiperContainer?.swiper || null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  firstUpdated() {
    if (this.swiperContainer) {
      // Swiper 인스턴스가 초기화될 때까지 기다리기
      if (!this.swiperInstance) {
        this.swiperContainer.addEventListener('swiper-init', (event: Event) => {
          this.handleResize();
          this.handleSlideState();
          this.attachNavigation();
          this.showNavigation();
          window.addEventListener('resize', this.handleResize);
        });
      } else {
        this.handleResize();
        this.handleSlideState();
        this.attachNavigation();
        this.showNavigation();
        window.addEventListener('resize', this.handleResize);
      }
    }
  }

  handleResize = () => {
    const newDevice = super.getDevice;
    if (this.device !== newDevice) {
      this.device = newDevice;
    }
  };

  async fetchData() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PB_API}/collections/main_top/records`
      );
      const data = await response.json();
      this.data = data;
    } catch (error) {
      console.error('Error fetching recommend data:', error);
    }
  }

  handleSlideState() {
    const swiper = this.swiperInstance;
    if (swiper) {
      this.swiperInstance.on('slideChange', () => {
        this.isBeginning = swiper.isBeginning;
        this.isEnd = swiper.isEnd;
      });
    }
  }

  attachNavigation() {
    const prevButton = this.renderRoot.querySelector('.prev-btn');
    const nextButton = this.renderRoot.querySelector('.next-btn');

    if (this.swiperInstance && prevButton && nextButton) {
      prevButton.addEventListener('click', () => {
        this.swiperInstance?.slidePrev();
      });

      nextButton.addEventListener('click', () => {
        this.swiperInstance?.slideNext();
      });
    }
  }

  showNavigation() {
    const swiperOuterWrapper = this.renderRoot.querySelector(
      '.swiper-outer-wrapper'
    );
    const swiperContainer = this.renderRoot.querySelector('swiper-container');
    const navButtons = this.renderRoot.querySelectorAll('.nav-btn');

    if (swiperContainer && navButtons && swiperOuterWrapper) {
      swiperOuterWrapper.addEventListener('mouseenter', () => {
        navButtons.forEach((button) => button.classList.add('show'));
      });

      swiperOuterWrapper.addEventListener('mouseleave', () => {
        navButtons.forEach((button) => {
          button.classList.remove('show');
        });
      });
    }
  }

  render() {
    return html`
      <div class="container">
        <h1>실시간 인기 프로그램</h1>
        <div class="swiper-outer-wrapper">
          <button
            class="nav-btn prev-btn"
            ?disabled=${this.isBeginning}
            aria-label="Go to previous slide"
          ></button>
          <button
            class="nav-btn next-btn"
            ?disabled=${this.isEnd}
            aria-label="Go to next slide"
          ></button>
          <swiper-container
            class="${this.isBeginning
              ? 'is-beginning'
              : this.isEnd
                ? 'is-end'
                : 'is-middle'}"
            .slidesPerView=${3}
            .slidesPerGroup=${3}
            .spaceBetween=${8}
            .observer=${true}
            .observeParents=${true}
            .breakpoints="${{
              768: {
                slidesPerView: 5,
                slidesPerGroup: 5,
                spaceBetween: 8,
              },
              1920: {
                slidesPerView: 6,
                slidesPerGroup: 6,
                spaceBetween: 8,
              },
            }}"
          >
            ${this.data.items
              .filter((item) => item.device === this.device)
              .sort((a, b) => b.views - a.views)
              .map(
                (slide, index) => html`
                  <swiper-slide tabindex="0">
                    <div class="ranking-container">
                      <div class="ranking" aria-label="실시간 ${index + 1}위">
                        ${index + 1}
                      </div>
                    </div>
                    <figure class="slide-img-container">
                      <img
                        class="slide-img"
                        src="${getTopImageURL(slide)}"
                        aria-label="${slide.title}"
                      />
                      <div class="icons-container">
                        <div class="icons-wrapper">
                          ${slide.age !== 0
                            ? html`
                                <div
                                  class="age-rating"
                                  aria-label="${slide.age}세 이상 관람가"
                                >
                                  <img
                                    src="/assets/images/icon/restricted_19_${this
                                      .device === 'mobile'
                                      ? 's'
                                      : this.device === 'tablet'
                                        ? 'm'
                                        : 'l'}.png"
                                    class="age-rating-icon"
                                    alt="Age Rating Icon"
                                  />
                                </div>
                              `
                            : ''}
                          ${slide.original
                            ? html`<div
                                class="t-original"
                                aria-label="Tving Original 콘텐츠"
                              >
                                <img
                                  src="/assets/images/icon/taing_original_${this
                                    .device === 'mobile'
                                    ? 's'
                                    : this.device === 'tablet'
                                      ? 'm'
                                      : 'l'}.png"
                                  class="t-original-icon"
                                  alt="Tving Original Icon"
                                />
                              </div>`
                            : ''}
                        </div>
                      </div>
                      <figcaption class="slide-title">
                        ${slide.title}
                        <span
                          class="${slide.new_ep === true
                            ? 'new updated'
                            : 'new'}"
                        >
                        </span>
                      </figcaption>
                    </figure>
                  </swiper-slide>
                `
              )}
          </swiper-container>
        </div>
      </div>
    `;
  }
}

export default MainTop;
