import type { App, Component, Plugin } from 'vue';

export default function withInstall<T extends Component>(component: T) {
  (component as Plugin).install = (app: App) => {
    if (component.name) {
      app.component(component.name, component);
    }
  };

  return component as T & Plugin;
}
