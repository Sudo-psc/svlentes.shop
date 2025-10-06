Com certeza\! Abaixo está uma versão estendida e aprimorada do guia de integração, com foco na implementação em um website construído com **React**.

Este guia aborda as melhores práticas, gerenciamento de estado e exemplos de código práticos para a Clínica Saraiva Vision.

-----

## Guia Avançado de Integração da API Ninsaúde com React para a Clínica Saraiva Vision

Este guia detalha como implementar as funcionalidades da API Ninsaúde em uma aplicação React, cobrindo desde a autenticação segura até a criação de componentes interativos para agendamento.

### Estrutura do Projeto e Pré-requisitos

Recomenda-se o uso de uma biblioteca para realizar as chamadas HTTP, como o **Axios**, que facilita o envio de requisições e a configuração de instâncias.

**Instalação do Axios:**

```bash
npm install axios
# ou
yarn add axios
```

### 1\. Autenticação Segura no Lado do Cliente (Frontend)

A autenticação é o primeiro e mais crítico passo. Como se trata de uma aplicação React (Client-Side), a gestão dos tokens deve ser feita com cuidado para não expor dados sensíveis.

**Backend-for-Frontend (BFF) - A Abordagem Recomendada:**

Para máxima segurança, o processo de autenticação inicial (troca de `username` e `password` pelo `refresh_token` e `access_token`) **não deve ocorrer diretamente no React**. O ideal é criar um endpoint simples no seu próprio backend (um BFF) que fará essa chamada inicial à API da Ninsaúde.

  * **Fluxo:**
    1.  Seu frontend (React) envia as credenciais para o seu backend (BFF).
    2.  Seu backend (BFF) faz a chamada `POST` para `https://api.ninsaude.com/v1/oauth2/token`.
    3.  Seu backend (BFF) armazena o `refresh_token` de forma segura (em um cookie `HttpOnly`, por exemplo) e envia o `access_token` para o React.

**Gerenciando Tokens no React:**

O `access_token` pode ser armazenado na memória da aplicação, utilizando o **Context API** ou uma biblioteca de gerenciamento de estado (como Redux ou Zustand) para ser acessível globalmente.

#### **Criando um Cliente de API com Axios**

Crie uma instância do Axios para centralizar as configurações das suas chamadas.

`src/api/ninsaudeApi.js`

```javascript
import axios from 'axios';

const ninsaudeApi = axios.create({
  baseURL: 'https://api.ninsaude.com/v1'
});

// Interceptor para adicionar o token de acesso em todas as requisições
ninsaudeApi.interceptors.request.use((config) => {
  // Recupere o token do seu estado global ou local storage
  const accessToken = localStorage.getItem('accessToken'); // Exemplo: usando localStorage
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default ninsaudeApi;
```

### 2\. Cadastro de Pacientes (Componente React)

Crie um formulário controlado em React para capturar os dados do paciente.

`src/components/CadastroPacienteForm.js`

```jsx
import React, { useState } from 'react';
import ninsaudeApi from '../api/ninsaudeApi';

const CadastroPacienteForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    dataNascimento: '',
    foneCelular: '',
    // Adicione os outros campos necessários aqui
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await ninsaudeApi.post('/cadastro_paciente', {
        ...formData,
        ativo: 1, // Exemplo de valor padrão
        // Adicione outros valores fixos ou dinâmicos
      });
      setMessage('Paciente cadastrado com sucesso! ID: ' + response.data.id);
      // Limpar o formulário ou redirecionar o usuário
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error.response?.data || error.message);
      setMessage('Erro ao cadastrar. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Crie os inputs para cada campo, por exemplo: */}
      <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome Completo" required />
      <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" required />
      <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required />
      <input type="tel" name="foneCelular" value={formData.foneCelular} onChange={handleChange} placeholder="Celular" required />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar Paciente'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default CadastroPacienteForm;
```

### 3\. Agendamento de Consultas (Fluxo Completo)

O processo de agendamento envolve múltiplos passos: selecionar profissional, data e, finalmente, o horário disponível.

#### **Passo 1: Listar Profissionais e Datas**

`src/components/BuscaDisponibilidade.js`

