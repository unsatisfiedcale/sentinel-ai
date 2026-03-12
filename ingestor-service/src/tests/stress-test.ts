import 'dotenv/config';

/**
 * ⚡ SENTINEL-AI INTERNAL STRESS TEST
 * Bu script, .env dosyasındaki PORT ve API_URL'i kullanarak
 * sistemi test eder.
 */

// Env'den değerleri çekiyoruz
const PORT = process.env.PORT;
const API_URL = process.env.API_URL;

const INGESTOR_ENDPOINT = `http://localhost:${PORT}${API_URL}/logs`;

const TOTAL_LOGS = 10;

async function sendLog(id: number) {
  // 🎯 Testi zorlaştırıyoruz: Her mesajın ID'si ve IP'si farklı!
  const randomUserId = Math.floor(Math.random() * 9999);
  const randomIp = `192.168.1.${Math.floor(Math.random() * 255)}`;

  const logPayload = {
    project: 'stress-test-app',
    level: 'error',
    // Mesajlar farklı görünüyor ama PatternService bunları ":id" ve ":ip" yapmalı
    message: `Critical Failure: Connection lost for user_${randomUserId} from IP ${randomIp}`,
    stack: 'Error: Connection timeout\n    at Pool.query (/app/db.js:12:45)',
    meta: {
      attempt: id,
      runtime: 'stress-test',
      // Değişkenliği burada tutabilirsin, bu DB'deki gruplamayı bozmaz
      internal_code: `ERR_${Math.random().toString(16).substring(2, 8)}`,
    },
  };

  try {
    const response = await fetch(INGESTOR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logPayload),
    });
    console.log(`🚀 [Log ${id}] Status: ${response.status} ✅`);
  } catch (error) {
    console.error(`🚨 [Log ${id}] Hata!`);
  }
}

async function run() {
  console.log('\n' + '='.repeat(50));
  console.log('🔥 SENTINEL-AI STRESS TEST BAŞLIYOR');
  console.log(`📡 Hedef: ${INGESTOR_ENDPOINT}`);
  console.log(`📦 Adet: ${TOTAL_LOGS} paralel istek`);
  console.log('='.repeat(50) + '\n');

  const tasks = [];
  for (let i = 1; i <= TOTAL_LOGS; i++) {
    tasks.push(sendLog(i));
  }

  // 10 isteği aynı anda fırlatıyoruz
  await Promise.all(tasks);

  console.log('\n✅ Bombalama tamamlandı.');
  console.log('👉 Şimdi Analyzer (Worker) terminaline bak!');
  console.log("🧐 Beklenen: 1 AI Analizi tetiklenmesi ve 9 adet 'Atlanıyor' mesajı.");
}

run();
