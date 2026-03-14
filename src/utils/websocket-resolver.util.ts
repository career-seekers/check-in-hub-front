type ClientId = string;

class RawSocketService {
  private sockets: Record<ClientId, WebSocket> = {};

  connect(id: ClientId, url: string, onMessage: (msg: string) => void) {
    if (this.sockets[id]) return;

    const ws = new WebSocket(url);
    this.sockets[id] = ws;

    ws.onopen = () => console.log("opened", id);
    ws.onmessage = (event) => onMessage(event.data);
    ws.onerror = (e) => console.error("ws error", e);
    ws.onclose = () => { delete this.sockets[id]; };
  }

  disconnect(id: ClientId) {
    this.sockets[id]?.close();
    delete this.sockets[id];
  }
}

export const socketService = new RawSocketService();
