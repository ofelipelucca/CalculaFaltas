class WebSocketClient {
    public socket: WebSocket | null = null;
    public uri: string;
    private pingIntervalId: any = null;
    private PING_INTERVAL: number = 100000; 

    constructor(uri: string) {
        this.uri = uri;
        this.connect();
    }

    private connect() {
        this.socket = new WebSocket(this.uri);
        this.setupListeners();
    }

    private onMessageCallback: (message: any) => void = () => {};  

    public setOnMessageCallback(callback: (message: any) => void) {
        this.onMessageCallback = callback;
    }

    private setupListeners() {
        if (!this.socket) return;

        this.socket.onopen = () => {
            this.startHeartbeat(); 
        };

        this.socket.onmessage = (event) => {
            this.handleMessage(event.data);
        };

        this.socket.onclose = () => {
            this.stopHeartbeat();  
        };

        this.socket.onerror = (error) => {
            console.error('Erro no WebSocket:', error);
        };
    }

    public sendCalcular(carga_horaria: number, dias_falta: number) {
        const payload = {
            calcular: true,
            carga_horaria,
            dias_falta
        };
        this.send(payload);
    }

    private startHeartbeat() {
        this.pingIntervalId = setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                const pingMessage = { ping: true };
                this.send(pingMessage);
            }
        }, this.PING_INTERVAL);
    }

    private stopHeartbeat() {
        if (this.pingIntervalId) {
            clearInterval(this.pingIntervalId);
            this.pingIntervalId = null;
        }
    }

    private send(data: object) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket não está aberto. Mensagem não enviada:', data);
        }
    }

    private handleMessage(data: string) {
        try {
            const message = JSON.parse(data);
            if (this.onMessageCallback) {
                this.onMessageCallback(message); 
            }
        } catch (e) {
            console.error('Falha ao processar a mensagem:', e);
        }
    }
}

export default WebSocketClient;
