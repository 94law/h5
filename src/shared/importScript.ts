import { showConfirmDialog } from 'vant';

export interface ImportScriptOPtions {
  type?: string;
  async?: boolean;
  retry?: boolean;
}

export default function importScript(
  src: string,
  options: ImportScriptOPtions = {} as ImportScriptOPtions,
) {
  return new Promise<HTMLScriptElement>((resolve, reject) => {
    const loadScript = () => {
      const head = document.head ?? document.getElementsByTagName('head')[0];
      const script = document.createElement('script');

      script.type = options.type ?? 'text/javascript';
      script.async = options.async ?? true;
      script.src = src;

      script.onload = () => {
        script.onload = script.onerror = null;
        resolve(script);
      };

      script.onerror = () => {
        script.onload = script.onerror = null;
        script.parentNode?.removeChild(script);

        const err = new Error(`Failed to load ${script.src}`);

        if (options.retry) {
          showConfirmDialog({
            message: '加载失败，请重试',
            cancelButtonText: '取消',
            confirmButtonText: '重试',
          })
            .then(() => {
              loadScript();
            })
            .catch(() => {
              reject(err);
            });
        } else {
          reject(err);
        }
      };

      head.appendChild(script);
    };

    loadScript();
  });
}