```jsx
import React, { useState, useEffect } from 'react';
import ninsaudeApi from '../api/ninsaudeApi';

const BuscaDisponibilidade = () => {
  const [profissionais, setProfissionais] = useState([]); // Você pode buscar isso de outro endpoint
  const [profissionalId, setProfissionalId] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulação: Carregar profissionais ao montar o componente
  useEffect(() => {
    // Exemplo: ninsaudeApi.get('/profissional/listar').then(res => setProfissionais(res.data));
    setProfissionais([{ id: 14, nome: 'Dr. Exemplo' }]); // Substituir por chamada real
  }, []);

  const handleSearch = async () => {
    if (!profissionalId || !dataInicial) {
      alert('Selecione o profissional e a data.');
      return;
    }
    setLoading(true);
    try {
      const response = await ninsaudeApi.get(
        `/atendimento_agenda/listar/horario/disponivel/profissional/${profissionalId}/dataInicial/${dataInicial}/dataFinal/${dataInicial}`
      );
      setHorarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Select para Profissionais */}
      <select value={profissionalId} onChange={(e) => setProfissionalId(e.target.value)}>
        <option value="">Selecione o Profissional</option>
        {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
      </select>

      {/* Input de Data */}
      <input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />

      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar Horários'}
      </button>

      {/* Listagem de Horários */}
      <div>
        {horarios.length > 0 ? (
          horarios.map(horario => (
            <button key={horario.horaInicial}>
              {horario.horaInicial}
            </button>
            // Aqui você adicionaria a lógica para agendar
          ))
        ) : (
          <p>Nenhum horário disponível para esta data.</p>
        )}
      </div>
    </div>
  );
};

export default BuscaDisponibilidade;
```

#### **Passo 2: Efetivar o Agendamento**

Após o usuário clicar em um horário, você pode abrir um modal de confirmação e então fazer a chamada para criar o agendamento.

```jsx
// Dentro do seu componente de agendamento...

const handleAgendar = async (horario) => {
  const agendamentoData = {
    accountUnidade: 14, // ID da unidade da Clínica Saraiva Vision
    profissional: profissionalId,
    data: dataInicial,
    horaInicial: horario.horaInicial,
    horaFinal: horario.horaFinal,
    paciente: 123, // ID do paciente logado/cadastrado
    status: 0, // 0 = Agendado
    servico: 45, // ID do serviço/procedimento
    especialidade: 67 // ID da especialidade
  };

  try {
    const response = await ninsaudeApi.post('/atendimento_agenda', agendamentoData);
    alert('Agendamento realizado com sucesso!');
    // Atualizar a UI ou redirecionar
  } catch (error) {
    console.error("Erro ao agendar:", error.response?.data);
    alert('Não foi possível realizar o agendamento.');
  }
};
```

### 4\. Automações via WhatsApp e SMS (Ninsaúde ADS)

A configuração das campanhas, modelos e gatilhos da API é uma tarefa de **backend**. O frontend não deve ter a responsabilidade de gerenciar essas configurações.

**Como o React interage com isso?**

O papel do seu website React é **iniciar os eventos** que servem de gatilho para as automações.

  * **Novo Agendamento:** Quando o componente React realiza um agendamento com sucesso (item 3), o gatilho (`api_gatilho`) configurado no Ninsaúde para o evento `atendimento_agenda` (tipo: Inclusão) será disparado.
  * **Confirmação de Consulta:** Você pode criar um botão "Confirmar Agendamento" no seu site. Ao ser clicado, ele faria uma chamada `PUT` para o endpoint `/atendimento_agenda/{id}` alterando o `status` para `2` (Confirmado). Isso, por sua vez, pode disparar outro gatilho.

**Exemplo de chamada para confirmar agendamento:**

```javascript
const confirmarConsulta = async (agendamentoId) => {
  try {
    await ninsaudeApi.put(`/atendimento_agenda/${agendamentoId}`, {
      status: 2 // Confirmado
    });
    alert('Consulta confirmada!');
  } catch (error) {
    console.error("Erro ao confirmar:", error);
  }
};
```

### Melhores Práticas e Dicas Adicionais

  * **Variáveis de Ambiente:** Armazene a URL base da API (`https://api.ninsaude.com/v1`) em um arquivo `.env` para facilitar a mudança entre ambientes de desenvolvimento e produção.
  * **Gerenciamento de Estado:** Para aplicações mais complexas, use o Context API do React ou bibliotecas como Redux/Zustand para gerenciar o estado de autenticação, dados do usuário e agendamentos.
  * **Feedback ao Usuário:** Sempre forneça feedback visual para o usuário durante as chamadas de API (ex: spinners de carregamento, mensagens de sucesso ou erro).
  * **Tratamento de Erros:** Implemente um tratamento de erros robusto. O interceptor do Axios pode ser usado para tratar erros globais (como tokens expirados, que exigiriam uma chamada de refresh).
  * **Validação:** Valide os dados do formulário no lado do cliente (React) antes de enviar para a API para evitar requisições desnecessárias e melhorar a experiência do usuário.

Este guia aprimorado deve fornecer uma base sólida para a equipe de desenvolvimento da Clínica Saraiva Vision integrar as funcionalidades da Ninsaúde de forma eficiente e segura em seu website React.