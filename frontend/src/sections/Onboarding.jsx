import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { useBebeStore } from "../store/useBebeStore";

const p = {
  terracotta: "#C4714A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0",
  sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

const STEPS = ["accueil", "prenom", "sexe", "naissance", "alimentation", "pret"];

const btn = { width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: p.terracotta, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8 };
const btnDisabled = { ...btn, background: p.linDark, cursor: "default" };
const input = { width: "100%", padding: "14px 16px", borderRadius: 14, border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: p.text, outline: "none", marginBottom: 16, textAlign: "center" };
const choixBtn = (active) => ({ flex: 1, padding: "18px 8px", borderRadius: 16, border: `2px solid ${active ? p.terracotta : p.linDark}`, background: active ? p.terracottaPale : "transparent", color: active ? p.terracotta : p.textLight, fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "center", transition: "all 0.2s" });
const modeBtn = (active) => ({ flex: 1, padding: "14px 8px", borderRadius: 14, border: `1.5px solid ${active ? p.terracotta : p.linDark}`, background: active ? p.terracottaPale : "transparent", color: active ? p.terracotta : p.textLight, fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center" });

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [prenom, setPrenom] = useState("");
  const [sexe, setSexe] = useState(null);
  const [dateNaissance, setDateNaissance] = useState("");
  const [modeAlimentation, setModeAlimentation] = useState("allait");

  const { setIsNewUser } = useUserStore();
  const { ajouterBebe } = useBebeStore();

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const e = sexe === "fille" ? "e" : ""; // accord féminin/masculin

  const terminer = () => {
    ajouterBebe({ prenom, sexe, dateNaissance, modeAlimentation });
    setIsNewUser(false);
  };

  const screen = {
    minHeight: "100vh", background: p.lin, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", padding: "40px 28px",
    maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={screen}>
      {/* Indicateur progression */}
      {step > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 40 }}>
          {STEPS.slice(1).map((_, i) => (
            <div key={i} style={{ width: i === step - 1 ? 24 : 8, height: 8, borderRadius: 4, background: i < step ? p.terracotta : p.linDark, transition: "all 0.3s" }} />
          ))}
        </div>
      )}

      {/* ── ÉTAPE 0 : PAGE D'ACCUEIL ALMA ── */}
      {step === 0 && (
        <>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 700, color: p.terracotta, marginBottom: 4, letterSpacing: "-1px" }}>alma</div>
          <div style={{ fontSize: 14, color: p.sauge, fontWeight: 600, marginBottom: 32, letterSpacing: "0.1em", textTransform: "uppercase" }}>ton espace maternité</div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {[
              { icon: "🤱", titre: "Ce qu'Alma fait", items: ["Suit l'alimentation, le sommeil et les couches de bébé", "T'accompagne dans le post-partum (corps, mental, nutrition)", "Te donne accès à une bibliothèque de fiches physiologiques", "Garde un œil doux sur ton moral via un check-in quotidien", "Gère ton réseau de soutien avec disponibilités en temps réel"] },
              { icon: "🚫", titre: "Ce qu'Alma ne fait pas et ne fera jamais", items: ["Donner des avis médicaux — toujours consulter un professionnel", "Collecter, vendre ou analyser tes données personnelles", "Afficher des publicités", "Partager tes informations avec des tiers"], alert: true },
              { icon: "🔒", titre: "Vie privée & IA", items: ["Compte anonyme — aucun email, aucun nom réel", "Toutes tes données restent sur ton appareil", "L'IA (Gemini Flash) génère des messages d'encouragement — elle ne stocke rien", "Tu peux supprimer toutes tes données à tout moment"] },
            ].map((section) => (
              <div key={section.titre} style={{ background: section.alert ? "#FFF8F0" : p.white, borderRadius: 16, padding: "14px 16px", border: `1px solid ${section.alert ? "#F0C090" : p.linDark}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: section.alert ? "#A0620A" : p.text, marginBottom: 8 }}>{section.icon} {section.titre}</div>
                {section.items.map((item, i) => (
                  <div key={i} style={{ fontSize: 12, color: p.textLight, display: "flex", gap: 8, marginBottom: 4 }}>
                    <span style={{ color: section.alert ? "#C07030" : p.sauge, flexShrink: 0 }}>·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button style={btn} onClick={next}>Commencer 🌿</button>
        </>
      )}

      {/* ── ÉTAPE 1 : PRÉNOM ── */}
      {step === 1 && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👶</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: p.text, marginBottom: 8, textAlign: "center" }}>Comment s'appelle ton bébé ?</div>
          <div style={{ fontSize: 14, color: p.textLight, textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>Son prénom, un surnom, ou "bébé" si pas encore décidé.</div>
          <input style={input} type="text" placeholder="Prénom..." value={prenom} onChange={e => setPrenom(e.target.value)} autoFocus />
          <button style={prenom.trim() ? btn : btnDisabled} onClick={() => prenom.trim() && next()}>Continuer</button>
        </>
      )}

      {/* ── ÉTAPE 2 : SEXE ── */}
      {step === 2 && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎀</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: p.text, marginBottom: 8, textAlign: "center" }}>{prenom} est...</div>
          <div style={{ fontSize: 14, color: p.textLight, textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>Pour adapter les accords dans l'app.</div>
          <div style={{ display: "flex", gap: 12, width: "100%", marginBottom: 24 }}>
            <button style={choixBtn(sexe === "fille")} onClick={() => setSexe("fille")}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>👧</div>
              <div>Une fille</div>
            </button>
            <button style={choixBtn(sexe === "garcon")} onClick={() => setSexe("garcon")}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>👦</div>
              <div>Un garçon</div>
            </button>
          </div>
          <button style={sexe ? btn : btnDisabled} onClick={() => sexe && next()}>Continuer</button>
        </>
      )}

      {/* ── ÉTAPE 3 : DATE DE NAISSANCE ── */}
      {step === 3 && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗓</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: p.text, marginBottom: 8, textAlign: "center" }}>Quand est né{e} {prenom} ?</div>
          <div style={{ fontSize: 14, color: p.textLight, textAlign: "center", marginBottom: 24 }}>Pour adapter les conseils à son âge exact.</div>
          <input style={{ ...input, fontSize: 16 }} type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} max={new Date().toISOString().split("T")[0]} />
          <button style={dateNaissance ? btn : btnDisabled} onClick={() => dateNaissance && next()}>Continuer</button>
        </>
      )}

      {/* ── ÉTAPE 4 : MODE ALIMENTATION ── */}
      {step === 4 && (
        <>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤱</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: p.text, marginBottom: 8, textAlign: "center" }}>Comment nourris-tu {prenom} ?</div>
          <div style={{ fontSize: 14, color: p.textLight, textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>Modifiable à tout moment. Tous les choix sont respectés.</div>
          <div style={{ display: "flex", gap: 8, width: "100%", marginBottom: 24 }}>
            {[["allait","🤱","Allaitement"],["biberon","🍼","Biberon"],["mixte","↔","Mixte"]].map(([m, icon, label]) => (
              <button key={m} style={modeBtn(modeAlimentation === m)} onClick={() => setModeAlimentation(m)}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                <div>{label}</div>
              </button>
            ))}
          </div>
          <button style={btn} onClick={next}>Continuer</button>
        </>
      )}

      {/* ── ÉTAPE 5 : PRÊT ── */}
      {step === 5 && (
        <>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✨</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: p.text, marginBottom: 8, textAlign: "center" }}>Tout est prêt !</div>
          <div style={{ fontSize: 14, color: p.textLight, textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>Alma est configurée pour {prenom}. Tu pourras ajouter d'autres enfants depuis ton profil.</div>
          <div style={{ width: "100%", padding: "16px", background: p.white, borderRadius: 16, marginBottom: 24, border: `1px solid ${p.linDark}` }}>
            <div style={{ fontSize: 13, color: p.textLight, marginBottom: 8, fontWeight: 600 }}>📋 Rappel</div>
            <div style={{ fontSize: 12, color: p.textLight, lineHeight: 1.6 }}>
              Alma est un outil d'aide, jamais un avis médical. Pour toute inquiétude concernant ta santé ou celle de {prenom}, consulte toujours un professionnel de santé.
            </div>
          </div>
          <button style={btn} onClick={terminer}>Ouvrir Alma 🌿</button>
        </>
      )}
    </div>
  );
}
