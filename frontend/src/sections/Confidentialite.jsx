const p = {
  terracotta: "#C4714A", terracottaPale: "#F0D5C5",
  lin: "#F5EDE3", linDark: "#EDE0D0",
  sauge: "#6B8F71", saugePale: "#C8DBC9",
  text: "#2C2C2C", textLight: "#7A6E66", white: "#FFFAF6",
};

const SECTIONS = [
  {
    titre: "L'essentiel",
    corps: "Alma est conçue pour que tes données restent à toi. Pas de compte, pas d'email, pas de publicité, pas de traqueurs, pas de revente. Ce qui se passe sur ton téléphone reste sur ton téléphone.",
  },
  {
    titre: "Ce qui est stocké sur ton appareil",
    corps: "Tout : le profil de bébé, les tétées, couches, sommeil, pleurs, ton carnet de soins, tes notes et check-ins. Ces données sont enregistrées localement dans ton navigateur et ne sont transmises à personne.",
  },
  {
    titre: "La sauvegarde chiffrée (optionnelle)",
    corps: "Si tu actives la sauvegarde, tes données sont chiffrées SUR ton appareil (AES-256) avant d'être envoyées. Le serveur ne reçoit qu'un bloc illisible, sans nom, sans email, sans identifiant personnel. La clé de déchiffrement est ta phrase de 12 mots : toi seule la connais. Personne — pas même nous — ne peut lire tes données. Si tu perds ta phrase, tes données de sauvegarde sont définitivement irrécupérables.",
  },
  {
    titre: "Ce que le serveur conserve",
    corps: "Uniquement : le bloc chiffré de ta sauvegarde et une empreinte technique (hash) de ton jeton d'accès. Aucune adresse IP n'est conservée dans notre base de données, aucun profil, aucune statistique individuelle. Comme tout hébergeur, notre prestataire peut journaliser temporairement des données techniques de connexion.",
  },
  {
    titre: "Tes droits (RGPD)",
    corps: (
      <>
        Tu peux à tout moment : consulter tes données (elles sont sur ton appareil), les supprimer
        (désactive la sauvegarde puis efface les données du site dans ton navigateur — ou supprime
        l'app), ou nous contacter pour toute question :{" "}
        <a href="mailto:lia.balagnaranin@gmail.com" style={{ color: p.terracotta, fontWeight: 600 }}>
          lia.balagnaranin@gmail.com
        </a>
        . Quand tu désactives la sauvegarde depuis ton profil, ta sauvegarde chiffrée est
        supprimée du serveur.
      </>
    ),
  },
  {
    titre: "Hébergement",
    corps: "L'application et les sauvegardes chiffrées sont hébergées par Railway, sur des serveurs situés dans l'Union européenne (région EU West).",
  },
];

export default function Confidentialite() {
  const retour = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };

  return (
    <div style={{ minHeight: "100vh", background: p.lin, maxWidth: 390, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "52px 24px 18px", background: p.white, borderBottom: `1px solid ${p.linDark}`, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={retour}
          style={{ background: p.linDark, border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: p.text, cursor: "pointer" }}>
          ← Retour
        </button>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: p.text }}>🔒 Confidentialité & données</span>
      </div>

      <div style={{ padding: "18px 18px 60px", display: "flex", flexDirection: "column", gap: 12 }}>
        {SECTIONS.map((s) => (
          <div key={s.titre} style={{ background: p.white, borderRadius: 16, padding: "16px 18px", border: `1px solid ${p.linDark}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: p.text, marginBottom: 8 }}>{s.titre}</div>
            <div style={{ fontSize: 13, color: p.textLight, lineHeight: 1.6 }}>{s.corps}</div>
          </div>
        ))}

        <div style={{ fontSize: 11, color: p.textLight, textAlign: "center", fontStyle: "italic", lineHeight: 1.5, padding: "6px 8px" }}>
          Dernière mise à jour : juillet 2026. Cette page évoluera si Alma évolue — jamais en douce.
        </div>
      </div>
    </div>
  );
}
