import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackupStore } from "../../store/useBackupStore";
import { disableBackup } from "../../lib/vaultSync";
import ActiverSauvegarde from "./ActiverSauvegarde";

const p = {
  terracotta: "#C4714A", terracottaL: "#D4876A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0", sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return null;
  }
}

export default function CarteSauvegarde() {
  const navigate = useNavigate();
  const enabled = useBackupStore(s => s.enabled);
  const lastSyncedAt = useBackupStore(s => s.lastSyncedAt);

  const [showActiver, setShowActiver] = useState(false);
  const [confirmerDesactiver, setConfirmerDesactiver] = useState(false);

  const dateLabel = formatDate(lastSyncedAt);

  return (
    <div style={{ background: p.white, borderRadius: 20, padding: "18px 20px", border: `1px solid ${p.linDark}` }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: p.text, marginBottom: 10 }}>☁️ Sauvegarde chiffrée</div>

      {!enabled && !showActiver && (
        <>
          <div style={{ fontSize: 12, color: p.textLight, lineHeight: 1.6, marginBottom: 12 }}>
            Par défaut, tes données restent uniquement sur ton téléphone. Tu peux activer une sauvegarde chiffrée de bout en bout : tes données sont chiffrées sur ton appareil avant d'être envoyées — personne d'autre que toi, pas même nous, ne peut les lire. Utile si tu changes de téléphone.
          </div>
          <button onClick={() => setShowActiver(true)}
            style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: p.terracotta, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Activer la sauvegarde chiffrée
          </button>
        </>
      )}

      {!enabled && showActiver && (
        <ActiverSauvegarde
          onCancel={() => setShowActiver(false)}
          onDone={() => setShowActiver(false)}
        />
      )}

      {enabled && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: p.sauge, marginBottom: 6 }}>
            ✓ Activée — chiffrée de bout en bout
          </div>
          <div style={{ fontSize: 12, color: p.textLight, marginBottom: 12 }}>
            {dateLabel ? `Dernière sauvegarde : ${dateLabel}` : "En attente de la première sauvegarde…"}
          </div>

          {!confirmerDesactiver ? (
            <button onClick={() => setConfirmerDesactiver(true)}
              style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1px solid ${p.linDark}`, background: "transparent", color: p.textLight, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Désactiver la sauvegarde
            </button>
          ) : (
            <div style={{ padding: "12px", background: p.lin, borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: p.text, lineHeight: 1.6, marginBottom: 10 }}>
                Désactiver arrête les sauvegardes et oublie ta clé sur cet appareil. Tes données locales restent intactes. Pour réactiver, il te faudra ta phrase.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setConfirmerDesactiver(false)}
                  style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: `1px solid ${p.linDark}`, background: "transparent", color: p.textLight, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Annuler
                </button>
                <button onClick={() => { disableBackup(); setConfirmerDesactiver(false); }}
                  style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", background: "#C04040", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Désactiver
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Lien restauration, dans tous les cas */}
      <button onClick={() => navigate("/recuperation")}
        style={{ display: "block", width: "100%", marginTop: 14, fontSize: 12, color: p.textLight, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline", textAlign: "center" }}>
        Restaurer depuis une phrase de récupération
      </button>
    </div>
  );
}
