'use server';
import {NextResponse} from 'next/server';
import crypto from 'crypto';

/**
 * Endpoint para receber webhooks da Kirvano.
 *
 * IMPORTANTE: Este é um modelo e NÃO deve ser usado em produção sem implementar
 * a verificação de assinatura e adaptar a lógica para os dados da Kirvano.
 *
 * Próximos Passos para VOCÊ:
 * 1. No seu painel da Kirvano, configure a URL deste webhook: `https://<seu-site>/api/webhook/payment`.
 * 2. Obtenha o "Segredo do Webhook" (Webhook Secret) no painel da Kirvano.
 * 3. Adicione esse segredo como uma variável de ambiente no seu projeto (ex: KIRVANO_WEBHOOK_SECRET).
 * 4. Implemente a lógica de verificação de assinatura (passo de segurança crucial).
 * 5. Adapte a lógica para extrair os dados corretos do corpo da requisição (`body`).
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const signature = request.headers.get('x-kirvano-signature'); // Nome do header pode variar, verifique na doc da Kirvano

    // 1. VERIFICAR A ASSINATURA DO WEBHOOK (SEGURANÇA)
    // ----------------------------------------------------
    // Esta é a etapa mais importante. Sem ela, qualquer um pode ativar a geração de números.
    // Você precisa usar o seu "Segredo do Webhook" da Kirvano para validar a assinatura.
    const kirvanoWebhookSecret = process.env.KIRVANO_WEBHOOK_SECRET;

    if (!kirvanoWebhookSecret) {
        console.error('O segredo do webhook da Kirvano não está configurado.');
        return NextResponse.json({error: 'Configuração interna incorreta'}, {status: 500});
    }
    
    // A lógica de verificação geralmente envolve criar um hash HMAC-SHA256 do corpo
    // da requisição usando o seu segredo e comparar com a assinatura recebida.
    const expectedSignature = crypto
        .createHmac('sha256', kirvanoWebhookSecret)
        .update(rawBody)
        .digest('hex');

    // if (signature !== expectedSignature) {
    //   console.warn('Assinatura de webhook inválida recebida.');
    //   return NextResponse.json({error: 'Assinatura inválida'}, {status: 401});
    // }
    // NOTA: A lógica de verificação acima é um exemplo comum.
    // VERIFIQUE A DOCUMENTAÇÃO DA KIRVANO PARA A LÓGICA EXATA.

    console.log('Webhook da Kirvano recebido e (simuladamente) validado:', body);

    // 2. PROCESSAR O EVENTO DE PAGAMENTO
    // ----------------------------------
    // A estrutura do 'body' depende da Kirvano. Geralmente é algo como `body.event` ou `body.status`.
    // Exemplo: `purchase.approved` ou `charge.paid`.
    const eventType = body.event; // ou `body.type`, `body.status` etc.

    if (eventType === 'purchase.approved') { // Verifique o nome correto do evento na doc da Kirvano
      const purchaseData = body.data;
      console.log(`Compra ${purchaseData.id} aprovada!`);

      // TODO:
      // a. Encontre o pedido no seu banco de dados usando um ID (ex: `purchaseData.transaction_id`).
      //    Você precisa salvar esse ID quando o usuário inicia a compra.
      // b. Marque o pedido como "PAGO" no seu Firestore.
      // c. Chame a função `generateMegaNumbers` da IA.
      // d. Salve os números gerados no pedido no banco de dados.
      // e. (Opcional) Envie um e-mail para o usuário com os números.

    } else {
      console.log(`Evento Kirvano não tratado: ${eventType}`);
    }

    // 3. RESPONDER AO GATEWAY
    // --------------------------
    // É crucial responder com um status 200 para que a Kirvano saiba que você recebeu.
    return NextResponse.json({received: true}, {status: 200});
  } catch (error: any) {
    console.error('Erro no processamento do webhook da Kirvano:', error);
    return NextResponse.json({error: 'Erro interno do servidor'}, {status: 500});
  }
}
