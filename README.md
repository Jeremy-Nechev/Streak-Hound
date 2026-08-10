# Streak Hound

A streak-based dog breed quiz. You're shown a breed and four candidate attributes —
origin, breed group, size class, coat type, adult weight, lifespan, or a signature trait.
One is correct; the other three are real attributes that belong to *different* breeds.
Get it right and your streak grows. Get it wrong and it resets to zero.

Difficulty scales with your streak across five tiers:

| Streak | Tier | Subject breeds (measured) | Attributes asked |
| --- | --- | --- | --- |
| 0–2 | Starter | 100% household | Size, trait |
| 3–7 | Easy | 81% household, 19% known | + weight |
| 8–14 | Medium | 52% household, 48% known | + origin, coat |
| 15–23 | Hard | 34% / 48% / 18% specialist | all seven |
| 24+ | Brutal | 21% / 40% / 40% specialist | all seven |

The subject breed matters more than the decoys: a question is only as easy as the dog it
names. The quiz is text-only — there is no photo to reason from — so recognizing the
*name* is the strongest difficulty lever available, and no arrangement of decoys makes a
question about a Cirneco dell'Etna gentle. Breeds are banded into `household` (52 names a
non-dog-person knows unprompted), `known` (86 more), and everything else as specialist
knowledge. Specialist breeds never appear before a streak of 15.

Attributes phase in by how answerable they are without kennel-club knowledge. Size and
trait can be reasoned out from having seen the dog, and weight nearly so. Origin waits
because it hides traps — the Standard Poodle is German and the Australian Shepherd
American. Group is pure convention. Lifespan is close to a coin flip, since almost every
breed lives 10-to-15 years, so it does not appear until Hard.

Decoys tighten on top of that. Early ones come from very different dogs (a Chihuahua
against Giant); by Brutal they are pulled from breeds sharing the same group, size and
region, so a Norfolk Terrier's drop ears sit next to a Norwich Terrier's prick ears.

Where the dataset holds close relatives — the three Poodle varieties, the two Cocker
Spaniels, the two Corgis — the attributes they genuinely share are recorded as identical
values, which is what stops the engine from ever offering one twin's attribute as a decoy
against the other. They differ only where the distinction is real and checkable: the
Cardigan Corgi's long tail against the Pembroke's bobtail.

Weight and lifespan are ranges, and two ranges that share any value make a question with
no clean answer, so all four numeric options are kept fully disjoint. One consequence:
about a third of the breeds cannot field three non-overlapping lifespan alternatives —
a Standard Poodle at 10–18 years leaves almost nothing outside it — so those breeds are
simply asked about something else. Lifespan is therefore the rarest category.
