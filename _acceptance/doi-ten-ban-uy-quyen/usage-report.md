### S4 round 1 — wf_60a8dd0f-f3e (28 agent, 69,608 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 14 | 8,612 | 28 | 1,036,163 | 128 |
| review:measurement | claude-opus-5-5 | 7 | 7,216 | 14 | 418,170 | 125 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 6,825 | 6 | 94,978 | 40 |
| synthesize:report | claude-sonnet-5-5 | 2 | 6,822 | 4 | 49,350 | 38 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 5,540 | 18 | 302,605 | 1020 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,887 | 14 | 216,284 | 1001 |
| review:bugs | claude-opus-5-5 | 14 | 4,540 | 28 | 770,265 | 498 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 6 | 4,094 | 12 | 407,656 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,072 | 10 | 129,108 | 839 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 5 | 3,064 | 10 | 343,438 | 25 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 4 | 2,641 | 8 | 226,092 | 21 |
| machine:bash _acceptance/doi-ten-ban-uy-quyen/ra | claude-haiku-5-5 | 2 | 1,079 | 4 | 38,374 | 9 |
| triage | claude-sonnet-5-5 | 2 | 1,058 | 4 | 36,428 | 10 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 980 | 4 | 38,344 | 109 |
| machine:bash _acceptance/doi-ten-ban-uy-quyen/ra | claude-haiku-5-5 | 2 | 950 | 4 | 38,374 | 10 |
| machine:bash _acceptance/doi-ten-ban-uy-quyen/ra | claude-haiku-5-5 | 2 | 831 | 4 | 38,374 | 8 |
| machine:bash _acceptance/doi-ten-ban-uy-quyen/ra | claude-haiku-5-5 | 2 | 789 | 4 | 38,374 | 38 |
| machine:bash _acceptance/doi-ten-ban-uy-quyen/ra | claude-haiku-5-5 | 2 | 776 | 4 | 38,374 | 8 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 748 | 4 | 0 | 354 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 726 | 4 | 38,400 | 172 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 721 | 4 | 38,400 | 109 |
| machine:bash _acceptance/doi-ten-ban-uy-quyen/ra | claude-haiku-5-5 | 2 | 654 | 4 | 38,374 | 19 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 625 | 4 | 38,370 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 545 | 4 | 38,400 | 118 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 511 | 4 | 38,360 | 5 |
| machine:bash _acceptance/doi-ten-ban-uy-quyen/ra | claude-haiku-5-5 | 2 | 491 | 4 | 38,374 | 10 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 439 | 4 | 38,344 | 11 |
| capture:provenance | claude-sonnet-5-5 | 2 | 372 | 4 | 33,621 | 6 |


wall: 3801s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 6,825 | 94,978 | 40 | 00:22:58 | 00:23:38 |
| machine | 18 | 24,364 | 1,185,233 | 3747 | 00:22:58 | 01:25:25 |
| judge | 3 | 9,799 | 977,186 | 30 | 00:22:58 | 00:23:28 |
| review | 3 | 20,368 | 2,224,598 | 500 | 00:23:07 | 00:31:27 |
| triage | 1 | 1,058 | 36,428 | 10 | 01:25:25 | 01:25:35 |
| capture | 1 | 372 | 33,621 | 6 | 01:25:35 | 01:25:41 |
| synthesize | 1 | 6,822 | 49,350 | 38 | 01:25:41 | 01:26:19 |

- **claude-opus-5-5**: 3 agent · 35 calls · out 20,368 · in 70 · cache_read 2,224,598 · cache_create 342,136
- **claude-sonnet-5-5**: 7 agent · 24 calls · out 24,876 · in 48 · cache_read 1,191,563 · cache_create 495,789
- **claude-haiku-5-5**: 18 agent · 51 calls · out 24,364 · in 102 · cache_read 1,185,233 · cache_create 835,728

