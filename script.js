// GÖRGETÉSI ANIMÁCIÓK
const elemek = document.querySelectorAll('.megjelenik');
if ('IntersectionObserver' in window) {
  const megfigyelo = new IntersectionObserver((bejegyzesek, observer) => {
    bejegyzesek.forEach((bejegyzes) => {
      if (bejegyzes.isIntersecting) {
        bejegyzes.target.classList.add('latszik');
        observer.unobserve(bejegyzes.target);
      }
    });
  }, { threshold: 0.1 });
  elemek.forEach((elem) => megfigyelo.observe(elem));
} else {
  elemek.forEach((elem) => elem.classList.add('latszik'));
}

// SÖTÉT MÓD – a beállítás mindkét oldalon megmarad
const temaGomb = document.getElementById('temaGomb');
function temaBeallitasa(sotet) {
  document.body.classList.toggle('sotet', sotet);
  if (temaGomb) temaGomb.textContent = sotet ? '☀️ Világos mód' : '🌙 Sötét mód';
}
try { temaBeallitasa(localStorage.getItem('budapestTema') === 'sotet'); }
catch (hiba) { temaBeallitasa(false); }
if (temaGomb) {
  temaGomb.addEventListener('click', () => {
    const sotet = !document.body.classList.contains('sotet');
    temaBeallitasa(sotet);
    try { localStorage.setItem('budapestTema', sotet ? 'sotet' : 'vilagos'); } catch (hiba) {}
  });
}

