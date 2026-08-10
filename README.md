# Streak Hound

A streak-based dog breed quiz. You're shown a breed and four candidate attributes —
origin, breed group, size class, coat type, adult weight, lifespan, or a signature trait.
One is correct; the other three are real attributes that belong to *different* breeds.
Get it right and your streak grows. Get it wrong and it resets to zero.

Difficulty scales with your streak across five tiers:

| Streak | Tier | Subject | Attributes asked |
| --- | --- | --- | --- |
| 0–2 | Starter | Household-name breeds only | Size, trait |
| 3–7 | Easy | Any breed | Size, trait, group, origin |
| 8–14 | Medium | Any breed | All seven |
| 15–23 | Hard | Any breed | All seven |
| 24+ | Brutal | Any breed | All seven |

Starter is deliberately gentle in the one way that matters most: it draws its subject
from ~58 breeds a casual player will recognize. No arrangement of decoys makes a question
about a Cirneco dell'Etna easy, and the quiz is text-only — there is no photo to reason
from — so familiarity with the *name* is the real difficulty lever. It asks only about
size and signature trait, both answerable from having seen the dog: everyone knows a
Great Dane is Giant. Breed group is held back because it needs kennel-club knowledge,
and origin because it hides traps — the Standard Poodle is German and the Australian
Shepherd is American, which is no way to end a beginner's first streak.

From there decoys close in. Early ones come from very different dogs (a Chihuahua against
Giant); by Brutal they are pulled from breeds sharing the same group, size and region, so
a Norfolk Terrier's drop ears sit next to a Norwich Terrier's prick ears.

Weight and lifespan are ranges, and two ranges that share any value make a question with
no clean answer, so all four numeric options are kept fully disjoint. One consequence:
about a third of the breeds cannot field three non-overlapping lifespan alternatives —
a Standard Poodle at 10–18 years leaves almost nothing outside it — so those breeds are
simply asked about something else. Lifespan is therefore the rarest category.
