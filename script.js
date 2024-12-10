export class Utils {
  constructor(selector) {
    this.elements = Utils.getSelector(selector);
    this.element = this.get(0);
    return this;
  }

  on(events, listener) {
    events.split(" ").forEach((eventName) => {
      this.each((el) => {
        const tNEventName = Utils.setEventName(el, eventName);
        if (!Array.isArray(Utils.eventListeners[tNEventName])) {
          Utils.eventListeners[tNEventName] = [];
        }
        Utils.eventListeners[tNEventName].push(listener);

        // https://github.com/microsoft/TypeScript/issues/28357
        if (el) {
          el.addEventListener(eventName.split(".")[0], listener);
        }
      });
    });

    return this;
  }
  offset() {
    if (!this.element) {
      return {
        left: 0,
        top: 0,
      };
    }
    const box = this.element.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft,
    };
  }
  static getSelector(selector, context) {
    if (selector && typeof selector !== "string") {
      if (selector.length !== undefined) {
        return selector;
      }
      return [selector];
    }
    context = context || document;

    // For performance reasons, use getElementById
    // eslint-disable-next-line no-control-regex
    const idRegex = /^#(?:[\w-]|\\.|[^\x00-\xa0])*$/;
    if (idRegex.test(selector)) {
      const el = document.getElementById(selector.substring(1));
      return el ? [el] : [];
    }
    return [].slice.call(context.querySelectorAll(selector) || []);
  }
  get(index) {
    if (index !== undefined) {
      return this.elements[index];
    }
    return this.elements;
  }
  each(func) {
    if (!this.elements.length) {
      return this;
    }
    this.elements.forEach((el, index) => {
      func.call(el, el, index);
    });
    return this;
  }
  static setEventName(el, eventName) {
    // Need to verify https://stackoverflow.com/questions/1915341/whats-wrong-with-adding-properties-to-dom-element-objects
    const elementUUId = el.eventEmitterUUID;
    const uuid = elementUUId || Utils.generateUUID();
    // eslint-disable-next-line no-param-reassign
    el.eventEmitterUUID = uuid;
    return Utils.getEventName(eventName, uuid);
  }
  static generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      // eslint-disable-next-line no-bitwise
      const r = (Math.random() * 16) | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  static getEventName(eventName, uuid) {
    return eventName + "__EVENT_EMITTER__" + uuid;
  }
}

Utils.eventListeners = {};

export default function $utils(selector) {
  return new Utils(selector);
}
