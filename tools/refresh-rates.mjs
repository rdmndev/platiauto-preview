// Обновляет api/rates-snapshot.json курсом с platiauto.ru (запускается GitHub Actions раз в час).
import { writeFile } from 'node:fs/promises';
const currencies = ['USD', 'EUR', 'CNY', 'AED', 'KGS', 'KZT', 'KRW', 'JPY'];
const html = await (await fetch('https://platiauto.ru/', { headers: { 'User-Agent': 'PlatiAuto-Preview/1.0' } })).text();
const rates = JSON.parse(html.match(/(?:var|const|let)\s+RATES\s*=\s*(\{[^;]+\})\s*;/)?.[1] ?? 'null');
const rateDate = html.match(/Курс на\s+(\d{2}\.\d{2}\.\d{4})/)?.[1];
if (!rates || !rateDate || !currencies.every(c => rates[c] > 0)) throw new Error('Rates not found on platiauto.ru');
await writeFile(new URL('../api/rates-snapshot.json', import.meta.url), JSON.stringify({ rates, rateDate, fetchedAt: new Date().toISOString(), source: 'https://platiauto.ru/' }));
