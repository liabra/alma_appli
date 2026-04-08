import { useState } from "react";
import { useBebeStore } from "../store/useBebeStore";
import { useSessionStore } from "../store/useSessionStore";
import { useUserStore } from "../store/useUserStore";
import { useNavigate } from "react-router-dom";
import { generateRecoveryCode } from "../hooks/useSync";

const p = {
  terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

function FormulaireAjoutBebe({ onSave, onCancel }) {
  const [form, setForm] = useState({ prenom: "", sexe: null, dateNaissance: "", modeAlimentation: "allait" });

  return (
    <div style={{ background: p.lin, borderRadius: 16, padding: "16px", border: `1.5px solid ${p.terracottaPale}`, marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: p.text, marginBottom: 12 }}>👶 Ajouter un enfant</div>

      <input type="text" placeholder="Prénom *" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 14, outline: "none", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }} />

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {[["fille","👧","Fille"],["garcon","👦","Garçon"]].map(([s, icon, label]) => (
          <button key={s} onClick={() => setForm(f => ({ ...f, sexe: s }))}
            style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1.5px solid ${form.sexe === s ? p.terracotta : p.linDark}`, background: form.sexe === s ? p.terracottaPale : "transparent", color: form.sexe === s ? p.terracotta : p.textLight, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            {icon} {label}
          </button>
        ))}
      </div>

      <input type="date" value={form.dateNaissance} onChange={e => setForm(f => ({ ...f, dateNaissance: e.target.value }))}
        max={new Date().toISOString().split("T")[0]}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${p.linDark}`, background: p.white, fontSize: 14, outline: "none", marginBottom: 10 }} />

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[["allait","🤱","Allait."],["biberon","🍼","Biberon"],["mixte","↔","Mixte"]].map(([m, icon, label]) => (
          <button key={m} onClick={() => setForm(f => ({ ...f, modeAlimentation: m }))}
            style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: `1.5px solid ${form.modeAlimentation === m ? p.terracotta : p.linDark}`, background: form.modeAlimentation === m ? p.terracottaPale : "transparent", color: form.modeAlimentation === m ? p.terracotta : p.textLight, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            {icon} {label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: `1.5px solid ${p.linDark}`, background: "transparent", color: p.textLight, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Annuler</button>
        <button onClick={() => form.prenom.trim() && form.sexe && form.dateNaissance && onSave(form)}
          disabled={!form.prenom.trim() || !form.sexe || !form.dateNaissance}
          style={{ flex: 2, padding: "10px 0", borderRadius: 12, border: "none", background: (form.prenom.trim() && form.sexe && form.dateNaissance) ? p.terracotta : p.linDark, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Ajouter
        </button>
      </div>
    </div>
  );
}

export default function Profil() {
  const { bebes, bebeActifId, setBebeActif, ajouterBebe, supprimerBebe, getAgeLabel, getBebe } = useBebeStore();
  const { uuid } = useUserStore();
  const navigate = useNavigate();
  const [recoveryCode, setRecoveryCode] = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);

  const obtenirCode = async () => {
    setLoadingCode(true);
    const code = await generateRecoveryCode(uuid);
    setRecoveryCode(code || "Erreur — réessaie plus tard");
    setLoadingCode(false);
  };
  const [ajouterMode, setAjouterMode] = useState(false);
  const [confirmerSuppr, setConfirmerSuppr] = useState(null);

  const sauvegarderBebe = (data) => { ajouterBebe(data); setAjouterMode(false); };

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: p.lin }}>
      {/* Header */}
      <div style={{ padding: "52px 24px 18px", background: p.white, borderBottom: `1px solid ${p.linDark}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => navigate("/")} style={{ background: p.linDark, border: "none", borderRadius: "50%", width: 34, height: 34, fontSize: 16, cursor: "pointer" }}>←</button>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: p.text }}>Mon profil</span>
      </div>

      <div style={{ padding: "18px 18px 110px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Mes enfants */}
        <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.linDark}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: p.text }}>👶 Mes enfants</div>
            {!ajouterMode && (
              <button onClick={() => setAjouterMode(true)}
                style={{ fontSize: 12, fontWeight: 700, color: p.sauge, background: p.saugePale, border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>
                + Ajouter
              </button>
            )}
          </div>

          {ajouterMode && <FormulaireAjoutBebe onSave={sauvegarderBebe} onCancel={() => setAjouterMode(false)} />}

          {bebes.map(bebe => {
            const actif = bebe.id === (bebeActifId || bebes[0]?.id);
            // Recalculer l'âge pour ce bébé spécifique
            const ageDays = Math.floor((Date.now() - new Date(bebe.dateNaissance).getTime()) / 86400000);
            const ageLabel = (() => {
              if (ageDays < 7) return `${ageDays} jour${ageDays > 1 ? "s" : ""}`;
              const w = Math.floor(ageDays / 7);
              if (w < 8) return `${w} semaine${w > 1 ? "s" : ""}`;
              const m = Math.floor(ageDays / 30);
              if (m < 24) return `${m} mois`;
              return `${Math.floor(m/12)} an${Math.floor(m/12) > 1 ? "s" : ""}`;
            })();

            return (
              <div key={bebe.id}
                style={{ padding: "12px 14px", borderRadius: 14, border: `2px solid ${actif ? p.terracotta : p.linDark}`, background: actif ? p.terracottaPale : p.lin, marginBottom: 8, cursor: "pointer" }}
                onClick={() => setBebeActif(bebe.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    {actif && <div style={{ fontSize: 10, fontWeight: 700, color: p.terracotta, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>✦ Actif</div>}
                    <div style={{ fontSize: 15, fontWeight: 700, color: p.text }}>{bebe.sexe === "fille" ? "👧" : "👦"} {bebe.prenom}</div>
                    <div style={{ fontSize: 12, color: p.textLight }}>{ageLabel} · {bebe.modeAlimentation}</div>
                  </div>
                  {bebes.length > 1 && (
                    <button onClick={e => { e.stopPropagation(); setConfirmerSuppr(bebe.id); }}
                      style={{ fontSize: 11, color: "#C04040", background: "#FFF0F0", border: "1px solid #F0C0C0", borderRadius: 8, padding: "4px 8px", cursor: "pointer" }}>
                      Supprimer
                    </button>
                  )}
                </div>
                {confirmerSuppr === bebe.id && (
                  <div style={{ marginTop: 10, padding: "10px", background: "#FFF0F0", borderRadius: 10 }}>
                    <div style={{ fontSize: 12, color: "#C04040", marginBottom: 8 }}>Supprimer {bebe.prenom} ? Cette action est irréversible.</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={e => { e.stopPropagation(); setConfirmerSuppr(null); }}
                        style={{ flex: 1, padding: "6px", borderRadius: 8, border: `1px solid ${p.linDark}`, background: "transparent", fontSize: 12, cursor: "pointer" }}>Annuler</button>
                      <button onClick={e => { e.stopPropagation(); supprimerBebe(bebe.id); setConfirmerSuppr(null); }}
                        style={{ flex: 1, padding: "6px", borderRadius: 8, border: "none", background: "#C04040", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Supprimer</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Compte anonyme + code récupération */}
        <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.linDark}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: p.text, marginBottom: 10 }}>🔒 Compte anonyme</div>
          <div style={{ fontSize: 12, color: p.textLight, lineHeight: 1.6, marginBottom: 12 }}>
            Aucun email, aucun nom réel. Tes données sont synchronisées sur nos serveurs et liées à ton identifiant anonyme.
          </div>

          {/* Code de récupération */}
          <div style={{ background: p.lin, borderRadius: 12, padding: "14px", marginBottom: 12, border: `1px solid ${p.terracottaPale}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: p.terracotta, marginBottom: 6 }}>🔑 Code de récupération</div>
            <div style={{ fontSize: 12, color: p.textLight, lineHeight: 1.5, marginBottom: 10 }}>
              Si tu changes de téléphone, note ce code. Il te permettra de retrouver toutes tes données.
            </div>
            {recoveryCode ? (
              <>
                <div style={{ fontSize: 22, fontWeight: 700, color: p.text, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "2px", textAlign: "center", padding: "10px", background: p.white, borderRadius: 10, marginBottom: 8, border: `2px solid ${p.terracottaPale}` }}>
                  {recoveryCode}
                </div>
                <div style={{ fontSize: 11, color: p.textLight, textAlign: "center", fontStyle: "italic" }}>
                  📸 Prends-en une photo ou note-le quelque part
                </div>
              </>
            ) : (
              <button onClick={obtenirCode} disabled={loadingCode}
                style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: p.terracotta, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {loadingCode ? "Génération..." : "Afficher mon code de récupération"}
              </button>
            )}
          </div>

          <div style={{ fontSize: 11, color: p.textLight, fontFamily: "monospace", background: p.lin, padding: "8px 12px", borderRadius: 8, wordBreak: "break-all" }}>
            ID : {uuid || "—"}
          </div>
        </div>

        {/* Vie privée */}
        <div style={{ background: "#2C3E2D", borderRadius: 20, padding: "18px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#C8DBC9", marginBottom: 10 }}>🌿 Vie privée</div>
          {[
            "Aucune donnée personnelle collectée",
            "Aucune publicité, jamais",
            "L'IA génère des messages — elle ne stocke rien",
            "Données stockées localement sur ton appareil",
          ].map((item, i) => (
            <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", display: "flex", gap: 8, marginBottom: 6 }}>
              <span style={{ color: "#6B8F71" }}>✓</span><span>{item}</span>
            </div>
          ))}
        </div>

        {/* Version */}
        <div style={{ textAlign: "center", fontSize: 11, color: p.textLight, paddingTop: 8 }}>
          Alma v1.0 · Fait avec 🌿 par @liabra
        </div>
      </div>
    </div>
  );
}
