# Streak Hound

A streak-based dog breed quiz. You're shown a breed and four candidate attributes —
origin, breed group, size class, coat type, adult weight, lifespan, or a signature trait.
One is correct; the other three are real attributes that belong to *different* breeds.
Get it right and your streak grows. Get it wrong and it resets to zero.

Difficulty scales with your streak across five tiers:

| Streak | Tier | Subject breeds (measured) | Attributes asked | Hints |
| --- | --- | --- | --- | --- |
| 0–4 | Starter | 100% household | Size, trait | yes |
| 5–11 | Easy | 86% household, 14% known | + weight | yes |
| 12–19 | Medium | 62% household, 38% known | + origin | yes |
| 20–29 | Hard | 39% / 45% / 16% specialist | + coat, group, lifespan | no |
| 30+ | Brutal | 21% / 39% / 39% specialist | all seven | no |

Up to Medium, a **Don't know this breed?** toggle sits under the options (or press
<kbd>H</kbd>) and gives a one-line note on what the dog actually is — role, history,
reputation — for the 138 breeds those tiers can ask about. The notes deliberately avoid
physical description, since mentioning the coat or the signature trait would hand over the
answer they exist to help you reason toward. A hint is withheld outright if it happens to
contain the answer, which in practice only affects origin questions on the handful of
breeds whose hint names their country — there is no way to hint at the Havanese without
saying Cuba. Past Medium there are no hints: knowing the breed is the game.

The subject breed matters more than the decoys: a question is only as easy as the dog it
names. The quiz is text-only — there is no photo to reason from — so recognizing the
*name* is the strongest difficulty lever available, and no arrangement of decoys makes a
question about a Cirneco dell'Etna gentle. Breeds are banded into `household` (52 names a
non-dog-person knows unprompted), `known` (86 more), and everything else as specialist
knowledge. Specialist breeds never appear before a streak of 15.

Attributes phase in by how answerable they are without kennel-club knowledge. Size and
trait can be reasoned out from having seen the dog, and weight nearly so. Origin waits
because it hides traps — the Standard Poodle is German and the Australian Shepherd
American. Coat is the fuzziest of the seven, since "Medium & silky feathered" against
"Long & flowing silky" is a fine distinction rather than a clean fact. Group is pure
convention, and lifespan is close to a coin flip because almost every breed lives
10-to-15 years. Those last three wait until Hard.

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
