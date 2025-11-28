# Admin Panel - FitLife Pro

## Prezentare Generală

Admin Panel-ul oferă control complet asupra tuturor funcțiilor aplicației FitLife Pro. Acest panou este accesibil doar utilizatorilor administratori și oferă funcționalități avansate de management.

## Acces Admin

### Credențiale Admin
- **Email:** marketingporo@yahoo.com
- **Parolă:** Qwertys1994@

### Cum să Accesezi Admin Panel-ul
1. Autentifică-te cu credențialele de admin
2. După autentificare, vei vedea un nou buton "Admin Panel" în navbar
3. Click pe "Admin Panel" pentru a accesa panoul de administrare

## Funcționalități Admin Panel

### 1. 👥 User Management (Gestionare Utilizatori)
Controlează și administrează toți utilizatorii platformei.

**Funcționalități:**
- Vizualizare completă a tuturor utilizatorilor
- Căutare utilizatori după nume sau email
- Editare detalii utilizator:
  - Nume, email, vârstă, greutate
  - Nivel fitness (Începător, Intermediar, Avansat)
  - Tip abonament (Free, Premium)
- Ștergere utilizatori (cu protecție pentru contul admin)
- Badge-uri pentru identificarea rapidă a statusului

**Statistici afișate:**
- Total utilizatori în platformă
- Data de creare a fiecărui cont
- Nivel de abonament curent

### 2. 💳 Subscription Management (Gestionare Abonamente)
Control complet asupra abonamentelor utilizatorilor.

**Funcționalități:**
- Upgrade manual utilizatori la Premium
- Downgrade utilizatori la Free
- Setare date de expirare pentru abonamente Premium
- Vizualizare status abonamente (Activ/Expirat)

**Statistici afișate:**
- Total utilizatori
- Abonați Premium (cu număr de abonamente active)
- Utilizatori Free
- Rată de conversie (%)

### 3. 💰 Payment Management (Gestionare Plăți)
Monitorizare și analiză completă a tranzacțiilor.

**Funcționalități:**
- Vizualizare istoric complet al plăților
- Detalii tranzacții:
  - ID tranzacție
  - Utilizator și email
  - Plan achiziționat
  - Sumă plătită
  - Status (Finalizat/În așteptare/Eșuat)
  - Data tranzacției

**Statistici afișate:**
- Venit total generat
- Număr plăți finalizate
- Venit mediu per tranzacție
- Venit pentru luna curentă

### 4. 🏋️ Workout Management (Gestionare Antrenamente)
Administrare completă a antrenamentelor și planurilor de workout.

**Funcționalități:**
- Vizualizare toate antrenamentele create
- Detalii workout:
  - Nume și descriere
  - Tip/Categorie
  - Data creare
  - Status
- Vizualizare planuri de antrenament personalizate
- Monitorizare exerciții loguite

**Statistici afișate:**
- Total antrenamente în platformă
- Număr planuri de workout
- Exerciții loguite
- Medie exerciții per utilizator

### 5. 🍎 Nutrition Management (Gestionare Nutriție)
Control asupra rețetelor și jurnalelor de nutriție.

**Funcționalități:**
- Vizualizare toate rețetele din platformă
- Detalii rețete:
  - Nume și descriere
  - Calorii, proteine
  - Data creare
- Monitorizare înregistrări zilnice nutriție:
  - Tip masă (Mic dejun, Prânz, Cină, Gustare)
  - Calorii consumate
  - Data consumului

**Statistici afișate:**
- Total rețete disponibile
- Înregistrări nutriție
- Total calorii înregistrate
- Medie calorii per înregistrare

### 6. 🤖 AI Coach Settings (Setări AI Coach)
Configurare completă a asistentului AI.

**Funcționalități:**
- Activare/Dezactivare AI Coach
- Configurare model AI:
  - Selecție model (ex: GPT-4)
  - Temperature (0-2)
  - Max tokens pentru răspunsuri
- Personalizare System Prompt
- Setări comportament:
  - Include mesaje motivaționale
  - Auto-sugestii bazate pe progres
  - Stil răspuns (Profesional/Prietenos/Motivațional)

**Statistici afișate:**
- Total conversații AI
- Mesaje trimise
- Rating mediu utilizatori

