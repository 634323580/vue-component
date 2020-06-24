<template>
  <div
    class="gallery-wrap"
    ref="wrap"
    @keyup.esc="onClose"
    v-if="show"
    tabindex="-1"
  >
    <div class="gallery-inner">
      <div
        v-if="currentIndex > 0 && !zoomed"
        @click="onPrev"
        class="control prev"
      ></div>
      <div
        v-if="currentIndex < imagesState.length - 1 && !zoomed"
        @click="onNext"
        class="control next"
      ></div>
      <div v-if="!zoomed" @click="onClose" class="control close">
        <svg viewBox="0 0 15.4 15.4" class="close-icon">
          <path
            d="M15.4 1.4L14 0 7.7 6.3 1.4 0 0 1.4l6.3 6.3L0 14l1.4 1.4 6.3-6.3 6.3 6.3 1.4-1.4-6.3-6.3z"
            class="close-path"
          ></path>
        </svg>
      </div>
      <div class="counter-bar-wrapper">
        <div class="counter-bar">
          <div class="counter-hinter">
            <span class="current-index">{{ currentIndex + 1 }}</span
            ><span>/ {{ imagesState.length }}</span>
          </div>
        </div>
      </div>
      <div class="gallery-contents">
        <transition-group name="fade">
          <div
            class="slide"
            @click="onZoomable(item.zoomable, index)"
            :class="{
              zoomable: item.zoomable,
              zoomed: zoomed,
            }"
            :key="index"
            v-show="index === currentIndex"
            v-for="(item, index) in imagesState"
          >
            <transition name="fade">
              <img v-if="item.fetch" :src="item.url" class="slide-img" />
              <div v-else class="loading">
                <img src="./loading.svg" />
              </div>
            </transition>
            <!-- <div v-else class="loading" style="color: #fff; font-size: 20px;">
              loading...
            </div> -->
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Gallery",
  model: {
    prop: "show",
    event: "on-close",
  },
  props: {
    // 显示隐藏
    show: {
      type: Boolean,
      default: false,
    },
    // 当前图片位置
    index: {
      type: Number,
      default: 0,
    },
    // 图片集
    images: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // 放大
      zoomed: false,
      // 图片集状态
      imagesState: [],
      // 当前图片位置
      currentIndex: null,
    };
  },
  methods: {
    // 放大
    onZoomable(zoomable, index) {
      if (zoomable) {
        this.zoomed = !this.zoomed;
      }
    },
    // 上一张
    onPrev() {
      this.currentIndex--;
      this.loadImg(this.currentIndex);
    },
    // 下一张
    onNext() {
      this.currentIndex++;
      this.loadImg(this.currentIndex);
    },
    // 关闭
    onClose() {
      this.$emit("on-close", false);
      this.zoomed = false;
    },
    // 加载图片
    loadImg(index) {
      if (this.imagesState[index].fetch) return;
      let img = new Image();
      img.src = this.imagesState[index].url;
      img.addEventListener("load", (e) => {
        this.imagesState[index].fetch = true;
        // 图片高度大于窗口高度标志为可缩放
        if (img.height > window.innerHeight) {
          this.imagesState[index].zoomable = true;
        }
      });
      img.addEventListener("error", (e) => {
        this.imagesState[index].fetch = true;
      });
    },
  },
  watch: {
    // 初始化图片状态
    images: {
      immediate: true,
      handler(images) {
        this.imagesState = images.map((url) => {
          return {
            fetch: false,
            zoomable: false,
            url,
          };
        });
      },
    },
    // 如果显示，则默认显示传入的位置
    show(isShow) {
      if (isShow) {
        this.currentIndex = this.index;
        this.loadImg(this.currentIndex);
        this.$nextTick(() => {
          this.$refs.wrap.focus();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.gallery-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1001;
}
.gallery-inner {
  user-select: none;
}
.gallery-contents {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #222;
  .slide {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .slide-img {
      position: relative;
      max-width: 100vw;
      max-height: 100vh;
      z-index: 1000;
    }
    &.zoomable {
      cursor: zoom-in;
    }
    &.zoomed {
      align-items: baseline;
      cursor: zoom-out;
      overflow: auto;
      .slide-img {
        max-height: inherit;
      }
    }
  }
}
.control {
  width: 30vw;
  height: 100vh;
  position: absolute;
  top: 0;
  z-index: 1003;
  &.prev {
    left: 0;
    cursor: url(https://b-gold-cdn.xitu.io/v3/static/img/left.906c5c1.cur), auto;
  }
  &.next {
    right: 0;
    cursor: url(https://b-gold-cdn.xitu.io/v3/static/img/right.6275260.cur),
      auto;
  }
  &.close {
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: hsla(0, 0%, 41.2%, 0.2);
    transition: 0.2s;
    cursor: pointer;
    .close-icon {
      position: absolute;
      top: 35%;
      left: 35%;
      width: 30%;
      height: 30%;
      .close-path {
        fill: #fff;
      }
    }
    &:hover {
      transform: rotate(-90deg);
      background-color: hsla(0, 0%, 58.8%, 0.5);
    }
  }
}
.counter-bar-wrapper {
  position: absolute;
  bottom: 0;
  z-index: 1003;
  width: 100%;
  height: 66px;
  line-height: 66px;
  text-align: center;
  cursor: default;
  .counter-bar {
    background-color: rgba(0, 0, 0, 0.6);
    transform: translateY(100%);
    transition: 0.3s;
    .counter-hinter {
      font-size: 24px;
      font-weight: 600;
      color: hsla(0, 0%, 100%, 0.6);
      .current-index {
        margin-right: 8px;
        font-size: 36px;
        color: #fff;
      }
    }
  }
  &:hover {
    .counter-bar {
      transform: translateY(0);
    }
  }
}
.loading {
  img {
    width: 50px;
  }
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
}
.fade-leave,.fade-leave-to{
  display: none;
}
</style>
