### S4 round 1 — wf_56f00358-6bc (27 agent, 154,474 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 37 | 23,914 | 74 | 3,670,774 | 408 |
| review:conventions | claude-opus-5-5 | 20 | 15,854 | 40 | 1,764,360 | 216 |
| review:measurement | claude-opus-5-5 | 17 | 15,220 | 34 | 1,245,521 | 205 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 12,275 | 6 | 46,507 | 544 |
| machine:bash _acceptance/release-3-0-0/vi-phan-h | claude-haiku-5-5 | 10 | 11,083 | 20 | 433,284 | 781 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,878 | 4 | 57,182 | 61 |
| judge:E10:spec-alignment | claude-sonnet-5-5 | 6 | 9,308 | 12 | 325,156 | 66 |
| judge:E10:domain-correctness | claude-sonnet-5-5 | 8 | 9,179 | 16 | 512,593 | 68 |
| judge:E10:operational-feasibility | claude-sonnet-5-5 | 9 | 8,332 | 18 | 583,188 | 67 |
| triage | claude-sonnet-5-5 | 2 | 5,541 | 4 | 40,303 | 39 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,172 | 16 | 272,836 | 987 |
| machine:bash _acceptance/release-3-0-0/cay-kich- | claude-haiku-5-5 | 4 | 4,051 | 8 | 130,831 | 195 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,791 | 10 | 132,610 | 711 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,473 | 6 | 84,322 | 29 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 2,959 | 8 | 130,293 | 117 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,408 | 12 | 177,765 | 882 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,985 | 4 | 37,683 | 99 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,823 | 4 | 37,683 | 14 |
| machine:bash _acceptance/release-3-0-0/hang-loi. | claude-haiku-5-5 | 2 | 1,512 | 4 | 37,734 | 16 |
| machine:bash _acceptance/release-3-0-0/guide-ci. | claude-haiku-5-5 | 2 | 1,447 | 4 | 37,734 | 28 |
| machine:GIT_GLOB_PATHSPECS=1 bash _acceptance/re | claude-haiku-5-5 | 2 | 1,065 | 4 | 37,830 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 960 | 4 | 34,323 | 195 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 859 | 4 | 37,692 | 253 |
| machine:bash _acceptance/release-3-0-0/don-dau-v | claude-haiku-5-5 | 2 | 801 | 4 | 37,699 | 33 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 612 | 4 | 37,739 | 118 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 605 | 4 | 37,699 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 367 | 4 | 33,060 | 5 |


wall: 3516s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 54,988 | 6,680,655 | 417 | 17:17:24 | 17:24:21 |
| baseline | 1 | 12,275 | 46,507 | 544 | 17:17:24 | 17:26:28 |
| machine | 17 | 43,606 | 1,735,757 | 3411 | 17:17:24 | 18:14:15 |
| judge | 3 | 26,819 | 1,420,937 | 68 | 17:17:24 | 17:18:32 |
| triage | 1 | 5,541 | 40,303 | 39 | 18:14:15 | 18:14:54 |
| capture | 1 | 367 | 33,060 | 5 | 18:14:54 | 18:14:59 |
| synthesize | 1 | 10,878 | 57,182 | 61 | 18:14:59 | 18:16:00 |

- **claude-opus-5-5**: 3 agent · 74 calls · out 54,988 · in 148 · cache_read 6,680,655 · cache_create 354,010
- **claude-sonnet-5-5**: 7 agent · 32 calls · out 55,880 · in 64 · cache_read 1,597,989 · cache_create 579,433
- **claude-haiku-5-5**: 17 agent · 60 calls · out 43,606 · in 120 · cache_read 1,735,757 · cache_create 816,274

