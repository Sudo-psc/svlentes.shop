# Guia de Integração Asaas: Assinaturas e Pagamentos no seu Website (API v3)

> **Objetivo**: implementar cobrança recorrente (assinaturas) e pagamentos avulsos (Pix, Boleto e Cartão) no seu site usando a API do Asaas, com Webhooks para atualização de status.

---

## 1) Visão geral do fluxo

1. **Autentique-se** com sua **API Key** via header `access_token`.
2. **Crie o cliente** (`POST /v3/customers`).
3. **Crie a assinatura** (`POST /v3/subscriptions`) – define valor, ciclo e meio de pagamento. A primeira cobrança é criada automaticamente.
4. **Ou crie um pagamento avulso** (`POST /v3/payments`).
5. **Exiba a cobrança** (link de fatura, boleto, ou QR Code Pix) ao cliente.
6. **Receba os Webhooks** e atualize seu banco (ex.: `PAYMENT_CREATED`, `PAYMENT_CONFIRMED/RECEIVED`).

---

## 2) Pré‑requisitos e ambientes

* **Conta Asaas** em *Sandbox* para testes e Produção para uso real.
* **API Key** gerada na área de Integração da sua conta.
* **URLs base** da API v3:

  * Produção: `https://api.asaas.com/v3`
  * Sandbox: `https://api-sandbox.asaas.com/v3`
* **Atenção**: chaves e dados não se misturam entre ambientes. Configure variáveis de ambiente para não vazar segredos.

---

## 3) Autenticação

Envie sua API Key no header **`access_token`** em **todas** as requisições. Em caso de ausência/erro, o Asaas retorna HTTP 401. Guarde a chave com segurança (ex.: variáveis de ambiente, Secret Manager).

**Exemplo de headers comuns**:

```
Content-Type: application/json
Accept: application/json
access_token: SUA_API_KEY
```

---

## 4) Criar um cliente

**Endpoint:** `POST /v3/customers`

**Payload mínimo** (exemplo):

```json
{
  "name": "Maria Souza",
  "email": "maria@example.com",
  "mobilePhone": "47999998888",
  "cpfCnpj": "12345678909"
}
```

**cURL**

```bash
curl -X POST "https://api-sandbox.asaas.com/v3/customers" \
  -H "Content-Type: application/json" \
  -H "access_token: $ASAAS_API_KEY" \
  -d '{
    "name": "Maria Souza",
    "email": "maria@example.com",
    "mobilePhone": "47999998888",
    "cpfCnpj": "12345678909"
  }'
```

Guarde o `id` retornado (ex.: `cus_123...`), pois será usado na assinatura/pagamento.

---

## 5) Assinaturas (cobrança recorrente)

### 5.1 Assinatura com Boleto/Pix

**Endpoint:** `POST /v3/subscriptions`

**Payload básico**:

```json
{
  "customer": "cus_ABC123",
  "billingType": "PIX", // ou "BOLETO"
  "nextDueDate": "2025-10-15",
  "value": 49.90,
  "cycle": "MONTHLY",
  "description": "Plano PRO"
}
```

**Observações**

* `cycle`: `WEEKLY`, `BIWEEKLY`, `MONTHLY`, `QUARTERLY`, `SEMIANNUALLY`, `YEARLY`.
* Ao criar a assinatura, a **primeira cobrança** é gerada automaticamente e você receberá **Webhook `PAYMENT_CREATED`** contendo `subscription`.

### 5.2 Assinatura com Cartão de Crédito

**Endpoint:** `POST /v3/subscriptions` (com objetos `creditCard` e `creditCardHolderInfo`).

**Payload (exemplo)**:

