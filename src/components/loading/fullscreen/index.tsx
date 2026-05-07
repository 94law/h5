import { createApp, reactive, type ComponentPublicInstance } from 'vue';
import { Overlay } from 'vant';
import BounceDot from '@/components/loading/bounce-dot.vue';
import styles from './style.module.css';

/**
 * 延迟显示loading
 * @remarks 考虑到用户频繁请求接口的风险，不宜调整过大
 */
const DELAY_SHOW_TIME = 500;

/**
 * 延迟隐藏loading
 * @remarks 防止连续调用时频繁切换显示/隐藏loading
 */
const DELAY_HIDE_TIME = 300;

let instance: ComponentPublicInstance<
  {},
  {},
  {},
  {},
  {
    show: () => void;
    hide: () => void;
  }
>;

function createInstance() {
  if (instance) return instance;

  const component = defineComponent({
    name: 'FullscreenLoading',
    setup() {
      const state = reactive<{
        visible: boolean;
        count: number;
        showTimer: TimeoutId;
        hideTimer: TimeoutId;
        started: boolean;
      }>({
        visible: false,
        count: 0,
        showTimer: null,
        hideTimer: null,
        started: false,
      });

      // @exposed-api
      const show = () => {
        state.count += 1;

        // 多次调用只展示一次
        if (state.started) {
          return;
        }

        state.started = true;
        state.showTimer = setTimeout(() => {
          state.visible = true;
        }, DELAY_SHOW_TIME + DELAY_HIDE_TIME);
      };

      // @exposed-api
      const hide = () => {
        state.count -= 1;

        if (!state.started) {
          return;
        }

        if (state.hideTimer) {
          clearTimeout(state.hideTimer);
          state.hideTimer = null;
        }

        state.hideTimer = setTimeout(() => {
          if (state.count <= 0) {
            state.count = 0;
            state.started = false;

            if (state.showTimer != null) {
              clearTimeout(state.showTimer);
              state.showTimer = null;
            }

            state.visible = false;
          }
        }, DELAY_HIDE_TIME);
      };

      return {
        state,
        show,
        hide,
      };
    },
    render() {
      return (
        <Overlay show={this.state.visible} zIndex={9999} class={styles.container}>
          <div class={styles.loading}>
            <BounceDot />
          </div>
        </Overlay>
      );
    },
  });

  const container = document.createElement('div');
  document.body.appendChild(container);
  instance = createApp(component).mount(container) as typeof instance;

  return instance;
}

export default createInstance();
