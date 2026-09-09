# DAMAGE ENGINE v1

The quiz does not map answers directly to playlists. Each answer modifies an emotional vector; the resulting profile is matched against the 125-case database.

## Axes (0–100)
energy · melancholy · aggression · sensuality · absurdity · introspection · cinematicity · escape · sociality

## Damage families
- SOFT COLLAPSE — vulnerability, loss, comfort and quiet emotional failure.
- CONTROLLED RAGE — catharsis, frustration, confrontation and managed sonic violence.
- GLAMOROUS BAD DECISIONS — desire, excess, risk, attitude and aesthetically poor judgement.
- COSMIC MALFUNCTION — psychedelia, strangeness, dissociation and reality drift.
- PUNISHMENT AS SELF-CARE — effort, discipline and voluntary suffering disguised as wellbeing.
- CINEMATIC ESCAPE — roads, landscapes, narrative, transcendence and getting out of here.
- FUNCTIONAL INSANITY — focus, productivity, obsession and somehow continuing to operate.
- ABSURD JOY — nonsense, camp, humour and pleasure without a defensible explanation.

## Matching
MVP uses Euclidean distance across all nine axes. The nearest eligible cases become recommended treatments.

## MAKE IT WORSE
Detect the three dimensions furthest from neutral and push them further in the same direction before re-running recommendations. Intentional escalation, not random replacement.

## Classification caveat
v1 classifications are based on playlist title and description, not a track-by-track audit. Confidence, review_note and quiz_eligible are retained for later refinement.
