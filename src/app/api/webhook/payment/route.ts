'use server';
import {NextResponse} from 'next/server';

/**
 * Endpoint (URL) para receber webhooks da Kirvano.
 * É aqui que a Kirvano vai enviar a notificação de pagamento aprovado.
 * 
 * URL para configurar no painel da Kirvano: https://<seu-site>.com/api/webhook/payment
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // --- ETAPA DE SEGURANÇA CRUCIAL ---
    const kirvanoToken = process.env.KIRVANO_WEBHOOK_TOKEN;
    const receivedToken = request.headers.get('x-kirvano-token');

    if (!kirvanoToken) {
        console.error('ERRO: O token do webhook da Kirvano (KIRVANO_WEBHOOK_TOKEN) não está configurado nas variáveis de ambiente.');
        return NextResponse.json({error: 'Configuração interna do servidor incorreta.'}, {status: 500});
    }

    if (receivedToken !== kirvanoToken) {
      console.warn('Token de webhook inválido recebido. A requisição pode ser fraudulenta.');
      return NextResponse.json({error: 'Token inválido'}, {status: 401});
    }
    
    console.log('Webhook da Kirvano recebido e validado:', body);

    // --- PROCESSAR O EVENTO DE PAGAMENTO ---
    // Verifique na documentação da Kirvano qual é o nome do evento para "compra aprovada".
    // Geralmente é algo como `purchase.approved` ou `charge.paid`.
    const eventType = body.event_type; // Este é um exemplo, o nome pode ser outro.

    if (eventType === 'purchase.approved') {
      const purchaseData = body.data;
      console.log(`Compra aprovada! Dados:`, purchaseData);

      // --- LÓGICA DO SEU APLICATIVO ---
      // Esta é a área onde você adicionaria sua lógica de negócios. Por exemplo:
      // a. Encontre o pedido/usuário no seu banco de dados (Firestore) usando um ID.
      // b. Marque o pedido como "PAGO".
      // c. Chame a função da IA para gerar os números (`generateMegaNumbers`).
      // d. Salve os números gerados no banco de dados junto com o pedido.
      // e. Envie um e-mail/notificação para o usuário avisando que os números estão prontos.

      // Por enquanto, apenas registramos o sucesso.
      console.log('A lógica de aplicativo para processar a compra aprovada iria aqui.');

    } else {
      console.log(`Evento da Kirvano não processado recebido: ${eventType}`);
    }

    // --- RESPONDER AO GATEWAY ---
    // É essencial retornar status 200 para a Kirvano saber que você recebeu a notificação.
    return NextResponse.json({received: true}, {status: 200});
  } catch (error: any) {
    console.error('Erro fatal no processamento do webhook da Kirvano:', error);
    return NextResponse.json({error: 'Erro interno do servidor ao processar o webhook'}, {status: 500});
  }
}