### 7. ⚙️ System Settings (Setări Sistem)
Configurări generale ale platformei și monitorizare sistem.

**Funcționalități:**
- Setări generale:
  - Nume platformă
  - Mod mentenanță (on/off)
  - Permite înregistrări noi (on/off)
  - Verificare email obligatorie
  - Timeout sesiune (minute)
  - Limită utilizatori per plan
- Notificări și Analytics:
  - Activare/Dezactivare notificări sistem
  - Activare/Dezactivare colectare analytics
- Informații database:
  - Spațiu utilizat
  - Apeluri API (24h)
  - Rată erori
  - Status backup

**Statistici sistem afișate:**
- Utilizatori activi (ultimele 24h)
- Uptime platformă
- Timp mediu de răspuns
- Apeluri API
- Spațiu stocare utilizat

## Securitate și Autorizare

### Protecție Acces
- Admin Panel-ul este accesibil **DOAR** utilizatorului cu email: `marketingporo@yahoo.com`
- Dacă un utilizator non-admin încearcă să acceseze panoul, primește un mesaj de eroare "Access Denied"
- Contul admin nu poate fi șters din User Management

### Best Practices
1. **Nu partaja credențialele de admin** cu persoane neautorizate
2. **Verifică întotdeauna** înainte de a șterge utilizatori sau date
3. **Folosește Mod Mentenanță** când faci update-uri majore
4. **Monitorizează regulat** statisticile și analytics-ul

## Flux de Lucru Recomandat

### Gestionare Zilnică
1. Verifică User Management pentru utilizatori noi
2. Monitorizează Payment Management pentru tranzacții
3. Revizuiește System Settings - statistici sistem

### Gestionare Săptămânală
1. Analizează Subscription Management - rata de conversie
2. Verifică AI Coach Settings - rating și feedback
3. Revizuiește Workout și Nutrition Management pentru conținut nou

### Gestionare Lunară
1. Analizează Payment Management - venituri lunare
2. Optimizează AI Coach Settings bazat pe feedback
3. Actualizează System Settings după necesități

## Tehnologii Utilizate

### Frontend
- **React 19** cu TypeScript
- **Tailwind CSS** pentru styling
- **shadcn/ui** pentru componente UI
- **Lucide React** pentru iconițe

### Data Management
- **RAF CLI ORM** pentru database operations
- **Material Interface** pentru data modeling
- Singleton pattern pentru instanțe ORM

### Componente UI Utilizate
- Tables pentru liste de date
- Cards pentru statistici
- Dialogs pentru editare/confirmare
- Badges pentru statusuri
- Switches pentru toggle settings
- Select dropdowns pentru opțiuni

## Structura Fișierelor

```
src/components/admin/
├── admin-panel.tsx                    # Container principal
└── sections/
    ├── user-management.tsx            # Gestionare utilizatori
    ├── subscription-management.tsx     # Gestionare abonamente
    ├── payment-management.tsx          # Gestionare plăți
    ├── workout-management.tsx          # Gestionare antrenamente
    ├── nutrition-management.tsx        # Gestionare nutriție
    ├── ai-coach-settings.tsx          # Setări AI Coach
    └── system-settings.tsx            # Setări sistem
```

## Support și Troubleshooting

### Probleme Comune

**1. Nu văd Admin Panel în navbar**
- Verifică că ești autentificat cu email-ul corect: `marketingporo@yahoo.com`
- Logout și login din nou

**2. Nu pot șterge un utilizator**
- Contul admin nu poate fi șters (protecție)
- Verifică că utilizatorul nu are restricții

**3. Statisticile nu se încarcă**
- Verifică conexiunea la database
- Refresh pagina
- Verifică console-ul pentru erori

## Viitor Development

### Features Planificate
- [ ] Export date în CSV/Excel
- [ ] Grafice și charts pentru analytics
- [ ] Sistem de notificări pentru admin
- [ ] Audit log pentru acțiuni admin
- [ ] Bulk operations pentru utilizatori
- [ ] Custom reports generator
- [ ] Email marketing integration
- [ ] Advanced filtering și sorting

---

**Versiune:** 1.0.0
**Ultima actualizare:** 2025-11-27
**Contact Admin:** marketingporo@yahoo.com