// KÉPGALÉRIA – kattintásra nagyítás, Escape vagy háttérkattintás bezárja
const kepNagyito = document.getElementById('kepNagyito');
const nagyKep = document.getElementById('nagyKep');
const kepFelirat = document.getElementById('kepFelirat');
function kepNagyitas(kep) {
  if (!kepNagyito) return;
  nagyKep.src = kep.src;
  nagyKep.alt = kep.alt;
  kepFelirat.textContent = kep.alt;
  kepNagyito.classList.add('aktiv');
  kepNagyito.setAttribute('aria-hidden', 'false');
}
function bezarKep() {
  if (!kepNagyito) return;
  kepNagyito.classList.remove('aktiv');
  kepNagyito.setAttribute('aria-hidden', 'true');
}
document.querySelectorAll('[data-gallery]').forEach((kep) => {
  kep.addEventListener('click', () => kepNagyitas(kep));
});
const bezarGomb = document.querySelector('.bezar');
if (bezarGomb) bezarGomb.addEventListener('click', bezarKep);
if (kepNagyito) kepNagyito.addEventListener('click', (e) => {
  if (e.target === kepNagyito) bezarKep();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') bezarKep(); });

// VÉLETLENSZERŰ BUDAPESTI ÉRDEKESSÉGEK
const erdekessegek = [
  'Budapest 1873-ban jött létre Buda, Pest és Óbuda egyesítésével.',
  'A budapesti M1-es metró 1896-ban nyílt meg, és a kontinentális Európa első földalatti vasútjai közé tartozik.',
  'A Széchenyi Lánchíd 1849-ben nyílt meg.',
  'A Parlament épülete közvetlenül a Duna partján áll.',
  'A Margitsziget a Duna közepén található, és népszerű pihenőhely.',
  'A Hősök tere a magyar történelem fontos alakjainak állít emléket.',
  'A Budai Várnegyed Budapest világörökségi területének része.'
];
const erdekessegSzoveg = document.getElementById('erdekessegSzoveg');
const erdekessegGomb = document.getElementById('erdekessegGomb');
if (erdekessegGomb && erdekessegSzoveg) {
  erdekessegGomb.addEventListener('click', () => {
    const elozo = erdekessegSzoveg.dataset.index;
    let uj = Math.floor(Math.random() * erdekessegek.length);
    while (erdekessegek.length > 1 && String(uj) === elozo) uj = Math.floor(Math.random() * erdekessegek.length);
    erdekessegSzoveg.textContent = erdekessegek[uj];
    erdekessegSzoveg.dataset.index = uj;
  });
}

// BUDAPEST KVÍZ PONTOZÁSSAL
const kerdesek = [
  { kerdes: 'Mikor egyesítették Budát, Pestet és Óbudát?', valaszok: ['1848', '1873', '1896', '1900'], helyes: 1 },
  { kerdes: 'Melyik folyó szeli ketté Budapestet?', valaszok: ['Tisza', 'Dráva', 'Duna', 'Rába'], helyes: 2 },
  { kerdes: 'Hol található a Halászbástya?', valaszok: ['Pesten', 'Budán', 'A Margitszigeten', 'Csepelen'], helyes: 1 },
  { kerdes: 'Melyik évben nyílt meg az M1-es metró?', valaszok: ['1896', '1910', '1920', '1873'], helyes: 0 },
  { kerdes: 'Melyik tér híres a hét vezér szobrairól?', valaszok: ['Kossuth tér', 'Deák tér', 'Hősök tere', 'Vörösmarty tér'], helyes: 2 }
];
let aktualisKerdes = 0;
let pontok = 0;
let valaszolt = false;
const kerdesElem = document.getElementById('kerdes');
const valaszokElem = document.getElementById('valaszok');
const kovetkezoGomb = document.getElementById('kovetkezoGomb');
const ujrakezdesGomb = document.getElementById('ujrakezdesGomb');

function kvizInditasa() {
  aktualisKerdes = 0; pontok = 0; valaszolt = false;
  document.getElementById('kvizEredmeny').textContent = '';
  ujrakezdesGomb.hidden = true;
  kovetkezoGomb.hidden = false;
  kerdesMegjelenitese();
}
function kerdesMegjelenitese() {
  const adat = kerdesek[aktualisKerdes];
  document.getElementById('kerdesSzam').textContent = `${aktualisKerdes + 1} / ${kerdesek.length}. kérdés`;
  document.getElementById('pontszam').textContent = `Pontszám: ${pontok}`;
  kerdesElem.textContent = adat.kerdes;
  document.getElementById('visszajelzes').textContent = '';
  document.getElementById('haladasCsik').style.width = `${aktualisKerdes / kerdesek.length * 100}%`;
  valaszokElem.innerHTML = '';
  adat.valaszok.forEach((valasz, index) => {
    const gomb = document.createElement('button');
    gomb.className = 'valasz-gomb';
    gomb.type = 'button';
    gomb.textContent = valasz;
    gomb.addEventListener('click', () => valaszEllenorzese(index));
    valaszokElem.appendChild(gomb);
  });
  valaszolt = false;
  kovetkezoGomb.disabled = true;
}
function valaszEllenorzese(index) {
  if (valaszolt) return;
  valaszolt = true;
  const helyes = kerdesek[aktualisKerdes].helyes;
  document.querySelectorAll('.valasz-gomb').forEach((gomb, i) => {
    gomb.disabled = true;
    if (i === helyes) gomb.classList.add('helyes');
    if (i === index && index !== helyes) gomb.classList.add('hibas');
  });
  if (index === helyes) {
    pontok++;
    document.getElementById('visszajelzes').textContent = '🎉 Helyes válasz! +1 pont';
  } else {
    document.getElementById('visszajelzes').textContent = `❌ Nem jó válasz! A helyes válasz: ${kerdesek[aktualisKerdes].valaszok[helyes]}`;
  }
  document.getElementById('pontszam').textContent = `Pontszám: ${pontok}`;
  kovetkezoGomb.disabled = false;
}
function kvizBefejezese() {
  kerdesElem.textContent = 'A kvíz véget ért!';
  valaszokElem.innerHTML = '';
  document.getElementById('visszajelzes').textContent = '';
  document.getElementById('haladasCsik').style.width = '100%';
  kovetkezoGomb.hidden = true;
  document.getElementById('kvizEredmeny').innerHTML =
    `<h2>Eredmény: ${pontok} / ${kerdesek.length} pont</h2><p>${pontok === 5 ? '🏆 Tökéletes! Igazi Budapest-szakértő vagy!' : pontok >= 3 ? '👏 Nagyon ügyes vagy!' : '😊 Gyakorolj még, és fedezd fel jobban Budapestet!'}</p>`;
  ujrakezdesGomb.hidden = false;
}
if (kerdesElem && valaszokElem && kovetkezoGomb && ujrakezdesGomb) {
  kovetkezoGomb.addEventListener('click', () => {
    if (!valaszolt) return;
    aktualisKerdes++;
    if (aktualisKerdes < kerdesek.length) kerdesMegjelenitese();
    else kvizBefejezese();
  });
  ujrakezdesGomb.addEventListener('click', kvizInditasa);
  kvizInditasa();
}

// KATTINTHATÓ BUDAPEST-TÉRKÉP – külső csempeszerver nélkül
const terkepElem = document.getElementById('budapestTerkepe');
if (terkepElem) {
  const helyek = [
    { nev: 'Országház', leiras: 'Budapest ikonikus, neogótikus épülete a Duna partján.', x: 54, y: 22, keres: 'Országház, Budapest' },
    { nev: 'Lánchíd', leiras: 'A Duna két partját összekötő híres híd.', x: 48, y: 48, keres: 'Széchenyi lánchíd, Budapest' },
    { nev: 'Halászbástya', leiras: 'Mesés panoráma nyílik innen a pesti oldalra.', x: 29, y: 35, keres: 'Halászbástya, Budapest' },
    { nev: 'Hősök tere', leiras: 'A Millenniumi emlékmű és a Városliget kapuja.', x: 83, y: 17, keres: 'Hősök tere, Budapest' },
    { nev: 'Szent István-bazilika', leiras: 'A belváros egyik legismertebb temploma.', x: 65, y: 53, keres: 'Szent István-bazilika, Budapest' },
    { nev: 'Széchenyi fürdő', leiras: 'Különleges termálfürdő a Városligetben.', x: 88, y: 35, keres: 'Széchenyi gyógyfürdő, Budapest' }
  ];
  terkepElem.innerHTML = `
    <div class="terkep-rajz" role="group" aria-label="Budapest sematikus térképe, kattintható nevezetességekkel">
      <div class="terkep-felirat buda-felirat">BUDA</div><div class="terkep-felirat pest-felirat">PEST</div>
      <div class="terkep-duna"><span>DUNA</span></div>
      <div class="terkep-ut ut-egy"></div><div class="terkep-ut ut-ketto"></div><div class="terkep-ut ut-harom"></div>
      ${helyek.map((hely, i) => `<button class="terkep-jelolo" type="button" style="left:${hely.x}%;top:${hely.y}%" data-hely="${i}" aria-label="${hely.nev}"><span>${i + 1}</span></button>`).join('')}
    </div>
    <div class="terkep-reszlet" aria-live="polite"><div><strong id="terkepHelyNev">Válassz egy nevezetességet!</strong><p id="terkepHelyLeiras">Kattints a számozott jelölők egyikére a rövid ismertetőért.</p></div><a id="terkepUtvonal" href="https://www.google.com/maps/search/?api=1&query=Budapest" target="_blank" rel="noopener">Megnyitás a térképen ↗</a></div>
    <div class="terkep-jelmagy">${helyek.map((hely, i) => `<button type="button" class="terkep-listaelem" data-hely="${i}"><span>${i + 1}</span>${hely.nev}</button>`).join('')}</div>`;

  const helyNev = document.getElementById('terkepHelyNev');
  const helyLeiras = document.getElementById('terkepHelyLeiras');
  const utvonal = document.getElementById('terkepUtvonal');
  terkepElem.querySelectorAll('[data-hely]').forEach((gomb) => {
    gomb.addEventListener('click', () => {
      const hely = helyek[Number(gomb.dataset.hely)];
      helyNev.textContent = hely.nev;
      helyLeiras.textContent = hely.leiras;
      utvonal.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hely.keres)}`;
      terkepElem.querySelectorAll('.terkep-jelolo').forEach((jelolo) => jelolo.classList.toggle('kivalasztva', jelolo.dataset.hely === gomb.dataset.hely));
    });
  });
}
