### S4 round 1 — wf_2d0225f9-1f1 (25 agent, 101,306 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| judge:E7:spec-alignment | claude-sonnet-5-5 | 13 | 16,467 | 26 | 1,335,261 | 127 |
| judge:E7:operational-feasibility | claude-sonnet-5-5 | 14 | 15,098 | 28 | 1,545,959 | 125 |
| judge:E7:domain-correctness | claude-sonnet-5-5 | 11 | 14,653 | 22 | 1,205,570 | 108 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 10,516 | 6 | 32,760 | 537 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,091 | 4 | 34,561 | 47 |
| review:measurement | claude-opus-5-5 | 7 | 7,349 | 16 | 214,670 | 93 |
| review:conventions | claude-opus-5-5 | 11 | 4,099 | 22 | 428,417 | 69 |
| review:bugs | claude-opus-5-5 | 8 | 3,541 | 16 | 241,274 | 172 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 3,146 | 6 | 28,658 | 688 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 3 | 2,833 | 6 | 28,656 | 676 |
| triage | claude-sonnet-5-5 | 3 | 2,405 | 6 | 54,218 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 1,997 | 6 | 54,710 | 80 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 1,902 | 6 | 54,575 | 22 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,545 | 4 | 25,566 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,263 | 4 | 3,381 | 562 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,172 | 4 | 25,566 | 90 |
| machine:bash _acceptance/release-3-1-0/chay.sh c | claude-haiku-5-5 | 2 | 793 | 4 | 25,581 | 8 |
| machine:bash _acceptance/release-3-1-0/chay.sh l | claude-haiku-5-5 | 2 | 714 | 4 | 25,582 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 680 | 4 | 22,241 | 117 |
| machine:bash _acceptance/release-3-1-0/chay.sh d | claude-haiku-5-5 | 2 | 624 | 4 | 25,582 | 7 |
| machine:bash _acceptance/release-3-1-0/chay.sh g | claude-haiku-5-5 | 2 | 592 | 4 | 25,582 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 570 | 4 | 25,622 | 78 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 506 | 4 | 25,582 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 434 | 4 | 25,575 | 160 |
| capture:provenance | claude-sonnet-5-5 | 2 | 316 | 4 | 20,926 | 5 |


wall: 2564s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| judge | 3 | 46,218 | 4,086,790 | 129 | 10:47:50 | 10:49:59 |
| baseline | 1 | 10,516 | 32,760 | 537 | 10:47:50 | 10:56:47 |
| review | 3 | 14,989 | 884,361 | 175 | 10:47:50 | 10:50:45 |
| machine | 15 | 18,771 | 422,459 | 2494 | 10:47:50 | 11:29:24 |
| triage | 1 | 2,405 | 54,218 | 18 | 11:29:24 | 11:29:42 |
| capture | 1 | 316 | 20,926 | 5 | 11:29:42 | 11:29:47 |
| synthesize | 1 | 8,091 | 34,561 | 47 | 11:29:47 | 11:30:34 |

- **claude-sonnet-5-5**: 7 agent · 48 calls · out 67,546 · in 96 · cache_read 4,229,255 · cache_create 723,422
- **claude-opus-5-5**: 3 agent · 26 calls · out 14,989 · in 54 · cache_read 884,361 · cache_create 143,037
- **claude-haiku-5-5**: 15 agent · 34 calls · out 18,771 · in 68 · cache_read 422,459 · cache_create 415,127

