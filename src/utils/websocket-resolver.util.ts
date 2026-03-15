type ClientId = string;
type OnMessageCallback = (msg: string) => void;

interface SocketState {
  isConnected: boolean;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  maxReconnectDelay: number;
}

class RawSocketService {
  private sockets: Record<ClientId, WebSocket> = {};
  private callbacks: Record<ClientId, OnMessageCallback> = {};
  private reconnectStates: Record<ClientId, SocketState> = {};
  private urls: Record<ClientId, string> = {}; // ← ДОБАВИТЬ

  connect(id: ClientId, url: string, onMessage: OnMessageCallback) {
    if (this.sockets[id] && this.sockets[id].readyState === WebSocket.OPEN) {
      console.log(`✅ ${id}: already connected`);
      return;
    }

    this.urls[id] = url; // ← СОХРАНИТЬ URL
    this.callbacks[id] = onMessage;
    this.initReconnectState(id);
    this.createSocket(id, url);
  }

  private initReconnectState(id: ClientId) {
    this.reconnectStates[id] = {
      isConnected: false,
      reconnectAttempts: 0,
      maxReconnectAttempts: 10,
      reconnectDelay: 1000,
      maxReconnectDelay: 30000
    };
  }

  private createSocket(id: ClientId, url: string) {
    const state = this.reconnectStates[id];
    const ws = new WebSocket(url);
    this.sockets[id] = ws;

    ws.onopen = () => {
      console.log(`✅ ${id}: connected`);
      state.isConnected = true;
      state.reconnectAttempts = 0;
      state.reconnectDelay = 1000;
    };

    ws.onmessage = (event) => {
      this.callbacks[id]?.(event.data);
    };

    ws.onerror = (error) => {
      console.error(`❌ ${id}: error`, error);
    };

    ws.onclose = (event) => {
      console.log(`🔌 ${id}: closed`, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        readyState: ws.readyState
      });
      delete this.sockets[id];
      state.isConnected = false;

      // Reconnect только при сетевых ошибках
      if (event.code === 1006 || event.code === 1001 || !event.wasClean) {
        console.log(`🔄 ${id}: scheduling reconnect (attempts: ${state.reconnectAttempts})`);
        this.scheduleReconnect(id);
      }
    };
  }

  private scheduleReconnect(id: ClientId) {
    const state = this.reconnectStates[id];

    if (state.reconnectAttempts >= state.maxReconnectAttempts) {
      console.error(`💥 ${id}: max reconnect attempts reached`);
      return;
    }

    state.reconnectAttempts++;
    const jitter = 0.5 * state.reconnectDelay * Math.random();
    const delay = Math.min(state.reconnectDelay + jitter, state.maxReconnectDelay);

    console.log(`⏳ ${id}: reconnect #${state.reconnectAttempts} in ${Math.round(delay/1000)}s (URL: ${this.urls[id]})`);

    setTimeout(() => {
      state.reconnectDelay = Math.min(state.reconnectDelay * 2, state.maxReconnectDelay);
      this.connect(id, this.urls[id], this.callbacks[id]); // ← ВОТ ТУТ URL!
    }, delay);
  }

  disconnect(id: ClientId) {
    const socket = this.sockets[id];
    if (socket) {
      socket.close(1000, 'Component unmount');
    }
    delete this.sockets[id];
    delete this.callbacks[id];
    delete this.reconnectStates[id];
    delete this.urls[id]; // ← ОЧИСТИТЬ URL
  }

  isConnected(id: ClientId): boolean {
    return this.sockets[id]?.readyState === WebSocket.OPEN;
  }
}

export const socketService = new RawSocketService();
