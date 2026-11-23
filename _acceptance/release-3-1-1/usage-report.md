### S4 round 1 — wf_cadf07c6-a9f (26 agent, 77,164 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,411 | 6 | 107,831 | 62 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,467 | 4 | 51,369 | 51 |
| review:bugs | claude-opus-5-5 | 9 | 7,899 | 18 | 450,993 | 141 |
| review:conventions | claude-opus-5-5 | 9 | 7,113 | 18 | 462,937 | 88 |
| review:measurement | claude-opus-5-5 | 10 | 6,267 | 20 | 533,468 | 129 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 4 | 5,552 | 8 | 167,803 | 43 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 4 | 5,545 | 8 | 176,583 | 42 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 4 | 4,608 | 8 | 184,163 | 37 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,238 | 6 | 82,418 | 26 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 2,486 | 6 | 82,870 | 13 |
| triage | claude-sonnet-5-5 | 2 | 1,804 | 4 | 37,293 | 17 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,112 | 4 | 37,738 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,052 | 4 | 37,747 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,045 | 4 | 34,413 | 7 |
| machine:bash _acceptance/release-3-1-1/chay.sh d | claude-haiku-5-5 | 2 | 1,039 | 4 | 37,754 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,034 | 4 | 37,752 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 978 | 4 | 37,752 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 961 | 4 | 37,752 | 6 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 940 | 4 | 37,738 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 880 | 4 | 37,794 | 6 |
| machine:bash _acceptance/release-3-1-1/chay.sh v | claude-haiku-5-5 | 2 | 843 | 4 | 37,753 | 7 |
| machine:bash _acceptance/release-3-1-1/chay.sh c | claude-haiku-5-5 | 2 | 768 | 4 | 37,753 | 6 |
| machine:bash _acceptance/release-3-1-1/chay.sh l | claude-haiku-5-5 | 2 | 660 | 4 | 37,754 | 6 |
| machine:bash _acceptance/release-3-1-1/chay.sh g | claude-haiku-5-5 | 2 | 594 | 4 | 37,754 | 6 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 516 | 4 | 37,754 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 352 | 4 | 33,122 | 6 |


wall: 218s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,411 | 107,831 | 62 | 00:42:09 | 00:43:11 |
| review | 3 | 21,279 | 1,447,398 | 143 | 00:42:09 | 00:44:32 |
| judge | 3 | 15,705 | 528,549 | 44 | 00:42:09 | 00:42:53 |
| machine | 16 | 18,146 | 690,496 | 96 | 00:42:09 | 00:43:45 |
| triage | 1 | 1,804 | 37,293 | 17 | 00:44:32 | 00:44:49 |
| capture | 1 | 352 | 33,122 | 6 | 00:44:49 | 00:44:55 |
| synthesize | 1 | 8,467 | 51,369 | 51 | 00:44:55 | 00:45:47 |

- **claude-sonnet-5-5**: 7 agent · 21 calls · out 37,739 · in 42 · cache_read 758,164 · cache_create 484,848
- **claude-opus-5-5**: 3 agent · 28 calls · out 21,279 · in 56 · cache_read 1,447,398 · cache_create 201,773
- **claude-haiku-5-5**: 16 agent · 34 calls · out 18,146 · in 68 · cache_read 690,496 · cache_create 604,297