```json
{
  "customer": "cus_ABC123",
  "billingType": "CREDIT_CARD",
  "nextDueDate": "2025-10-15",
  "value": 49.90,
  "cycle": "MONTHLY",
  "description": "Plano PRO",
  "creditCard": {
    "holderName": "Maria Souza",
    "number": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2027",
    "ccv": "123"
  },
  "creditCardHolderInfo": {
    "name": "Maria Souza",
    "email": "maria@example.com",
    "cpfCnpj": "12345678909",
    "postalCode": "88000000",
    "addressNumber": "100",
    "addressComplement": "Sala 401",
    "phone": "4833334444",
    "mobilePhone": "47999998888"
  },
  "remoteIp": "203.0.113.10"
}
```

> **Dica**: após a primeira transação, guarde o `creditCardToken` para reutilizar nas futuras cobranças/atualizações, evitando enviar os dados sensíveis do cartão novamente.

### 5.3 Consultar cobranças geradas pela assinatura

**Endpoint:** `GET /v3/subscriptions/{id}/payments`

### 5.4 Alterar cartão da assinatura sem cobrar de imediato

**Endpoint:** `PUT /v3/subscriptions/{id}/creditCard`

---

## 6) Pagamentos avulsos (cobrança única)

**Endpoint:** `POST /v3/payments`

**Exemplos de payload**

**Pix**

```json
{
  "customer": "cus_ABC123",
  "billingType": "PIX",
  "value": 120.00,
  "dueDate": "2025-10-05",
  "description": "Pedido #1234"
}
```

**Boleto**

```json
{
  "customer": "cus_ABC123",
  "billingType": "BOLETO",
  "value": 120.00,
  "dueDate": "2025-10-10",
  "description": "Pedido #1234"
}
```

**Cartão de crédito (enviando dados do cartão)**

```json
{
  "customer": "cus_ABC123",
  "billingType": "CREDIT_CARD",
  "value": 120.00,
  "dueDate": "2025-10-05",
  "creditCard": {
    "holderName": "Maria Souza",
    "number": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2027",
    "ccv": "123"
  },
  "creditCardHolderInfo": {
    "name": "Maria Souza",
    "email": "maria@example.com",
    "cpfCnpj": "12345678909",
    "postalCode": "88000000",
    "addressNumber": "100"
  },
  "remoteIp": "203.0.113.10"
}
```

**Cartão de crédito (usando token)**

```json
{
  "customer": "cus_ABC123",
  "billingType": "CREDIT_CARD",
  "value": 120.00,
  "dueDate": "2025-10-05",
  "creditCardToken": "76496073-536f-4835-80db-c45d00f33695",
  "remoteIp": "203.0.113.10"
}
```

---

## 7) Pix: obtendo QR Code para exibir no site

1. Crie o pagamento com `billingType = PIX`.
2. **Busque o QR Code**: `GET /v3/payments/{id}/pixQrCode` → retorna `encodedImage` (Base64) e/ou `payload` (texto copia-e-cola).
3. Renderize o Base64 como `<img src="data:image/png;base64,ENCODED" />` ou mostre o *payload*.

---

## 8) Redireciono pós‑pagamento (Return URL)

Ao criar a cobrança, envie o objeto `callback` para redirecionar seu cliente de volta ao seu site após o pagamento:

```json
{
  "customer": "cus_ABC123",
  "billingType": "PIX",
  "value": 200.00,
  "dueDate": "2025-10-10",
  "callback": {
    "successUrl": "https://seusite.com/retorno",
    "autoRedirect": true
  }
}
```

Depois de criar, você pode direcionar o cliente para a URL de fatura (`invoiceUrl`) retornada.

---

## 9) Webhooks: recebendo e validando eventos

### 9.1 Criação e segurança

* Cadastre sua URL de Webhook no painel do Asaas ou via API.
* Defina um **Authentication Token** para o Webhook; o Asaas enviará este valor no header **`asaas-access-token`** em cada POST. No seu endpoint, **valide** esse header.
* (Opcional) **Restrinja IPs** para aceitar apenas origens oficiais do Asaas.

### 9.2 Eventos importantes para assinaturas

> O Asaas **não** envia Webhooks “de assinatura”; o controle é via **eventos de cobrança**.

