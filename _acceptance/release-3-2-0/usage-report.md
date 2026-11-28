### S4 round 1 — wf_3fac232d-57a — wf_3fac232d-57a (27 agent, 202,072 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E8:domain-correctness | claude-sonnet-5-5 | 11 | 32,630 | 22 | 1,276,515 | 225 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 12 | 28,806 | 24 | 1,462,605 | 205 |
| review:measurement | claude-fable-5-2 | 18 | 26,445 | 36 | 1,539,369 | 306 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 16 | 22,678 | 32 | 1,858,488 | 163 |
| review:conventions | claude-fable-5-2 | 17 | 19,037 | 36 | 1,589,140 | 224 |
| review:bugs | claude-fable-5-2 | 21 | 18,990 | 42 | 1,924,484 | 232 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,918 | 6 | 46,633 | 540 |
| synthesize:report | claude-sonnet-5-5 | 3 | 9,728 | 6 | 121,446 | 58 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,325 | 14 | 215,282 | 985 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,674 | 14 | 215,770 | 912 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,505 | 12 | 171,058 | 823 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,489 | 6 | 83,355 | 27 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 2,135 | 6 | 83,473 | 109 |
| triage | claude-sonnet-5-5 | 2 | 1,980 | 4 | 40,060 | 16 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,529 | 4 | 38,226 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,135 | 4 | 38,235 | 243 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,017 | 4 | 38,226 | 105 |
| machine:bash _acceptance/release-3-2-0/chay.sh g | claude-haiku-5-5 | 2 | 1,011 | 4 | 38,243 | 8 |
| machine:bash _acceptance/release-3-2-0/chay.sh c | claude-haiku-5-5 | 2 | 810 | 4 | 38,241 | 7 |
| machine:bash _acceptance/release-3-2-0/chay.sh d | claude-haiku-5-5 | 2 | 642 | 4 | 38,242 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 610 | 4 | 34,785 | 180 |
| machine:bash _acceptance/release-3-2-0/chay.sh l | claude-haiku-5-5 | 2 | 560 | 4 | 38,242 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 559 | 4 | 38,282 | 113 |
| machine:bash _acceptance/release-3-2-0/chay.sh g | claude-haiku-5-5 | 2 | 527 | 4 | 38,242 | 6 |
| machine:bash _acceptance/release-3-2-0/chay.sh k | claude-haiku-5-5 | 2 | 509 | 4 | 38,243 | 6 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 476 | 4 | 38,242 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 347 | 4 | 33,492 | 5 |


wall: 3596s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| judge | 3 | 84,114 | 4,597,608 | 225 | 08:36:46 | 08:40:30 |
| review | 3 | 64,472 | 5,052,993 | 314 | 08:36:46 | 08:41:59 |
| baseline | 1 | 11,918 | 46,633 | 540 | 08:36:46 | 08:45:46 |
| machine | 17 | 29,513 | 1,224,387 | 3517 | 08:36:46 | 09:35:23 |
| triage | 1 | 1,980 | 40,060 | 16 | 09:35:23 | 09:35:38 |
| capture | 1 | 347 | 33,492 | 5 | 09:35:39 | 09:35:44 |
| synthesize | 1 | 9,728 | 121,446 | 58 | 09:35:44 | 09:36:42 |

- **claude-sonnet-5-5**: 7 agent · 49 calls · out 108,087 · in 98 · cache_read 4,839,239 · cache_create 913,383
- **claude-fable-5-2**: 3 agent · 56 calls · out 64,472 · in 114 · cache_read 5,052,993 · cache_create 365,585
- **claude-haiku-5-5**: 17 agent · 50 calls · out 29,513 · in 100 · cache_read 1,224,387 · cache_create 768,602

