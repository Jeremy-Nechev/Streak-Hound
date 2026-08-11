/* Streak Hound — dog breed attribute quiz.
 * One breed per question, four attribute options, three of which belong to other breeds.
 * A wrong answer resets the streak to zero.
 */
(function () {
  "use strict";

  var BREEDS = window.BREEDS;

  // ---------------------------------------------------------------- constants

  var SIZE_ORDER = ["Toy", "Small", "Medium", "Large", "Giant"];

  // Rough geographic clustering, used to judge how "close" two origins feel.
  var REGION = {
    "England": "brit", "Scotland": "brit", "Wales": "brit", "Ireland": "brit",
    "France": "weur", "Belgium": "weur", "Netherlands": "weur", "Germany": "weur",
    "Switzerland": "weur", "Italy": "weur", "Spain": "weur", "Portugal": "weur", "Malta": "weur",
    "Hungary": "eeur", "Czech Republic": "eeur", "Croatia": "eeur", "Russia": "eeur",
    "Norway": "nord", "Sweden": "nord", "Finland": "nord", "Iceland": "nord",
    "United States": "namer", "Canada": "namer", "Mexico": "namer",
    "Peru": "samer",
    "China": "easia", "Japan": "easia", "South Korea": "easia", "Tibet": "easia", "Thailand": "easia",
    "Turkey": "wasia", "Israel": "wasia", "Iran": "wasia", "Afghanistan": "wasia",
    "Morocco": "afr", "Mali": "afr", "Zimbabwe": "afr", "Madagascar": "afr",
    "Democratic Republic of the Congo": "afr",
    "Australia": "oce", "Cuba": "namer"
  };

  var CATEGORIES = [
    {
      key: "o",
      label: "origin",
      ask: function (b) { return "Where was the " + b.n + " developed?"; },
      fmt: function (v) { return v; },
      reveal: function (b) { return "The " + b.n + " was developed in " + b.o + "."; },
      // 0 = very different, 1 = nearly identical
      near: function (a, b) {
        if (a === b) return 1;
        return REGION[a] && REGION[a] === REGION[b] ? 0.75 : 0.1;
      }
    },
    {
      key: "g",
      label: "breed group",
      ask: function (b) { return "Which group does the " + b.n + " belong to?"; },
      fmt: function (v) { return v + " group"; },
      reveal: function (b) { return "The " + b.n + " is in the " + b.g + " group."; },
      near: function (a, b) { return a === b ? 1 : 0.2; }
    },
    {
      key: "s",
      label: "size class",
      ask: function (b) { return "What size class is the " + b.n + "?"; },
      fmt: function (v) { return v; },
      reveal: function (b) { return "The " + b.n + " is a " + b.s + " breed."; },
      near: function (a, b) {
        var d = Math.abs(SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
        return 1 - d / (SIZE_ORDER.length - 1);
      }
    },
    {
      key: "c",
      label: "coat type",
      ask: function (b) { return "What kind of coat does the " + b.n + " have?"; },
      fmt: function (v) { return v; },
      reveal: function (b) { return "The " + b.n + "’s coat is " + lower(b.c) + "."; },
      near: function (a, b) { return tokenOverlap(a, b); }
    },
    {
      key: "w",
      label: "adult weight",
      ask: function (b) { return "What is the typical adult weight of the " + b.n + "?"; },
      fmt: function (v) { return v[0] + "–" + v[1] + " lb"; },
      reveal: function (b) { return "The " + b.n + " typically weighs " + b.w[0] + "–" + b.w[1] + " lb."; },
      near: function (a, b) {
        var am = (a[0] + a[1]) / 2, bm = (b[0] + b[1]) / 2;
        return 1 - Math.min(1, Math.abs(am - bm) / 90);
      }
    },
    {
      key: "l",
      label: "lifespan",
      ask: function (b) { return "What is the typical lifespan of the " + b.n + "?"; },
      fmt: function (v) { return v[0] + "–" + v[1] + " years"; },
      reveal: function (b) { return "The " + b.n + " typically lives " + b.l[0] + "–" + b.l[1] + " years."; },
      near: function (a, b) {
        var am = (a[0] + a[1]) / 2, bm = (b[0] + b[1]) / 2;
        return 1 - Math.min(1, Math.abs(am - bm) / 7);
      }
    },
    {
      key: "t",
      label: "signature trait",
      ask: function (b) { return "Which trait belongs to the " + b.n + "?"; },
      fmt: function (v) { return v; },
      reveal: function (b) { return "The real trait of the " + b.n + ": " + b.t + "."; },
      near: function (a, b) { return tokenOverlap(a, b); }
    }
  ];

  // Lowercase a leading word only when it is not a proper noun we care about.
  function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  var STOP = { "and": 1, "the": 1, "with": 1, "a": 1, "of": 1, "over": 1, "in": 1, "on": 1, "its": 1, "that": 1, "for": 1, "an": 1 };

  function tokenOverlap(a, b) {
    var A = tokens(a), B = tokens(b), hit = 0, i;
    if (!A.length || !B.length) return 0;
    for (i = 0; i < A.length; i++) if (B.indexOf(A[i]) !== -1) hit++;
    return hit / Math.max(A.length, B.length);
  }

  function tokens(s) {
    return String(s).toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/)
      .filter(function (w) { return w.length > 2 && !STOP[w]; });
  }

  // ------------------------------------------------------------------- helpers

  function sameValue(cat, a, b) {
    if (cat.key === "w" || cat.key === "l") return a[0] === b[0] && a[1] === b[1];
    return a === b;
  }

  // Inclusive ranges: [12,16] and [16,18] overlap, [12,16] and [17,18] do not.
  function overlaps(a, b) { return a[0] <= b[1] && b[0] <= a[1]; }

  function clashes(val, chosen) {
    for (var i = 0; i < chosen.length; i++) {
      if (overlaps(val, chosen[i].value)) return true;
    }
    return false;
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // How alike two breeds are overall — drives how cruel the distractors feel.
  function breedAffinity(a, b) {
    var score = 0;
    if (a.g === b.g) score += 2;
    if (a.s === b.s) score += 1.5;
    if (REGION[a.o] === REGION[b.o]) score += 1;
    if (a.o === b.o) score += 1;
    score += tokenOverlap(a.c, b.c) * 1.5;
    return score;
  }

  // -------------------------------------------------------------- question gen

  /* max      — the similarity the decoys aim for; 0 means as unlike the truth as possible
   * affinity — whether decoys should come from similar or dissimilar breeds
   * mix      — relative odds of drawing a household / known / specialist subject
   * cats     — restrict the question to these attributes, if any can be built
   *
   * The subject mix matters more than the decoys. A question is only as easy as the
   * dog it names, so the household band dominates early and the long tail only
   * really appears once a player has proved they can handle it.
   *
   * Categories phase in by how answerable they are without kennel-club knowledge:
   * size and trait can be reasoned out from having seen the dog, weight nearly so.
   * Origin hides traps (the Standard Poodle is German, the Australian Shepherd
   * American). Group is pure convention. Lifespan is the coin-flip — every breed
   * lives 10-to-15 years — so it waits until Hard.
   */
  var TIERS = [
    { name: "Starter", max: 0.00, affinity: "far", mix: [1, 0, 0], cats: ["s", "t"], hints: true },
    { name: "Easy", max: 0.10, affinity: "far", mix: [8, 1, 0], cats: ["s", "t", "w"], hints: true },
    { name: "Medium", max: 0.28, affinity: "mid", mix: [6, 3, 0], cats: ["s", "t", "w", "o"], hints: true },
    { name: "Hard", max: 0.55, affinity: "near", mix: [3, 3, 1] },
    { name: "Brutal", max: 1.01, affinity: "near", mix: [1, 2, 2] }
  ];

  var HINTS = window.BREED_HINTS || {};

  // BANDS[0] household, [1] known, [2] everything else.
  var BANDS = [[], [], []];
  (function () {
    var fam = window.BREED_FAMILIARITY || {};
    var rank = {};
    (fam.household || []).forEach(function (n) { rank[n] = 0; });
    (fam.known || []).forEach(function (n) { if (rank[n] === undefined) rank[n] = 1; });
    BREEDS.forEach(function (b) {
      BANDS[rank[b.n] === undefined ? 2 : rank[b.n]].push(b);
    });
    // A misspelt name would silently shrink the easy pool, so say so loudly.
    var known = {};
    BREEDS.forEach(function (b) { known[b.n] = 1; });
    var bad = [].concat(fam.household || [], fam.known || []).filter(function (n) { return !known[n]; });
    if (bad.length && window.console) console.warn("Unknown breed names in BREED_FAMILIARITY:", bad);
  })();

  function tierForStreak(streak) {
    if (streak < 5) return 0;
    if (streak < 12) return 1;
    if (streak < 20) return 2;
    if (streak < 30) return 3;
    // Past 30, mostly brutal with the odd breather.
    return Math.random() < 0.75 ? 4 : 3;
  }

  // Draw a subject from the tier's familiarity mix, skipping bands that are empty.
  function pickSubject(tier) {
    var mix = tier.mix, total = 0, i;
    for (i = 0; i < BANDS.length; i++) if (BANDS[i].length) total += mix[i];
    if (!total) return pick(BREEDS);
    var r = Math.random() * total;
    for (i = 0; i < BANDS.length; i++) {
      if (!BANDS[i].length || !mix[i]) continue;
      r -= mix[i];
      if (r <= 0) return pick(BANDS[i]);
    }
    return pick(BANDS[0].length ? BANDS[0] : BREEDS);
  }

  var recentBreeds = [];

  function nextQuestion(streak) {
    var tierIdx = tierForStreak(streak);
    var tier = TIERS[tierIdx];

    var subject = pickSubject(tier);
    var guard = 0;
    while (recentBreeds.indexOf(subject.n) !== -1 && guard++ < 40) subject = pickSubject(tier);
    recentBreeds.push(subject.n);
    // Held short enough that the household band, the smallest one in play, never
    // runs out of unseen breeds.
    if (recentBreeds.length > 15) recentBreeds.shift();

    // Prefer a category that actually has usable distractors, and honour the tier's
    // shortlist first — falling through to the rest only if none of them can build.
    var cats = shuffle(CATEGORIES.slice());
    if (tier.cats) {
      var wanted = [], others = [];
      cats.forEach(function (c) {
        (tier.cats.indexOf(c.key) === -1 ? others : wanted).push(c);
      });
      cats = wanted.concat(others);
    }
    var chosen = null;
    for (var i = 0; i < cats.length && !chosen; i++) {
      var built = buildOptions(subject, cats[i], tier);
      if (built) chosen = { cat: cats[i], options: built };
    }
    if (!chosen) return nextQuestion(streak); // vanishingly unlikely

    return {
      breed: subject,
      category: chosen.cat,
      options: chosen.options,
      tier: tier.name,
      tierIndex: tierIdx,
      hint: tier.hints ? hintFor(subject, chosen.cat) : null
    };
  }

  // A hint that happens to contain the answer defeats the question, so withhold it
  // rather than hand it over. Only origin realistically collides — a hint may well
  // name the country — but the check is cheap enough to apply across the board.
  function hintFor(subject, cat) {
    var text = HINTS[subject.n];
    if (!text) return null;
    var answer = String(cat.fmt(subject[cat.key]));
    return text.toLowerCase().indexOf(answer.toLowerCase()) === -1 ? text : null;
  }

  function buildOptions(subject, cat, tier) {
    var correct = subject[cat.key];

    // Weight and lifespan are ranges. Two ranges that share any value make for an
    // ambiguous question — "12–16 years" against "13–16 years" has no clean answer —
    // so every numeric option must be fully disjoint from every other.
    var numeric = cat.key === "w" || cat.key === "l";

    // Candidate pool: values from other breeds that genuinely differ.
    var pool = [];
    var seen = [];
    for (var i = 0; i < BREEDS.length; i++) {
      var other = BREEDS[i];
      if (other === subject) continue;
      var val = other[cat.key];
      if (sameValue(cat, val, correct)) continue;
      if (numeric && overlaps(val, correct)) continue;

      var label = cat.fmt(val);
      if (seen.indexOf(label) !== -1) continue;
      seen.push(label);

      pool.push({
        value: val,
        label: label,
        owner: other,
        near: cat.near(correct, val),          // similarity of the value itself
        affinity: breedAffinity(subject, other) // similarity of the source breed
      });
    }
    if (pool.length < 3) return null;

    // Difficulty = how close the decoys sit to the truth.
    var wantNear = tier.max;
    pool.sort(function (a, b) {
      var sa = Math.abs(a.near - wantNear) - (tier.affinity === "near" ? a.affinity * 0.04 : 0)
        + (tier.affinity === "far" ? a.affinity * 0.04 : 0);
      var sb = Math.abs(b.near - wantNear) - (tier.affinity === "near" ? b.affinity * 0.04 : 0)
        + (tier.affinity === "far" ? b.affinity * 0.04 : 0);
      return sa - sb;
    });

    // Sample from a window near the front so repeats don't feel canned, then fall
    // back down the sorted tail if the disjoint rule rejects too much of the window.
    // The window has to stay a fraction of the pool: size offers only four possible
    // decoys, and shuffling all of them would throw the difficulty ordering away.
    var head = pool.slice(0, Math.max(3, Math.min(pool.length, Math.ceil(pool.length * 0.4), 14)));
    shuffle(head);
    var ordered = head.concat(pool.slice(head.length));

    var decoys = [];
    for (i = 0; i < ordered.length && decoys.length < 3; i++) {
      if (numeric && clashes(ordered[i].value, decoys)) continue;
      decoys.push(ordered[i]);
    }
    if (decoys.length < 3) return null;

    var options = decoys.map(function (d) {
      return { label: d.label, correct: false, owner: d.owner };
    });
    options.push({ label: cat.fmt(correct), correct: true, owner: subject });
    return shuffle(options);
  }

  // ------------------------------------------------------------------- game UI

  var el = {
    intro: document.getElementById("intro"),
    game: document.getElementById("game"),
    start: document.getElementById("start"),
    breed: document.getElementById("breed"),
    prompt: document.getElementById("prompt"),
    options: document.getElementById("options"),
    feedback: document.getElementById("feedback"),
    next: document.getElementById("next"),
    streak: document.getElementById("streak"),
    best: document.getElementById("best"),
    answered: document.getElementById("answered"),
    hint: document.getElementById("hint"),
    hintToggle: document.getElementById("hint-toggle"),
    hintText: document.getElementById("hint-text"),
    tier: document.getElementById("tier"),
    count: document.getElementById("breed-count")
  };

  var state = {
    streak: 0,
    best: Number(localStorage.getItem("streakhound.best") || 0),
    asked: 0,
    current: null,
    locked: false
  };

  function paintStats() {
    el.streak.textContent = state.streak;
    el.best.textContent = state.best;
    el.answered.textContent = state.asked;
  }

  function render() {
    state.current = nextQuestion(state.streak);
    state.locked = false;

    var q = state.current;
    el.breed.textContent = q.breed.n;
    el.prompt.textContent = q.category.ask(q.breed);
    el.tier.textContent = q.tier;
    el.tier.className = "tier tier-" + q.tierIndex;

    el.feedback.className = "feedback";
    el.feedback.innerHTML = "";
    el.next.hidden = true;

    el.options.innerHTML = "";
    q.options.forEach(function (opt, i) {
      var b = document.createElement("button");
      b.className = "option";
      b.type = "button";
      b.innerHTML = '<span class="key">' + "ABCD"[i] + '</span><span class="text"></span>';
      b.querySelector(".text").textContent = opt.label;
      b.addEventListener("click", function () { answer(opt, b); });
      el.options.appendChild(b);
    });

    paintHint(q);
    paintStats();
  }

  // Offered on the gentler tiers only. Past Medium, knowing the breed is the game.
  function paintHint(q) {
    var text = q.hint;
    el.hint.hidden = !text;
    el.hintText.hidden = true;
    el.hintText.textContent = text || "";
    el.hintToggle.setAttribute("aria-expanded", "false");
    el.hintToggle.textContent = "Don’t know this breed?";
  }

  function toggleHint() {
    if (el.hint.hidden) return;
    var show = el.hintText.hidden;
    el.hintText.hidden = !show;
    el.hintToggle.setAttribute("aria-expanded", show ? "true" : "false");
    el.hintToggle.textContent = show ? "Hide hint" : "Don’t know this breed?";
  }

  function answer(opt, button) {
    if (state.locked) return;
    state.locked = true;
    state.asked++;

    var q = state.current;
    var buttons = Array.prototype.slice.call(el.options.children);
    buttons.forEach(function (b, i) {
      b.disabled = true;
      if (q.options[i].correct) b.classList.add("right");
    });

    if (opt.correct) {
      state.streak++;
      if (state.streak > state.best) {
        state.best = state.streak;
        localStorage.setItem("streakhound.best", String(state.best));
      }
      el.feedback.className = "feedback good";
      el.feedback.innerHTML = "<strong>Correct.</strong> " + escapeHtml(q.breed.n) + " — " +
        escapeHtml(q.breed.t) + ".";
    } else {
      button.classList.add("wrong");
      el.feedback.className = "feedback bad";
      var lost = state.streak;
      el.feedback.innerHTML = "<strong>Wrong.</strong> “" + escapeHtml(opt.label) + "” is the " +
        escapeHtml(q.category.label) + " of the <em>" + escapeHtml(opt.owner.n) + "</em>. " +
        escapeHtml(q.category.reveal(q.breed)) +
        (lost > 0 ? " <strong>Streak of " + lost + " lost.</strong>" : "");
      state.streak = 0;
    }

    paintStats();
    el.next.hidden = false;
    el.next.focus();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // ----------------------------------------------------------------- listeners

  el.start.addEventListener("click", function () {
    el.intro.hidden = true;
    el.game.hidden = false;
    render();
  });

  el.next.addEventListener("click", render);

  el.hintToggle.addEventListener("click", toggleHint);

  document.addEventListener("keydown", function (e) {
    if (el.game.hidden) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.start.click(); }
      return;
    }
    var k = e.key.toLowerCase();
    if (k === "h") { e.preventDefault(); toggleHint(); return; }
    if (!state.locked) {
      var idx = ["a", "b", "c", "d"].indexOf(k);
      if (idx === -1) idx = ["1", "2", "3", "4"].indexOf(k);
      if (idx !== -1 && el.options.children[idx]) {
        e.preventDefault();
        el.options.children[idx].click();
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      render();
    }
  });

  el.count.textContent = BREEDS.length;
  el.best.textContent = state.best;
})();
