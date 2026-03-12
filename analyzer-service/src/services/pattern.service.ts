export class PatternService {
  private static readonly PATTERNS = [
    { name: ':uuid', regex: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g },
    { name: ':ip', regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g },
    { name: ':email', regex: /\S+@\S+\.\S+/g },
    { name: ':date', regex: /\d{4}-\d{2}-\d{2}/g },
    // 🛡️ GÜÇLENDİRİLMİŞ ID: Kelime içindeki sayıları da (user_123 gibi) yakalaması için geliştirildi
    { name: ':id', regex: /(?<=_|-|\s|^)\d+(?=_|-|\s|$)/g },
    // 🛡️ HEX/TOKEN KESİCİ: Hata kodları veya rastgele oluşan hex değerleri için
    { name: ':hex', regex: /\b0x[0-9a-fA-F]+\b/g },
  ];

  static normalize(message: string): string {
    let normalized = message.trim();

    this.PATTERNS.forEach((p) => {
      normalized = normalized.replace(p.regex, p.name);
    });

    return normalized;
  }
}
