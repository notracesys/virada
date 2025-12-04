'use server';
import {NextResponse} from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { generateMegaNumbers } from '@/ai/flows/generate-mega-numbers';

// --- INICIALIZAÇÃO DO FIREBASE ADMIN SDK ---
// O SDK Admin é usado no servidor (como em webhooks) para ter acesso privilegiado
// ao seu banco de dados, diferente do SDK do cliente que roda no navegador.

// Carrega as credenciais de serviço do Firebase a partir de uma variável de ambiente.
// Você precisa criar esta variável de ambiente (FIREBASE_SERVICE_ACCOUNT_KEY)
// e colar o conteúdo do seu arquivo JSON de credencial de serviço nela.
// O conteúdo do JSON deve ser uma string única, sem quebras de linha.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

// Inicializa o app do Firebase apenas se ainda não foi inicializado.
if (!getApps().length) {
  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    console.error('ERRO: Credenciais do Firebase (FIREBASE_SERVICE_ACCOUNT_KEY) não encontradas. O webhook não pode se conectar ao Firestore.');
  }
}

const db = getFirestore();

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
      if (!serviceAccount) {
         console.error('Processamento de compra aprovada falhou: Conexão com Firebase não está configurada.');
         // Responde 200 para a Kirvano não reenviar, mas registra o erro.
         return NextResponse.json({ received: true, error: 'Firebase not configured' }, { status: 200 });
      }
        
      const purchaseData = body.data;
      console.log(`Compra aprovada! Dados:`, purchaseData);

      // --- LÓGICA DO APLICATIVO ---
      
      // TODO: Adapte esta linha para pegar a quantidade de números do produto comprado na Kirvano.
      // Por exemplo: const numberOfNumbers = purchaseData.product.metadata.numbers_to_generate || 6;
      const numberOfNumbers = 6; 

      // TODO: Adapte esta linha para pegar um identificador único do cliente.
      // Por exemplo: const userIdentifier = purchaseData.customer.email;
      const userIdentifier = purchaseData?.customer?.email || 'unknown_user';

      try {
        // 1. Chame a função da IA para gerar os números
        console.log(`Gerando ${numberOfNumbers} números para ${userIdentifier}...`);
        const result = await generateMegaNumbers({ userId: userIdentifier, numberOfNumbers });
        
        if (result && result.numbers) {
            const generatedNumbers = result.numbers.sort((a, b) => a - b);
            console.log('Números gerados com sucesso:', generatedNumbers);
            
            // 2. Salve os números gerados no Firestore
            const generationRecord = {
                userIdentifier: userIdentifier,
                numbers: generatedNumbers,
                createdAt: new Date().toISOString(),
                paymentGateway: 'kirvano',
                purchaseData: purchaseData, // Salva o payload completo para referência
            };

            // Cria um novo documento na coleção 'generations'
            const docRef = await db.collection('generations').add(generationRecord);
            console.log(`Registro da geração salvo no Firestore com o ID: ${docRef.id}`);
            
            // TODO: Adicionar lógica de envio de e-mail/notificação para o usuário aqui.

        } else {
            console.error('A IA não retornou números. Payload do resultado:', result);
        }
      } catch (aiError) {
        console.error('Erro ao chamar a IA ou salvar no Firestore:', aiError);
        // Mesmo com erro interno, respondemos 200 para não receber o webhook novamente.
        // O erro já foi logado para análise.
      }
      

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
