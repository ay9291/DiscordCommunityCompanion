const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'translate',
  description: 'Translate text between languages',
  aliases: ['tr', 'lang'],
  usage: '!translate <language> <text>',
  cooldown: 5,
  async execute(message, args, client) {
    if (args.length < 2) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Invalid Usage')
        .setDescription('Please provide a target language and text to translate!')
        .addFields([
          { name: 'Usage', value: '`!translate spanish Hello world`\n`!translate fr Bonjour le monde`', inline: false },
          { name: 'Supported Languages', value: 'spanish, french, german, italian, portuguese, russian, japanese, chinese, korean, arabic', inline: false }
        ])
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    const targetLang = args[0].toLowerCase();
    const text = args.slice(1).join(' ');
    
    // Language mappings
    const languages = {
      'spanish': 'es',
      'spanish es': 'es',
      'es': 'es',
      'french': 'fr',
      'fr': 'fr',
      'german': 'de',
      'de': 'de',
      'italian': 'it',
      'it': 'it',
      'portuguese': 'pt',
      'pt': 'pt',
      'russian': 'ru',
      'ru': 'ru',
      'japanese': 'ja',
      'ja': 'ja',
      'chinese': 'zh',
      'zh': 'zh',
      'korean': 'ko',
      'ko': 'ko',
      'arabic': 'ar',
      'ar': 'ar'
    };
    
    const langCode = languages[targetLang];
    
    if (!langCode) {
      const embed = new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('❌ Unsupported Language')
        .setDescription(`Language "${targetLang}" is not supported.`)
        .addFields({
          name: 'Supported Languages',
          value: 'spanish, french, german, italian, portuguese, russian, japanese, chinese, korean, arabic',
          inline: false
        })
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    // Mock translation (in real implementation, use translation API)
    const translations = {
      'hello': { es: 'hola', fr: 'bonjour', de: 'hallo', it: 'ciao', pt: 'olá', ru: 'привет', ja: 'こんにちは', zh: '你好', ko: '안녕하세요', ar: 'مرحبا' },
      'goodbye': { es: 'adiós', fr: 'au revoir', de: 'auf wiedersehen', it: 'ciao', pt: 'tchau', ru: 'до свидания', ja: 'さようなら', zh: '再见', ko: '안녕히 가세요', ar: 'وداعا' },
      'thank you': { es: 'gracias', fr: 'merci', de: 'danke', it: 'grazie', pt: 'obrigado', ru: 'спасибо', ja: 'ありがとう', zh: '谢谢', ko: '감사합니다', ar: 'شكرا' },
      'yes': { es: 'sí', fr: 'oui', de: 'ja', it: 'sì', pt: 'sim', ru: 'да', ja: 'はい', zh: '是的', ko: '네', ar: 'نعم' },
      'no': { es: 'no', fr: 'non', de: 'nein', it: 'no', pt: 'não', ru: 'нет', ja: 'いいえ', zh: '不', ko: '아니요', ar: 'لا' }
    };
    
    const lowerText = text.toLowerCase();
    let translatedText = translations[lowerText]?.[langCode] || `[Translation of "${text}" to ${targetLang}]`;
    
    // Get language flags
    const flags = {
      'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹', 'pt': '🇵🇹',
      'ru': '🇷🇺', 'ja': '🇯🇵', 'zh': '🇨🇳', 'ko': '🇰🇷', 'ar': '🇸🇦'
    };
    
    const languageNames = {
      'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian', 'pt': 'Portuguese',
      'ru': 'Russian', 'ja': 'Japanese', 'zh': 'Chinese', 'ko': 'Korean', 'ar': 'Arabic'
    };
    
    const embed = new EmbedBuilder()
      .setColor('#4CAF50')
      .setTitle('🌍 Translation')
      .addFields([
        { name: '📝 Original Text', value: text, inline: false },
        { name: `${flags[langCode]} ${languageNames[langCode]} Translation`, value: translatedText, inline: false },
        { name: '🔤 Language Code', value: langCode.toUpperCase(), inline: true },
        { name: '📊 Confidence', value: translations[lowerText] ? '95%' : '70%', inline: true }
      ])
      .setFooter({ text: `Translated by ${message.author.username} • Powered by BotMaster Translate` })
      .setTimestamp();
    
    // Add pronunciation if available
    if (langCode === 'ja' || langCode === 'zh' || langCode === 'ko' || langCode === 'ar' || langCode === 'ru') {
      embed.addFields({
        name: '🗣️ Note',
        value: 'For accurate pronunciation, consider using text-to-speech or language learning resources.',
        inline: false
      });
    }
    
    message.reply({ embeds: [embed] });
  }
};