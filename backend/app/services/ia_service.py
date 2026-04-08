import google.generativeai as genai
from app.core.config import settings
from typing import Optional

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def generer_encouragement(
    prenom_bebe: str,
    age_jours: int,
    nb_tetees: int,
    mode_alimentation: str,
    total_sommeil: str,
    mood_7j: list[int],
) -> str:
    """Génère un message d'encouragement personnalisé via Gemini Flash."""

    mood_moyen = sum(mood_7j) / len(mood_7j) if mood_7j else 2.5
    tone = "chaleureux et rassurant" if mood_moyen < 2 else "chaleureux et célébrant"

    prompt = f"""Tu es Alma, une application bienveillante pour les jeunes mamans.
Génère un message d'encouragement COURT (2-3 phrases maximum) pour une maman.

Contexte :
- Bébé prénommé {prenom_bebe}, âgé de {age_jours} jours
- Mode alimentation : {mode_alimentation}
- Tétées/biberons hier : {nb_tetees}
- Sommeil total bébé hier : {total_sommeil}
- Humeur maman sur 7 jours (0=difficile, 4=super) : {mood_7j}

Ton message doit :
- Être personnel, mentionner {prenom_bebe} et un fait concret d'hier
- Ton {tone}
- Être en français, tutoyant
- Terminer par une phrase d'encouragement sincère
- Ne JAMAIS donner de conseil médical
- Ne PAS mentionner que tu es une IA

Réponds UNIQUEMENT avec le message, sans guillemets ni introduction."""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return f"Tu es là pour {prenom_bebe} chaque jour, et ça compte énormément. Tu fais un travail remarquable."

def analyser_checkin(
    texte: Optional[str],
    mood: int,
    historique_moods: list[int],
) -> dict:
    """Analyse le check-in et retourne un score de vigilance."""
    if not texte and len(historique_moods) < 3:
        return {"score": mood / 4, "niveau": "ok", "message": None}

    prompt = f"""Analyse ce check-in d'une jeune maman de manière bienveillante.

Humeur du jour (0=difficile, 4=super) : {mood}
Texte libre : "{texte or 'rien écrit'}"
Historique 7 derniers jours : {historique_moods}

Réponds UNIQUEMENT en JSON avec ce format exact :
{{"score": 0.0_à_1.0, "niveau": "ok|vigilance|attention|alerte", "message": "message_court_ou_null"}}

- score 0 = très difficile, 1 = excellent
- niveau "alerte" seulement si plusieurs jours très difficiles + signes préoccupants dans le texte
- message : null si ok, sinon phrase courte et douce en français"""

    try:
        response = model.generate_content(prompt)
        import json, re
        json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except Exception:
        pass

    return {"score": mood / 4, "niveau": "ok", "message": None}
