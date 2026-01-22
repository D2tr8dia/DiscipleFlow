
import { GoogleGenAI, Type } from "@google/genai";
import { Discipler, Disciple } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPairingSuggestion = async (disciple: Disciple, disciplers: Discipler[]) => {
  const prompt = `Você é um gestor de discipulado eclesiástico. Sugira o melhor pareamento.
    
    CRITÉRIOS DE PRIORIDADE:
    1. SEXO (OBRIGATÓRIO): Homens discipulam homens, mulheres discipulam mulheres.
    2. TEMAS DELICADOS: Se o membro tem "Temas Delicados" (${disciple.sensitiveTopics?.join(', ') || 'Nenhum'}), PRIORIZE um discipulador que seja "Especializado" (Líder/Pastor).
    3. IDADE: Busque proximidade de idade (geracional). Membro tem ${disciple.age} anos.
    4. INTERESSES: Busque afinidade de interesses. Membro gosta de: ${disciple.interests.join(', ')}.

    DADOS DO MEMBRO:
    Nome: ${disciple.name}, Gênero: ${disciple.gender}, Idade: ${disciple.age}, Interesses: ${disciple.interests.join(', ')}

    LISTA DE DISCIPULADORES (FILTRADOS POR SEXO E VAGA):
    ${disciplers.map(d => `- ID ${d.id}: ${d.name}, Idade: ${d.age}, Especializado: ${d.isSpecialized ? 'Sim' : 'Não'}, Interesses: ${d.interests.join(', ')}`).join('\n')}

    Retorne apenas um JSON: { "disciplerId": string, "reason": string } onde reason explique por que a idade e interesses (ou especialização) foram os fatores decisivos.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disciplerId: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro na IA:", error);
    return null;
  }
};

export const getDiscipleshipCoachAdvice = async (disciple: Disciple, notes: string) => {
  const prompt = `Como um mentor de discipulado experiente, analise o progresso de ${disciple.name}:
    Progresso: ${disciple.progress}%
    Idade: ${disciple.age} anos
    Últimas notas: "${notes}"
    
    Forneça 3 conselhos curtos para o discipulador, adequados à faixa etária do discípulo.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Mantenha o bom trabalho e continue orando pelo seu discípulo.";
  }
};

export const generateJourneySummary = async (disciple: Disciple) => {
  const encountersSummary = disciple.encounters.map(e => `- ${e.date}: ${e.summary}`).join('\n');
  const reportsSummary = disciple.reports.map(r => `- ${r.date} (${r.type}): ${r.content}`).join('\n');

  const prompt = `Você é um mentor de discipulado cristão. Escreva um "Relatório Geral da Jornada" para o discípulo ${disciple.name}.
    Este relatório deve ser uma carta pastoral de conclusão, simples mas completa.
    
    BASE DE DADOS DOS ENCONTROS:
    ${encountersSummary || 'Nenhum encontro registrado.'}
    
    BASE DE DADOS DOS RELATOS DO DISCÍPULO:
    ${reportsSummary || 'Nenhum relato registrado.'}
    
    INSTRUÇÕES:
    1. Comece celebrando a conclusão das 12 lições.
    2. Resuma os principais marcos de crescimento baseando-se nos encontros.
    3. Mencione como o discípulo lidou com as dificuldades e celebrou as vitórias reportadas.
    4. Termine com uma palavra de encorajamento para os próximos passos na igreja.
    
    Seja caloroso, bíblico e direto. Máximo de 250 palavras.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Erro na geração do resumo:", error);
    return "Erro ao gerar resumo automático. Por favor, escreva manualmente.";
  }
};
