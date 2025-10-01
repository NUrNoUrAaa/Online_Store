import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'error';

export interface Toast {
  show(arg0: string, arg1: string, arg2: number): unknown;
  id: number;
  message: string;
  type: ToastType;
  timeout: number;
  removing?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<Toast[]>([]);

  getToasts() {
    return this.toasts();
  }

  show(message: string, type: ToastType = 'success', timeout = 3000) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const t: Toast = {
      id, message, type, timeout, removing: false,
      show: function (arg0: string, arg1: string, arg2: number): unknown {
        throw new Error('Function not implemented.');
      }
    };
    this.toasts.update(arr => [...arr, t]);

    setTimeout(() => {
      this.toasts.update(arr => arr.map(x => (x.id === id ? { ...x, removing: true } : x)));
      setTimeout(() => {
        this.toasts.update(arr => arr.filter(x => x.id !== id));
      }, 320);
    }, timeout);
  }



  remove(id: number) {
    this.toasts.update(arr => arr.filter(x => x.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}