* `PAYMENT_CREATED` – nova cobrança criada (contem `subscription`).
* `PAYMENT_RECEIVED` / `PAYMENT_CONFIRMED` – pagamento confirmado.
* `PAYMENT_OVERDUE` – cobrança vencida.
* `PAYMENT_DELETED` – cobrança cancelada/excluída.

### 9.3 Exemplo de payload

```json
{
  "event": "PAYMENT_RECEIVED",
  "payment": {
    "id": "pay_123",
    "customer": "cus_ABC123",
    "subscription": "sub_456",
    "value": 49.90,
    "status": "RECEIVED",
    "billingType": "PIX"
  }
}
```

### 9.4 Exemplo de endpoint (Node/Express)

```js
import express from 'express';
const app = express();
app.use(express.json());

const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN; // defina igual ao token configurado no painel

app.post('/webhooks/asaas', (req, res) => {
  const token = req.header('asaas-access-token');
  if (!token || token !== ASAAS_WEBHOOK_TOKEN) {
    return res.status(401).send('unauthorized');
  }

  const { event, payment } = req.body;

  // Idempotência simples: ignore se já processado
  // ex.: cheque se payment.id já está marcado no seu banco.

  switch (event) {
    case 'PAYMENT_CREATED':
      // vincule payment.subscription ao seu contrato interno, marque como "PENDENTE"
      break;
    case 'PAYMENT_RECEIVED':
    case 'PAYMENT_CONFIRMED':
      // conceda acesso/ativa o plano
      break;
    case 'PAYMENT_OVERDUE':
      // notifique cliente, aplique regras de atraso
      break;
    default:
      // logar outros eventos
  }

  res.status(200).send('ok');
});

app.listen(3000, () => console.log('Webhook ouvindo na porta 3000'));
```

---

## 10) Exemplos rápidos por linguagem

### 10.1 Node.js (Axios) – criar assinatura Pix

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-sandbox.asaas.com/v3',
  headers: {
    'Content-Type': 'application/json',
    'access_token': process.env.ASAAS_API_KEY
  }
});

async function criarAssinaturaPix(customerId) {
  const { data } = await api.post('/subscriptions', {
    customer: customerId,
    billingType: 'PIX',
    nextDueDate: '2025-10-15',
    value: 49.9,
    cycle: 'MONTHLY',
    description: 'Plano PRO'
  });
  return data; // sub_...
}
```

### 10.2 PHP (cURL) – pagamento com cartão (token)

```php
$ch = curl_init('https://api-sandbox.asaas.com/v3/payments');
$payload = json_encode([
  'customer' => 'cus_ABC123',
  'billingType' => 'CREDIT_CARD',
  'value' => 120.00,
  'dueDate' => '2025-10-05',
  'creditCardToken' => '76496073-536f-4835-80db-c45d00f33695',
  'remoteIp' => '203.0.113.10'
]);

curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'access_token: '.getenv('ASAAS_API_KEY')
  ],
  CURLOPT_POSTFIELDS => $payload,
  CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($ch);
if ($response === false) { throw new Exception(curl_error($ch)); }
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
```

$1

### 10.4 Next.js (App Router + TypeScript)

> Estrutura pensada para **Next.js 13+** (App Router). Inclui rotas de API, Webhook, serviço de cliente Asaas e página para exibir **QR Code Pix** com *polling* de status.

#### 10.4.1 Variáveis de ambiente (`.env.local`)

```
ASAAS_API_BASE=https://api-sandbox.asaas.com/v3
ASAAS_API_KEY=coloque_sua_chave
ASAAS_WEBHOOK_TOKEN=token_webhook_definido_no_painel
NEXT_PUBLIC_APP_URL=http://localhost:3000
TZ=America/Sao_Paulo
```

#### 10.4.2 Cliente HTTP para Asaas (`/lib/asaas.ts`)

```ts
// lib/asaas.ts
export const ASAAS_BASE = process.env.ASAAS_API_BASE!;
const API_KEY = process.env.ASAAS_API_KEY!;

