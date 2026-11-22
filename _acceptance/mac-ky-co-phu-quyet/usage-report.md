### S4 round 1 — wf_113abce0-d77 (28 agent, 99,115 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 18 | 20,260 | 36 | 1,230,915 | 295 |
| review:conventions | claude-opus-5-5 | 28 | 20,257 | 56 | 2,837,943 | 252 |
| review:measurement | claude-opus-5-5 | 14 | 14,387 | 28 | 889,026 | 165 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,095 | 4 | 45,640 | 58 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 8,186 | 6 | 70,682 | 45 |
| triage | claude-sonnet-5-5 | 2 | 5,077 | 4 | 29,260 | 34 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,758 | 10 | 84,273 | 830 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 2,841 | 4 | 3,381 | 554 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,879 | 4 | 25,595 | 93 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 1,860 | 8 | 57,963 | 752 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 966 | 4 | 22,223 | 154 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 713 | 4 | 25,651 | 110 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 646 | 4 | 25,595 | 10 |
| machine:env TLQ_CASES=AC-3 node tests/scripts/tr | claude-haiku-5-5 | 2 | 641 | 4 | 25,630 | 10 |
| machine:env TLQ_CASES=AC-6 node tests/scripts/tr | claude-haiku-5-5 | 2 | 634 | 4 | 25,630 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 614 | 4 | 25,651 | 80 |
| machine:env TLQ_CASES=AC-5 node tests/scripts/tr | claude-haiku-5-5 | 2 | 614 | 4 | 25,630 | 9 |
| machine:env TLQ_CASES=AC-8 node tests/scripts/tr | claude-haiku-5-5 | 2 | 593 | 4 | 25,630 | 8 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 587 | 4 | 25,621 | 6 |
| machine:env TLQ_CASES=AC-1 node tests/scripts/tr | claude-haiku-5-5 | 2 | 581 | 4 | 25,630 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 579 | 4 | 25,651 | 77 |
| machine:env TLQ_CASES=AC-9 node tests/scripts/tr | claude-haiku-5-5 | 2 | 556 | 4 | 25,630 | 8 |
| machine:env TLQ_CASES=AC-7 node tests/scripts/tr | claude-haiku-5-5 | 2 | 510 | 4 | 25,630 | 7 |
| machine:env TLQ_CASES=AC-4 node tests/scripts/tr | claude-haiku-5-5 | 2 | 508 | 4 | 25,630 | 8 |
| machine:env TLQ_CASES=AC-2 node tests/scripts/tr | claude-haiku-5-5 | 2 | 502 | 4 | 25,630 | 8 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 474 | 4 | 25,611 | 6 |
| machine:env TLQ_CASES=AC-10 node tests/scripts/t | claude-haiku-5-5 | 2 | 466 | 4 | 25,629 | 8 |
| capture:provenance | claude-sonnet-5-5 | 2 | 331 | 4 | 20,957 | 5 |


wall: 2771s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 8,186 | 70,682 | 45 | 05:20:04 | 05:20:49 |
| machine | 21 | 20,522 | 603,514 | 2674 | 05:20:04 | 06:04:38 |
| review | 3 | 54,904 | 4,957,884 | 298 | 05:20:13 | 05:25:11 |
| triage | 1 | 5,077 | 29,260 | 34 | 06:04:38 | 06:05:12 |
| capture | 1 | 331 | 20,957 | 5 | 06:05:12 | 06:05:17 |
| synthesize | 1 | 10,095 | 45,640 | 58 | 06:05:17 | 06:06:15 |

- **claude-opus-5-5**: 3 agent · 60 calls · out 54,904 · in 120 · cache_read 4,957,884 · cache_create 337,248
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 23,689 · in 18 · cache_read 166,539 · cache_create 157,730
- **claude-haiku-5-5**: 21 agent · 47 calls · out 20,522 · in 94 · cache_read 603,514 · cache_create 530,298

