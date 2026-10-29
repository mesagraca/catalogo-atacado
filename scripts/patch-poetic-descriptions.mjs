import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Dicionário com redações autorais, poéticas e acolhedoras no exato padrão do Kit Lavanda:
// "Composição [adjetivo] em [tons/tema], com lugar americano, guardanapo e porta-guardanapo coordenados para [propósito afetivo]."
const POETIC_DESCRIPTIONS = {
  // Kits temáticos e festivos
  "kit-mesa-posta-italia-com-lugar-americano-guardanapo-porta-guardanapo-167":
    "Composição acolhedora inspirada nas cantinas italianas com estampa xadrez verde, com lugar americano redondo, guardanapo e porta-guardanapo coordenados para celebrar os sabores e a união à mesa.",
  "kit-mesa-posta-costela-de-adao-com-lugar-americano-guardanapo-porta-guardanapo-255":
    "Composição contemporânea inspirada no frescor botânico da costela de adão, com lugar americano, guardanapo e porta-guardanapo coordenados para uma mesa vibrante e cheia de vida.",
  "kit-mesa-posta-floral-marrom-com-lugar-americano-guardanapo-porta-guardanapo-177":
    "Composição sofisticada com arabescos florais em tons nobres de marrom, com lugar americano, guardanapo e porta-guardanapo coordenados para receber com elegância e aconchego.",
  "kit-mesa-posta-floral-rosa-com-lugar-americano-guardanapo-porta-guardanapo-178":
    "Composição delicada com bordados florais em rosa suave, com lugar americano, guardanapo e porta-guardanapo coordenados para criar memórias doces ao redor da mesa.",
  "kit-mesa-posta-festa-junina-azul-com-lugar-americano-guardanapo-porta-guardanapo-83":
    "Composição alegre em xadrez junino azul, com lugar americano, guardanapo e porta-guardanapo coordenados para celebrar as festas típicas com tradição e muito afeto.",
  "kit-mesa-posta-festa-junina-laranja-com-lugar-americano-guardanapo-porta-guardanapo-85":
    "Composição calorosa em xadrez junino laranja, com lugar americano, guardanapo e porta-guardanapo coordenados para celebrar com alegria e aconchego em família.",
  "kit-mesa-posta-festa-junina-bordo-com-lugar-americano-guardanapo-porta-guardanapo-84":
    "Composição marcante em xadrez junino bordô, com lugar americano, guardanapo e porta-guardanapo coordenados para uma mesa temática elegante e convidativa.",
  "kit-mesa-posta-festa-junina-azul-marinho-com-lugar-americano-guardanapo-porta-guardanapo-86":
    "Composição clássica em xadrez junino azul marinho, com lugar americano, guardanapo e porta-guardanapo coordenados para celebrar momentos festivos com muito estilo.",
  "kit-mesa-posta-festa-junina-verde-com-lugar-americano-guardanapo-porta-guardanapo-88":
    "Composição festiva em xadrez junino verde, com lugar americano, guardanapo e porta-guardanapo coordenados para reunir quem a gente ama em um clima alegre e acolhedor.",
  "kit-mesa-posta-xadrez-vermelho-com-lugar-americano-guardanapo-porta-guardanapo-87":
    "Composição clássica e acolhedora em xadrez vermelho tradicional, com lugar americano, guardanapo e porta-guardanapo coordenados para encontros cheios de amor e sabor.",
  "kit-mesa-posta-xadrez-verde-com-lugar-americano-guardanapo-porta-guardanapo-135":
    "Composição leve e fresca em xadrez verde menta, com lugar americano, guardanapo e porta-guardanapo coordenados para transformar o dia a dia em uma celebração especial.",
  "kit-mesa-posta-xadrez-azul-com-lugar-americano-guardanapo-porta-guardanapo-136":
    "Composição serena em xadrez azul suave, com lugar americano, guardanapo e porta-guardanapo coordenados para criar uma atmosfera de paz e carinho à mesa.",
  "kit-mesa-posta-xadrez-laranja-com-lugar-americano-guardanapo-porta-guardanapo-137":
    "Composição vibrante e acolhedora em xadrez laranja, com lugar americano, guardanapo e porta-guardanapo coordenados para iluminar cada refeição em família.",
  "kit-mesa-posta-xadrez-azul-marinho-com-lugar-americano-guardanapo-porta-guardanapo-138":
    "Composição atemporal em xadrez azul marinho, com lugar americano, guardanapo e porta-guardanapo coordenados para uma mesa posta impecável e refinada.",

  // Lugares americanos avulsos
  "lugar-americano-limao-siciliano-azul-marinho-com-borda-amarela-179":
    "Lugar americano alegre com estampa de limão siciliano sobre azul marinho e borda amarela, trazendo frescor mediterrâneo e vivacidade para compor a mesa.",
  "lugar-americano-italia-redondo-verde-com-borda-xadrez-para-mesa-posta-168":
    "Lugar americano redondo com borda em xadrez verde, trazendo o charme rústico e acolhedor das cantinas italianas para o seu encontro à mesa.",
  "lugar-americano-floral-rosa-com-acabamento-bordado-181":
    "Lugar americano com delicado bordado floral em tom rosa suave e acabamento recortado, perfeito para criar mesas românticas e acolhedoras.",
  "lugar-americano-floral-marrom-com-acabamento-ondulado-183":
    "Lugar americano sofisticado com padronagem floral em tons terrosos e acabamento ondulado, conferindo presença marcante e elegância à composição.",
  "lugar-americano-feijoada-marrom-com-acabamento-ondulado-173":
    "Lugar americano prático e impermeável em tom marrom acolhedor com acabamento ondulado, ideal para celebrar momentos de confraternização e sabor.",
  "lugar-americano-hot-dog-xadrez-vermelho-175":
    "Lugar americano temático com detalhe xadrez e bolso exclusivo, trazendo descontração e afeto para lanches e noites divertidas em família.",
  "lugar-americano-churrasco-azul-com-bolso-decorativo-com-a-frase-dia-de-churrasco-174":
    "Lugar americano em tecido jeans com bolso e a frase 'Dia de Churrasco', aliando estilo rústico contemporâneo e praticidade para receber os amigos.",
  "lugar-americano-hamburguer-em-tecido-jeans-com-detalhe-em-courino-236":
    "Lugar americano moderno em jeans com aplique em courino, perfeito para noites de hambúrguer artesanal cheias de estilo e aconchego.",
  "lugar-americano-bridgerton-azul-floral-com-borda-ondulada-233":
    "Lugar americano com estampa floral clássica em azul e borda ondulada, evocando romantismo inglês e sofisticação atemporal para a mesa posta.",
  "lugar-americano-bridgerton-verde-floral-com-borda-ondulada-232":
    "Lugar americano com estampa floral campestre em verde e borda ondulada, trazendo a beleza dos jardins clássicos para encontros especiais.",
  "lugar-americano-flor-de-lottus-rosa-bordado-230":
    "Lugar americano premium em courino rosa com bordado de flor de lóttus, unindo praticidade na limpeza e extrema delicadeza visual.",
  "lugar-americano-videira-off-white-bordado-verde-245":
    "Lugar americano impermeável off white com bordado delicado de videira em verde, simbolizando paz, renovação e bênçãos ao redor da mesa.",
  "lugar-americano-costela-de-adao-com-frase-a-mesa-e-o-lugar-onde-o-amor-se-reune-145":
    "Lugar americano exclusivo com a frase 'A mesa é o lugar onde o amor se reúne', perfeito para transformar cada refeição em uma celebração de carinho.",
  "lugar-americano-alecrim-com-frase-que-nunca-nos-falte-gratidao-a-mesa-147":
    "Lugar americano acolhedor com a frase 'Que nunca nos falte gratidão à mesa', ideal para inspirar paz e agradecimento nos encontros em família.",
  "lugar-americano-oliveira-com-frase-a-esperanca-floresce-onde-deus-e-centro-149":
    "Lugar americano delicado com a frase 'A esperança floresce onde Deus é centro', trazendo espiritualidade e afeto para a composição da mesa posta.",
  "lugar-americano-lavanda-com-frase-que-nesta-mesa-reine-a-paz-143":
    "Lugar americano suave em tons de lavanda com a frase 'Que nesta mesa reine a paz', criando uma atmosfera serena e acolhedora para receber.",
  "lugar-americano-festa-junina-xadrez-azul-161":
    "Lugar americano impermeável com estampa xadrez junina em azul, ideal para compor mesas típicas cheias de cor, afeto e tradição.",
  "lugar-americano-festa-junina-xadrez-verde-159":
    "Lugar americano impermeável em xadrez verde festivo, perfeito para celebrar festividades típicas com praticidade e beleza.",
  "lugar-americano-festa-junina-xadrez-laranja-163":
    "Lugar americano impermeável em xadrez laranja caloroso, trazendo a alegria e a energia das festas tradicionais para a mesa posta.",
  "lugar-americano-festa-junina-xadrez-vermelho-bordo-165":
    "Lugar americano impermeável em xadrez bordô elegante, ideal para criar mesas temáticas marcantes e cheias de aconchego.",

  // Guardanapos avulsos
  "guardanapo-de-tecido-italia-verde-169":
    "Guardanapo em tecido verde com toque suave e acabamento refinado, perfeito para harmonizar com composições inspiradas na Itália e mesas campestres.",
  "guardanapo-de-tecido-branco-182":
    "Guardanapo clássico branco com toque macio e caimento impecável, o curinga essencial para enriquecer qualquer estilo de mesa posta.",
  "guardanapo-de-tecido-azul-marinho-180":
    "Guardanapo em tom azul marinho nobre com textura suave, proporcionando contraste sofisticado e elegância discreta a qualquer composição.",
  "guardanapo-de-tecido-off-white-184":
    "Guardanapo em tom off white neutro com toque macio, ideal para quem busca versatilidade, acolhimento e requinte atemporal.",
  "guardanapo-de-tecido-hot-dog-bordado-171":
    "Guardanapo temático em tecido macio com bordado exclusivo de hot dog, trazendo um toque divertido e afetivo aos lanches em família.",
  "guardanapo-azul-de-tecido-churrasco-172":
    "Guardanapo em jeans leve com toque macio e acabamento reforçado, o complemento descontraído e elegante para os dias de confraternização.",
  "guardanapo-de-tecido-hamburguer-individual-215":
    "Guardanapo temático em jeans leve com toque suave, ideal para compor encontros modernos e descontraídos ao redor de boas refeições.",
  "guardanapo-de-tecido-feijoada-bordado-com-frase-tradicao-e-reunir-quem-a-gente-ama-170":
    "Guardanapo delicado com a frase bordada 'Tradição é reunir quem a gente ama', expressando o verdadeiro significado de compartilhar a mesa.",
  "guardanapo-de-tecido-costela-de-adao-com-frase-a-mesa-146":
    "Guardanapo em linho misto com toque nobre e a frase 'À Mesa', um detalhe de sensibilidade e carinho para acolher cada convidado.",
  "guardanapo-de-tecido-alecrim-com-frase-em-casa-148":
    "Guardanapo em linho com caimento nobre e a frase bordada 'Em Casa', evocando a sensação de aconchego, pertencimento e amor.",
  "guardanapo-de-tecido-oliveira-com-frase-graca-a-mesa-150":
    "Guardanapo em linho misto com bordado delicado 'Graça à Mesa', perfeito para criar mesas cheias de bênçãos e momentos especiais.",
  "guardanapo-de-tecido-lavanda-com-frase-casa-aberta-144":
    "Guardanapo suave em linho com a frase 'Casa Aberta', traduzindo a hospitalidade e a generosidade de receber quem amamos com carinho.",
  "guardanapo-de-tecido-festa-junina-xadrez-verde-160":
    "Guardanapo com padronagem xadrez verde em tecido suave, perfeito para compor mesas típicas festivas com delicadeza e cor.",
  "guardanapo-de-tecido-festa-junina-xadrez-azul-162":
    "Guardanapo xadrez junino em azul com toque suave de algodão, ideal para mesas temáticas alegres e acolhedoras.",
  "guardanapo-de-tecido-festa-junina-xadrez-laranja-164":
    "Guardanapo vibrante em xadrez laranja com toque macio, trazendo calor e personalidade para as comemorações juninas.",
  "guardanapo-de-tecido-festa-junina-xadrez-vermelho-bordo-166":
    "Guardanapo em xadrez bordô com caimento suave, o detalhe perfeito para composições temáticas charmosas e aconchegantes.",

  // Porta-guardanapos
  "porta-guardanapo-dourado-com-esferas-metalizadas-157":
    "Porta-guardanapo artesanal com esferas douradas metalizadas, conferindo brilho refinado e sofisticação contemporânea para vestir a mesa.",
  "porta-guardanapo-tassel-marrom-185":
    "Porta-guardanapo com franja tassel em tom marrom terroso e aro artesanal, ideal para mesas acolhedoras com toque rústico chique.",
  "jogo-de-4-porta-guardanapos-margarida-fibra-natural-62":
    "Conjunto com 4 porta-guardanapos artesanais com flores de margarida e aro em fibra natural, trazendo o frescor da natureza para a mesa posta."
};

async function run() {
  console.log('--- APLICANDO DESCRIÇÕES POÉTICAS PADRÃO KIT LAVANDA NO SUPABASE ---');

  let updatedCount = 0;
  for (const [id, desc] of Object.entries(POETIC_DESCRIPTIONS)) {
    console.log(`[${id}]: "${desc.slice(0, 60)}..."`);
    const { error } = await supabase
      .from('produtos')
      .update({
        short_description: desc,
        description: desc,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error(`Erro ao atualizar ${id}:`, error);
    } else {
      updatedCount++;
    }
  }

  console.log(`\nConcluído: ${updatedCount} produtos atualizados com descrições poéticas autorais!`);
}

run();