async function asaas<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${ASAAS_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'access_token': API_KEY,
      ...(init?.headers || {})
    },
    // Evita cache em chamadas sensíveis
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Asaas ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const Asaas = {
  createCustomer: (payload: any) => asaas('/customers', { method: 'POST', body: JSON.stringify(payload) }),
  createSubscription: (payload: any) => asaas('/subscriptions', { method: 'POST', body: JSON.stringify(payload) }),
  createPayment: (payload: any) => asaas('/payments', { method: 'POST', body: JSON.stringify(payload) }),
  getPayment: (id: string) => asaas(`/payments/${id}`, { method: 'GET' }),
  getPixQrCode: (id: string) => asaas(`/payments/${id}/pixQrCode`, { method: 'GET' }),
};
```

#### 10.4.3 Rotas de API (App Router)

**Criar cliente** – `app/api/asaas/customers/route.ts`

```ts
import { NextResponse } from 'next/server';
import { Asaas } from '@/lib/asaas';

export async function POST(req: Request) {
  const body = await req.json();
  // valide campos mínimos aqui
  const customer = await Asaas.createCustomer(body);
  return NextResponse.json(customer);
}
```

**Criar assinatura (Pix/Boleto/Cartão)** – `app/api/asaas/subscriptions/route.ts`

```ts
import { NextResponse } from 'next/server';
import { Asaas } from '@/lib/asaas';

export async function POST(req: Request) {
  const payload = await req.json();
  // Ex.: { customer, billingType: 'PIX'|'BOLETO'|'CREDIT_CARD', value, nextDueDate, cycle, ... }
  const sub = await Asaas.createSubscription(payload);
  return NextResponse.json(sub);
}
```

**Criar pagamento avulso (Pix)** – `app/api/asaas/payments/route.ts`

```ts
import { NextResponse } from 'next/server';
import { Asaas } from '@/lib/asaas';

export async function POST(req: Request) {
  const payload = await req.json();
  // Ex.: { customer, billingType: 'PIX', value, dueDate, description }
  const pay = await Asaas.createPayment(payload);
  return NextResponse.json(pay);
}
```

**Consultar status do pagamento** – `app/api/asaas/payments/[id]/route.ts`

```ts
import { NextResponse } from 'next/server';
import { Asaas } from '@/lib/asaas';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const pay = await Asaas.getPayment(params.id);
  return NextResponse.json(pay);
}
```

#### 10.4.4 Webhook do Asaas (seguro e idempotente)

`app/api/webhooks/asaas/route.ts`

```ts
import { NextResponse } from 'next/server';

const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN!;

