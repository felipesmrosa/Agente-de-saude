import { useState } from "react";

export function App() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState("");

  function emailEhGmail(email) {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  }

  async function enviarSintomas() {
    if (!emailEhGmail(email)) {
      setResposta("❌ Apenas endereços @gmail.com são aceitos.");
      return;
    }

    setCarregando("Enviando mensagem...");
    setResposta("");

    const payload = {
      nome,
      email,
      data,
      sintomas,
      sessionKey: 1,
    };

    try {
      const response = await fetch(
        "https://fmrosa.app.n8n.cloud/webhook/principal",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const texto = await response.text();
      setResposta(texto);
    } catch (error) {
      setResposta("❌ Erro ao enviar sintomas.");
      console.error(error);
    } finally {
      setCarregando("");
    }
  }

  async function finalizarAtendimento() {
    setCarregando("Finalizando atendimento...");
    setResposta("");

    try {
      const response = await fetch(
        "https://fmrosa.app.n8n.cloud/webhook/finalizar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionKey: 1, nome, email, data }),
        }
      );
      const texto = await response.text();
      console.log("Finalização:", texto);
      setResposta("✅ Atendimento finalizado.");
    } catch (error) {
      setResposta("❌ Erro ao finalizar atendimento.");
      console.error(error);
    } finally {
      setCarregando("");
    }
  }

  function formatarResposta(texto) {
    const linhas = texto.split(/\n+/); // Quebra por linhas
    const elementos = [];

    linhas.forEach((linha, index) => {
      const trimmed = linha.trim();
      if (!trimmed) return;

      // Detectar item de lista com hífen
      if (/^-\s/.test(trimmed)) {
        const match = trimmed.match(/^-\s\*\*(.+?)\*\*:? (.+)$/);
        if (match) {
          elementos.push(
            <li key={index}>
              <strong>{match[1]}</strong>: {match[2]}
            </li>
          );
        } else {
          elementos.push(<li key={index}>{trimmed.slice(2)}</li>);
        }
      } else {
        // Parágrafo com possível negrito
        const partesComNegrito = [];
        let restante = trimmed;
        let boldMatch;
        const boldRegex = /\*\*(.+?)\*\*/;

        while ((boldMatch = boldRegex.exec(restante))) {
          const [cheio, negrito] = boldMatch;
          const [antes] = restante.split(cheio);
          if (antes) partesComNegrito.push(antes);
          partesComNegrito.push(
            <strong key={`${index}-${negrito}`}>{negrito}</strong>
          );
          restante = restante.slice(restante.indexOf(cheio) + cheio.length);
        }

        if (restante) partesComNegrito.push(restante);

        elementos.push(<p key={index}>{partesComNegrito}</p>);
      }
    });

    // Agrupar <li> em <ul> automaticamente se houver itens
    const temLista = elementos.some((el) => el.type === "li");

    if (temLista) {
      const lista = elementos.filter((el) => el.type === "li");
      const parags = elementos.filter((el) => el.type !== "li");
      return [...parags, <ul key="lista">{lista}</ul>];
    }

    return elementos;
  }

  return (
    <div className="formulario">
      <h2>Agente de Saúde</h2>
      <p id="menor">
        Utilizando: <strong>ReactJS + N8N</strong>
      </p>
      <p id="menor">
        <strong>05/05/2025 versão de teste do n8n</strong>
      </p>
      <p id="menor">
        Desenvolvidor por: <strong>Felipe Miranda da Rosa</strong>
      </p>
      <div className="form">
        <span className="span">
          <label>Nome *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </span>
        <span className="span">
          <label>
            Gmail <p>(real) </p> *
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </span>
        <span className="span">
          <label>Data da Conversa *</label>
          <input
            type="datetime-local"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </span>
        <span className="span">
          <label>Relate seus Sintomas *</label>
          <textarea
            value={sintomas}
            onChange={(e) => setSintomas(e.target.value)}
          />
        </span>
        <span className="spanbutton">
          <button onClick={enviarSintomas}>Enviar Sintomas</button>
          <button id="finalizar" onClick={finalizarAtendimento}>
            Finalizar Atendimento
          </button>
        </span>
      </div>

      {carregando && (
        <p>
          <em>{carregando}</em>
        </p>
      )}
      {resposta &&
        (resposta === "✅ Atendimento finalizado." ? (
          <p id="finalizado">✅ Atendimento finalizado.</p>
        ) : resposta === "❌ Apenas endereços @gmail.com são aceitos." ? (
          <p id="finalizado">❌ Apenas endereços @gmail.com são aceitos.</p>
        ) : (
          <div id="resposta">
            <h2>Recomendações</h2>
            <div id="resposta-formatada">{formatarResposta(resposta)}</div>
          </div>
        ))}
    </div>
  );
}
