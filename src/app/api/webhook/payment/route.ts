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
    // 1. Obtenha o "Token" que você configurou no painel da Kirvano.
    const kirvanoToken = process.env.KIRVANO_WEBHOOK_TOKEN;
    
    // 2. A Kirvano envia o token em um cabeçalho. O nome do cabeçalho pode variar.
    //    Estou usando 'x-kirvano-token' como um exemplo provável. Verifique na documentação.
    const receivedToken = request.headers.get('x-kirvano-token');

    if (!kirvanoToken) {
        console.error('ERRO: O token do webhook da Kirvano (KIRVANO_WEBHOOK_TOKEN) não está configurado nas variáveis de ambiente.');
        return NextResponse.json({error: 'Configuração interna do servidor incorreta.'}, {status: 500});
    }

    // 3. Compare o token recebido com o que você salvou.
    //    Esta é a verificação para garantir que a requisição veio mesmo da Kirvano.
    if (receivedToken !== kirvanoToken) {
      console.warn('Token de webhook inválido. A requisição pode ser fraudulenta.');
      return NextResponse.json({error: 'Token inválido'}, {status: 401});
    }
    
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