export async function POST(req: Request) {
  // Validação do token enviado pelo Asaas no header
  const tokenHeader = req.headers.get('asaas-access-token');
  if (!tokenHeader || tokenHeader !== WEBHOOK_TOKEN) {
    return new NextResponse('unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { event, payment } = body as { event: string, payment: any };

  // TODO: implementar idempotência (ex.: checar payment.id em sua base)
  // e atualizar registros conforme evento
  switch (event) {
    case 'PAYMENT_CREATED':
      // marcar como pendente
      break;
    case 'PAYMENT_RECEIVED':
    case 'PAYMENT_CONFIRMED':
      // ativar assinatura/liberar acesso
      break;
    case 'PAYMENT_OVERDUE':
      // notificar cliente / regras de atraso
      break;
  }

  return NextResponse.json({ ok: true });
}
```

> **Dica**: se você usa **Pages Router** (`pages/api/...`), desative o `bodyParser` para lidar com payloads brutos quando necessário. No App Router, `request.json()` já cobre o JSON do Asaas.

#### 10.4.5 Página de checkout Pix com QR Code

`app/checkout/[paymentId]/page.tsx`

```tsx
import Image from 'next/image';

async function getQr(paymentId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/asaas/payments/${paymentId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao buscar pagamento');
  const pay = await res.json();

  // Busca QR Code somente para PIX
  const qrRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/asaas/pix/${paymentId}`);
  const qr = await qrRes.json();
  return { pay, qr };
}

export default async function Checkout({ params }: { params: { paymentId: string } }) {
  const { pay, qr } = await getQr(params.paymentId);

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Finalize com Pix</h1>
      <p>Pedido: {pay.description} • Valor: R$ {Number(pay.value).toFixed(2)}</p>

      {qr?.encodedImage && (
        <img
          alt="QR Code Pix"
          src={`data:image/png;base64,${qr.encodedImage}`}
          className="rounded-2xl shadow w-80 h-80 object-contain"
        />
      )}

      {qr?.payload && (
        <div className="bg-gray-100 rounded-2xl p-4 text-sm break-all">
          {qr.payload}
        </div>
      )}

      {/* Polling simples de status (client component seria melhor) */}
      <form action={`${process.env.NEXT_PUBLIC_APP_URL}/checkout/${params.paymentId}`}
            className="space-x-2">
        <button className="px-4 py-2 rounded-2xl shadow">Atualizar status</button>
      </form>
    </main>
  );
}
```

**Rota auxiliar para QR Code Pix** – `app/api/asaas/pix/[id]/route.ts`

```ts
import { NextResponse } from 'next/server';
import { Asaas } from '@/lib/asaas';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const qr = await Asaas.getPixQrCode(params.id);
  return NextResponse.json(qr);
}
```

> Em produção, prefira um **componente cliente** com `useEffect` para *polling* (ex.: a cada 4–6s consultar `/api/asaas/payments/[id]` até `status === 'RECEIVED'|'CONFIRMED'` e então redirecionar).

#### 10.4.6 Modelo de dados (Prisma opcional)

`prisma/schema.prisma`

```prisma
model Customer {
  id            String   @id @default(cuid())
  asaasId       String   @unique
  email         String
  name          String
  subscriptions Subscription[]
  payments      Payment[]
  createdAt     DateTime @default(now())
}

model Subscription {
  id        String   @id @default(cuid())
  asaasId   String   @unique
  customer  Customer @relation(fields: [customerId], references: [id])
  customerId String
  plan      String?
  status    String?
  createdAt DateTime @default(now())
}

model Payment {
  id          String   @id @default(cuid())
  asaasId     String   @unique
  customer    Customer @relation(fields: [customerId], references: [id])
  customerId  String
  subscriptionId String?
  value       Decimal  @db.Decimal(10,2)
  status      String
  billingType String
  dueDate     DateTime
  createdAt   DateTime @default(now())
}
```

#### 10.4.7 Fluxo sugerido no Next.js

1. **POST `/api/asaas/customers`** ao cadastrar usuário → persista `asaasId`.
2. **POST `/api/asaas/subscriptions`** para planos recorrentes **ou** **POST `/api/asaas/payments`** para compra avulsa.
3. Redirecione para página de checkout (Pix/Boleto) usando `invoiceUrl` **ou** exiba QR Code via rota Pix.
4. **Webhook** atualiza o status no seu banco e dispara e‑mails/ativação.
5. Front‑end faz *polling* da rota de status até confirmar pagamento e redireciona para página de sucesso.

#### 10.4.8 Boas práticas específicas para Next.js

* Use **rotas do App Router** para separar responsabilidades e `cache: 'no-store'` em chamadas sensíveis.
* Proteja segredos no servidor; **nunca** exponha `ASAAS_API_KEY` no cliente.
* Configure **observabilidade** (Middleware de logs + ferramentas como Sentry/Logtail).
* Trate **fuso horário** (defina `TZ=America/Sao_Paulo` ou converta datas com `date-fns-tz`).
* Implemente **idempotência** por `paymentId`/`eventId` do Webhook.

---

### 10.5 Next.js **Pages Router** (TypeScript)

> Para projetos que ainda usam `pages/` em vez do App Router. Mantemos o mesmo cliente `lib/asaas.ts` e criamos as rotas em `pages/api/*`.

#### 10.5.1 Variáveis de ambiente (`.env.local`)

```
ASAAS_API_BASE=https://api-sandbox.asaas.com/v3
ASAAS_API_KEY=coloque_sua_chave
ASAAS_WEBHOOK_TOKEN=token_webhook_definido_no_painel
NEXT_PUBLIC_APP_URL=http://localhost:3000
TZ=America/Sao_Paulo
```

#### 10.5.2 Cliente HTTP (compartilhado)

* Use o mesmo `lib/asaas.ts` apresentado na seção 10.4.2.

#### 10.5.3 Rotas de API (`pages/api`)

**Criar cliente** – `pages/api/asaas/customers.ts`

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Asaas } from '@/lib/asaas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const customer = await Asaas.createCustomer(req.body);
    res.status(200).json(customer);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
```

**Criar assinatura** – `pages/api/asaas/subscriptions.ts`

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Asaas } from '@/lib/asaas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const sub = await Asaas.createSubscription(req.body);
    res.status(200).json(sub);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
```

**Pagamento avulso (Pix)** – `pages/api/asaas/payments.ts`

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Asaas } from '@/lib/asaas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const pay = await Asaas.createPayment(req.body);
    res.status(200).json(pay);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
```

**Consultar status** – `pages/api/asaas/payments/[id].ts`

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Asaas } from '@/lib/asaas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const { id } = req.query as { id: string };
  try {
    const pay = await Asaas.getPayment(id);
    res.status(200).json(pay);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
```

**QR Code Pix** – `pages/api/asaas/pix/[id].ts`

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Asaas } from '@/lib/asaas';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const { id } = req.query as { id: string };
  try {
    const qr = await Asaas.getPixQrCode(id);
    res.status(200).json(qr);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
```

#### 10.5.4 Webhook Asaas – `pages/api/webhooks/asaas.ts`

```ts
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    // Para JSON padrão do Asaas, o parser nativo já serve.
    bodyParser: true,
  },
};

