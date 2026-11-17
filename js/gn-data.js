/* ==========================================================================
   GN · DADOS REAIS DO PORTFÓLIO
   Usado pelo terminal e pelas conquistas. Só contém informações que já
   existem no portfólio (páginas de certificados, projetos e trajetória).
   Para atualizar: edite aqui — nenhum outro arquivo precisa mudar.
   ========================================================================== */
window.GN_DATA = {
  certificates: [
    {
      id: 'senai', name: 'SENAI', page: 'Cursos/senai.html',
      items: [
        'Tecnologia da Informação e Comunicação', 'Lógica de Programação', 'Excel Básico',
        'Por dentro da Segurança Cibernética', 'Ética na Inteligência Artificial',
        'Fundamentos da Inteligência Artificial', 'Desenvolvimento a Indústria 4.0',
        'Cidadania Digital e Uso Consciente da Internet', 'Desvendando ESG', 'Desvendando a Descarbonização',
        'Geração de Valor Circular e Modelos de Negócios', 'Fundamentos da Gestão de Projetos Aplicados',
        'Design Thinking', 'Empreender SENAI', 'Gestão do Tempo', 'Segurança no Trabalho',
        'Compliance: Prevenir, Identificar e Corrigir',
      ],
    },
    {
      id: 'sebrae', name: 'SEBRAE (Vitrine Sebrae)', page: 'Cursos/sebrae.html',
      items: [
        'Vai Lá e Faz', 'Cheio de Atitude', 'Fala aí', 'Meu Sucesso',
        'Criativos: O que são? Onde vivem? Do que se alimentam?', 'Fui lá e fiz', 'Essa Metamorfose Ambulante',
      ],
    },
    { id: 'sesi', name: 'SESI', page: 'Cursos/sesi.html', items: ['Participação Selibi 2025', 'Canguru de Matemática 2025'] },
    { id: 'bradesco', name: 'Fundação Bradesco', page: 'Cursos/fundacaoBradesco.html', items: ['Educação Financeira'] },
    { id: 'extras', name: 'Outros Cursos', page: 'Cursos/outrosCursos.html', items: ['Conecta — Comunicação & Multimídia', 'Gemini Academy para Universitários 2026'] },
  ],

  /* status: "done" = conquistada · "doing" = em andamento · "secret" = segredo ainda não descoberto */
  achievements: [
    { id: 'c-senai', cat: 'Certificados', icon: 'cap', name: 'Trilha SENAI', status: 'done', href: 'Cursos/senai.html',
      desc: '17 certificados e competências do SENAI, de lógica de programação a segurança cibernética.' },
    { id: 'c-sebrae', cat: 'Certificados', icon: 'bulb', name: 'Vitrine Sebrae', status: 'done', href: 'Cursos/sebrae.html',
      desc: '7 certificados de empreendedorismo e criatividade.' },
    { id: 'c-bradesco', cat: 'Certificados', icon: 'coin', name: 'Educação Financeira', status: 'done', href: 'Cursos/fundacaoBradesco.html',
      desc: 'Certificado de Educação Financeira da Fundação Bradesco.' },
    { id: 'c-gemini', cat: 'Certificados', icon: 'robot', name: 'Gemini Academy 2026', status: 'done', href: 'Cursos/outrosCursos.html',
      desc: 'Gemini Academy para Universitários 2026, sobre as funcionalidades do Google Gemini.' },
    { id: 'c-conecta', cat: 'Certificados', icon: 'video', name: 'Conecta Mídia', status: 'done', href: 'Cursos/outrosCursos.html',
      desc: 'Curso Conecta — Comunicação & Multimídia, realizado na Igreja.' },

    { id: 'e-selibi', cat: 'Eventos', icon: 'trophy', name: 'Selibi 2025', status: 'done', href: 'Cursos/sesi.html',
      desc: 'Participação no evento/competição Selibi 2025, do SESI.' },
    { id: 'e-canguru', cat: 'Eventos', icon: 'star', name: 'Canguru de Matemática 2025', status: 'done', href: 'Cursos/sesi.html',
      desc: 'Participação na olimpíada Canguru de Matemática 2025.' },

    { id: 'p-techcampus', cat: 'Projetos', icon: 'rocket', name: 'TechCampus', status: 'doing', href: '#projetos',
      desc: 'Sistema web full stack para a AAPM escolar, em desenvolvimento.' },
    { id: 'p-qualeaboa', cat: 'Projetos', icon: 'smartphone', name: 'Qual é a Boa?', status: 'doing', href: '#projetos',
      desc: 'Aplicativo mobile de sorteio de opções, em desenvolvimento.' },
    { id: 'p-capivarinha', cat: 'Projetos', icon: 'gamepad', name: 'Jogo da Capivarinha', status: 'done', href: '#projetos',
      desc: 'Jogo em Python com cliente e servidor, publicado no GitHub.' },

    { id: 't-node', cat: 'Tecnologias', icon: 'leaf', name: 'Back-end com Node.js', status: 'doing', href: '#habilidades',
      desc: 'Node.js, Express e SQLite em uso no TechCampus.' },
    { id: 't-rn', cat: 'Tecnologias', icon: 'smartphone', name: 'Primeiros passos no mobile', status: 'doing', href: '#habilidades',
      desc: 'Aprendendo React Native e Expo no app Qual é a Boa?.' },
    { id: 't-python', cat: 'Tecnologias', icon: 'scroll', name: 'Python em rede', status: 'done', href: '#habilidades',
      desc: 'Comunicação cliente/servidor com WebSockets e asyncio.' },

    { id: 'i-iot', cat: 'IoT', icon: 'chip', name: 'Integração IoT', status: 'doing', href: '#projetos',
      desc: 'Recursos de integração com IoT no TechCampus, em desenvolvimento.' },

    { id: 'x-sesi', cat: 'Experiência', icon: 'book', name: 'Jornada SESI', status: 'doing', href: '#trajetoria',
      desc: 'Estudante do SESI Guarulhos desde 2015.' },
    { id: 'x-senai', cat: 'Experiência', icon: 'code', name: 'Desenvolvimento de Sistemas', status: 'doing', href: '#trajetoria',
      desc: 'Estudante de Desenvolvimento de Sistemas no SENAI (2025 – 2026).' },
    { id: 'x-aprendiz', cat: 'Experiência', icon: 'brief', name: 'Jovem Aprendiz', status: 'doing', href: '#trajetoria',
      desc: 'Jovem Aprendiz do Consórcio Cantareira (2025 – 2026).' },

    /* segredos do próprio portfólio: ficam bloqueados até o visitante descobrir */
    { id: 's-coins', cat: 'Segredos', icon: 'coin', name: 'Caçador de moedas', status: 'secret',
      desc: 'Encontrou as 3 moedas escondidas pelo portfólio.', hint: 'Há moedas pixeladas escondidas pela página…' },
    { id: 's-logo', cat: 'Segredos', icon: 'sparkle', name: 'Fã do GN', status: 'secret',
      desc: 'Clicou 5 vezes seguidas no logo GN.', hint: 'O logo parece gostar de atenção.' },
    { id: 's-konami', cat: 'Segredos', icon: 'gamepad', name: 'Código clássico', status: 'secret',
      desc: 'Digitou o famoso código dos jogos antigos.', hint: 'Cima, cima, baixo, baixo… você conhece.' },
  ],
};
