'use server';
import {NextResponse} from 'next/server';
import crypto from 'crypto';

/**
 * Endpoint (URL) para receber webhooks da Kirvano.
 * É aqui que a Kirvano vai enviar a notificação de pagamento aprovado.
 * 
 * URL para configurar no painel da Kirvano: https://<seu-site>.com/api/webhook/payment
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    // Header que a Kirvano envia. Verifique o nome correto na documentação deles.
    const signature = request.headers.get('x-kirvano-signature'); 

    // --- ETAPA DE SEGURANÇA CRUCIAL ---
    // 1. Obtenha o "Segredo do Webhook" no seu painel da Kirvano.
    // 2. Adicione-o como uma variável de ambiente (ex: KIRVANO_WEBHOOK_SECRET).
    const kirvanoWebhookSecret = process.env.KIRVANO_WEBHOOK_SECRET;

    if (!kirvanoWebhookSecret) {
        console.error('ERRO: O segredo do webhook da Kirvano (KIRVANO_WEBHOOK_SECRET) não está configurado nas variáveis de ambiente.');
        // Em produção, é melhor retornar um erro genérico para não expor detalhes.
        return NextResponse.json({error: 'Configuração interna do servidor incorreta.'}, {status: 500});
    }
    
    // 3. Calcule a assinatura esperada.
    // A Kirvano usa HMAC-SHA256. Isso cria um código com base no corpo da requisição e na sua chave secreta.
    const expectedSignature = crypto
        .createHmac('sha256', kirvanoWebhookSecret)
        .update(rawBody)
        .digest('hex');

    // 4. Compare a assinatura recebida com a que você calculou.
    // DESCOMENTE A LINHA ABAIXO QUANDO TIVER SUA CHAVE SECRETA.
    // if (signature !== expectedSignature) {
    //   console.warn('Assinatura de webhook inválida. A requisição pode ser fraudulenta.');
    //   return NextResponse.json({error: 'Assinatura inválida'}, {status: 401});
    // }
    
    console.log('Webhook da Kirvano recebido e validado com sucesso:', body);

    // --- PROCESSAR O EVENTO DE PAGAMENTO ---
    // Verifique na documentação da Kirvano qual é o nome do evento para "compra aprovada".
    // Geralmente é algo como `purchase.approved` ou `charge.paid`.
    const eventType = body.event_type; // Este é um exemplo, o nome pode ser outro.

    if (eventType === 'purchase.approved') { // EXEMPLO: Verifique o nome correto do evento
      const purchaseData = body.data;
      console.log(`Compra aprovada! Dados:`, purchaseData);

      // --- LÓGICA DO SEU APLICATIVO ---
      // a. Encontre o pedido/usuário no seu banco de dados (Firestore) usando um ID.
      // b. Marque o pedido como "PAGO".
      // c. Chame a função da IA para gerar os números (`generateMegaNumbers`).
      // d. Salve os números gerados no banco de dados junto com o pedido.
      // e. Envie um e-mail/notificação para o usuário avisando que os números estão prontos.

    } else {
      console.log(`Evento da Kirvano não relevante recebido: ${eventType}`);
    }

    // --- RESPONDER AO GATEWAY ---
    // É essencial retornar status 200 para a Kirvano saber que você recebeu a notificação.
    // Se não fizer isso, ela continuará tentando enviar.
    return NextResponse.json({received: true}, {status: 200});
  } catch (error: any) {
    console.error('Erro fatal no processamento do webhook da Kirvano:', error);
    return NextResponse.json({error: 'Erro interno do servidor ao processar o webhook'}, {status: 500});
  }
}