const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const tokenHeader = req.headers['asaas-access-token'];
  if (!tokenHeader || tokenHeader !== WEBHOOK_TOKEN) {
    return res.status(401).send('unauthorized');
  }

  const { event, payment } = req.body as { event: string; payment: any };

  // TODO: idempotência por payment.id
  switch (event) {
    case 'PAYMENT_CREATED':
      // marcar pendente
      break;
    case 'PAYMENT_CONFIRMED':
    case 'PAYMENT_RECEIVED':
      // liberar acesso/ativar plano
      break;
    case 'PAYMENT_OVERDUE':
      // tratar atraso
      break;
    default:
      // logar evento
      break;
  }

  res.status(200).json({ ok: true });
}
```

> Se precisar processar **payload bruto** (ex.: verificação de assinatura HMAC em outros PSPs), defina `bodyParser: false` e leia o `req` como *stream*. Para o Asaas, o JSON é suficiente.

#### 10.5.5 Página de checkout Pix com polling

`pages/checkout/[paymentId].tsx`

```tsx
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Checkout({ paymentId }: { paymentId: string }) {
  const [pay, setPay] = useState<any>(null);
  const [qr, setQr] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const p = await fetch(`/api/asaas/payments/${paymentId}`).then(r => r.json());
      setPay(p);
      const q = await fetch(`/api/asaas/pix/${paymentId}`).then(r => r.json());
      setQr(q);
    }
    load();

    const id = setInterval(async () => {
      const p = await fetch(`/api/asaas/payments/${paymentId}`).then(r => r.json());
      setPay(p);
      if (p.status === 'RECEIVED' || p.status === 'CONFIRMED') {
        clearInterval(id);
        window.location.href = '/sucesso';
      }
    }, 5000);
    return () => clearInterval(id);
  }, [paymentId]);

  return (
    <>
      <Head><title>Pagamento Pix</title></Head>
      <main style={{ maxWidth: 680, margin: '0 auto', padding: 24 }}>
        <h1>Finalize com Pix</h1>
        {pay && <p>Pedido: {pay.description} • Valor: R$ {Number(pay.value).toFixed(2)}</p>}
        {qr?.encodedImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="QR Code Pix" src={`data:image/png;base64,${qr.encodedImage}`} style={{ width: 320, height: 320 }} />
        )}
        {qr?.payload && (
          <pre style={{ whiteSpace: 'pre-wrap' }}>{qr.payload}</pre>
        )}
        <p>Status: {pay?.status || 'carregando...'}</p>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  return { props: { paymentId: ctx.params.paymentId as string } };
}
```

#### 10.5.6 Fluxo recomendado (Pages Router)

1. Criar cliente → `POST /api/asaas/customers`.
2. Criar assinatura/pagamento → `POST /api/asaas/subscriptions|payments`.
3. Redirecionar para `pages/checkout/[paymentId]` (Pix) **ou** enviar o usuário ao `invoiceUrl` retornado.
4. Webhook atualiza status no seu banco; front faz polling até `RECEIVED/CONFIRMED`.

#### 10.5.7 Dicas específicas

* Garanta que **segredos** (`ASAAS_API_KEY`) fiquem apenas no servidor (APIs). Nunca use em código do cliente.
* Configure **Sentry**/logs e monitore falhas de Webhook.
* Defina `TZ=America/Sao_Paulo` e padronize datas no backend.
* Aplique **idempotência** por `payment.id` nos processamentos.

---

## 11) Testes no Sandbox Testes no Sandbox

* Use a URL **`https://api-sandbox.asaas.com/v3`** e sua **API Key de Sandbox**.
* Para cartões, utilize **números de teste** disponibilizados pelo Asaas no guia de cartão.
* Simule confirmações e cenários (ex.: cobrança vencida) usando endpoints/ações de Sandbox quando disponíveis.

