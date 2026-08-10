# Streak Hound

A streak-based dog breed quiz. You're shown a breed and four candidate attributes —
origin, breed group, size class, coat type, adult weight, lifespan, or a signature trait.
One is correct; the other three are real attributes that belong to *different* breeds.
Get it right and your streak grows. Get it wrong and it resets to zero.

Difficulty scales with your streak. Early questions pair a breed with decoys drawn from
very different dogs (a Chihuahua against Giant); later ones pull decoys from breeds that
share the same group, size and region, so a Norfolk Terrier's drop ears sit next to a
Norwich Terrier's prick ears.

The opening tier (streaks 0–5) is deliberately gentle: it only asks about origin, breed
group, size class and signature trait — the concrete, few-valued attributes — and never
about coat texture, weight or lifespan. Its origin decoys always come from a different
part of the world.

Weight and lifespan are ranges, and two ranges that share any value make a question with
no clean answer, so all four numeric options are kept fully disjoint. One consequence:
about a third of the breeds cannot field three non-overlapping lifespan alternatives —
a Standard Poodle at 10–18 years leaves almost nothing outside it — so those breeds are
simply asked about something else. Lifespan is therefore the rarest category.
