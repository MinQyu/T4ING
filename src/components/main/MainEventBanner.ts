import { TaingElement } from '../Taing';
import { MainData } from '../../@types/type';
import { customElement, property } from 'lit/decorators.js';
import { html, CSSResultGroup } from 'lit';
import { getEventBannerImageURL } from '../../api/getMainPageURL';
import Swiper from 'swiper';
import mainEventBannerCSS from '../../styles/mainEventBannerCSS';

interface SwiperContainerElement extends HTMLElement {
  swiper: Swiper;
}
@customElement('main-event-banner')
class MainRecommend extends TaingElement {
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

  static styles: CSSResultGroup = [super.styles, mainEventBannerCSS];

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
        `${import.meta.env.VITE_PB_API}/collections/main_event_banner/records`
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
        <h1>이벤트</h1>
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
            .slidesPerView=${2}
            .slidesPerGroup=${2}
            .spaceBetween=${10}
            .observer=${true}
            .observeParents=${true}
            .breakpoints="${{
              768: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 10,
              },
              1920: {
                slidesPerView: 5,
                slidesPerGroup: 5,
                spaceBetween: 10,
              },
            }}"
          >
            ${this.data.items
              .filter((item) => item.device === this.device)
              .map(
                (slide) => html`
                  <swiper-slide tabindex="0">
                    <figure class="slide-img-container">
                      <img
                        class="slide-img"
                        src="${getEventBannerImageURL(slide)}"
                        aria-label="${slide.description}"
                      />
                      <figcaption class="slide-title sr-only">
                        ${slide.description}
                      </figcaption>
                  </swiper-slide>
                `
              )}
            ${this.data.items
              .filter((item) => item.device === this.device)
              .map(
                (slide) => html`
                  <swiper-slide tabindex="0">
                    <figure class="slide-img-container">
                      <img
                        class="slide-img"
                        src="${getEventBannerImageURL(slide)}"
                        aria-label="${slide.description}"
                      />
                      <figcaption class="slide-title sr-only">
                        ${slide.description}
                      </figcaption>
                  </swiper-slide>
                `
              )}
          </swiper-container>
        </div>
      </div>
    `;
  }
}

export default MainRecommend;