---

## 12) Boas práticas de produção

* **Idempotência**: garanta que o processamento de Webhooks seja **atômico e reexecutável**. Marque eventos já processados por `payment.id`.
* **Segurança**: valide `asaas-access-token` no Webhook; nunca logue dados sensíveis do cartão; ative tokenização para reduzir escopo de PCI.
* **Observabilidade**: registre eventos, respostas e erros (com sanitização). Monitore a **fila de Webhooks** (pausas/quebras de entrega) e implemente *retry/backoff*.
* **Timeouts e retry**: trate 429/5xx com retentativas exponenciais. Respeite limites de rate.
* **LGPD**: minimize e proteja dados pessoais (CPF, endereço, e-mail). Defina políticas de retenção.

---

## 13) Erros comuns e diagnósticos

* **401**: faltando header `access_token` ou chave inválida/ambiente trocado.
* **Assinatura criada, mas status não atualiza no seu sistema**: verifique sua **fila de Webhooks** (comunicação interrompida). Reprograme reentregas ou ajuste o endpoint.
* **Transação cartão negada**: confira `creditCardHolderInfo` (dados do portador devem combinar com o emissor), endereço/IP, ou use tokenização.

---

## 14) Recursos úteis (para consulta durante o desenvolvimento)

* Autenticação e ambientes; URLs base da API v3.
* Assinaturas: visão geral, criação, com cartão, listar pagamentos, atualizar cartão.
* Pagamentos com cartão e tokenização.
* Pix: QR Code.
* Webhooks: conceito, eventos de cobranças, autenticação do webhook (`asaas-access-token`), práticas de segurança e IPs.
* Redireciono pós‑pagamento (Return URL).

> **Próximos passos**: integrar emissão de **Notas Fiscais** nas assinaturas; habilitar **Split** (se marketplace); e configurar **retorno/UX** do pós‑pagamento no seu site.

---

### Checklist de go‑live

* [ ] Variáveis de ambiente e chaves separadas por ambiente.
* [ ] Webhook configurado com `authToken` e validado no código.
* [ ] Fluxo de assinatura criado e testado (Boleto/Pix/Cartão).
* [ ] Endpoint de QR Code Pix exibindo imagem e payload.
* [ ] Tratamento de reentrega/idempotência de Webhooks.
* [ ] Logs e alertas configurados.
* [ ] Política de privacidade/LGPD revisada.
