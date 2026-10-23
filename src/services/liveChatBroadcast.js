// Canal de Transmissão Simultânea em Tempo Real (0ms Delay)
const NOME_CANAL = 'boutique_layani_live_chat_channel';

let canal = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    canal = new BroadcastChannel(NOME_CANAL);
  }
} catch (e) {
  console.warn('[BroadcastChannel] Não suportado ou restrito:', e);
}

export function emitirEventoChat(evento) {
  if (canal) {
    try {
      canal.postMessage({
        ...evento,
        timestamp: Date.now(),
      });
    } catch (e) {
      console.warn('[BroadcastChannel] Falha ao emitir:', e);
    }
  }

  // Fallback via CustomEvent na mesma janela
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('boutique_live_chat_event', { detail: evento })
    );
  }
}

export function escutarEventosChat(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (e) => {
    if (e.data) {
      callback(e.data);
    }
  };

  const handleCustomEvent = (e) => {
    if (e.detail) {
      callback(e.detail);
    }
  };

  if (canal) {
    canal.addEventListener('message', handleMessage);
  }
  window.addEventListener('boutique_live_chat_event', handleCustomEvent);

  return () => {
    if (canal) {
      canal.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('boutique_live_chat_event', handleCustomEvent);
  };
}
