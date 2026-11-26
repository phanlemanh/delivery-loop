### S4 round 1 — wf_80dc62ce-3f4 (26 agent, 105,951 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 25 | 24,202 | 50 | 2,194,940 | 296 |
| review:measurement | claude-opus-5-5 | 14 | 17,452 | 28 | 1,075,381 | 245 |
| review:bugs | claude-opus-5-5 | 16 | 11,678 | 32 | 1,162,754 | 172 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,784 | 4 | 62,461 | 62 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,422 | 6 | 96,339 | 43 |
| triage | claude-sonnet-5-5 | 2 | 5,804 | 4 | 42,680 | 38 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,465 | 14 | 225,502 | 995 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,796 | 16 | 259,599 | 955 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,654 | 12 | 171,342 | 810 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 2,243 | 4 | 38,019 | 111 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,130 | 4 | 38,075 | 165 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,043 | 4 | 34,647 | 252 |
| machine:bash _acceptance/bang-chung-cu-theo-dau- | claude-haiku-5-5 | 2 | 920 | 4 | 38,048 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 808 | 4 | 38,075 | 112 |
| machine:bash _acceptance/bang-chung-cu-theo-dau- | claude-haiku-5-5 | 2 | 781 | 4 | 38,048 | 8 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 774 | 4 | 38,019 | 12 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 698 | 4 | 38,045 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 688 | 4 | 38,075 | 107 |
| machine:bash _acceptance/bang-chung-cu-theo-dau- | claude-haiku-5-5 | 2 | 667 | 4 | 38,048 | 10 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 622 | 4 | 38,035 | 7 |
| machine:bash _acceptance/bang-chung-cu-theo-dau- | claude-haiku-5-5 | 2 | 616 | 4 | 38,048 | 9 |
| machine:bash _acceptance/bang-chung-cu-theo-dau- | claude-haiku-5-5 | 2 | 612 | 4 | 38,048 | 10 |
| machine:bash _acceptance/bang-chung-cu-theo-dau- | claude-haiku-5-5 | 2 | 599 | 4 | 38,048 | 8 |
| machine:bash _acceptance/bang-chung-cu-theo-dau- | claude-haiku-5-5 | 2 | 580 | 4 | 38,048 | 20 |
| machine:bash _acceptance/bang-chung-cu-theo-dau- | claude-haiku-5-5 | 2 | 539 | 4 | 38,048 | 9 |
| capture:provenance | claude-sonnet-5-5 | 2 | 374 | 4 | 33,414 | 6 |


wall: 3645s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 53,332 | 4,433,075 | 296 | 16:02:01 | 16:06:58 |
| baseline | 1 | 7,422 | 96,339 | 43 | 16:02:01 | 16:02:44 |
| machine | 19 | 28,235 | 1,261,817 | 3537 | 16:02:01 | 17:00:58 |
| triage | 1 | 5,804 | 42,680 | 38 | 17:00:58 | 17:01:37 |
| capture | 1 | 374 | 33,414 | 6 | 17:01:37 | 17:01:43 |
| synthesize | 1 | 10,784 | 62,461 | 62 | 17:01:44 | 17:02:46 |

- **claude-opus-5-5**: 3 agent · 55 calls · out 53,332 · in 110 · cache_read 4,433,075 · cache_create 336,421
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 24,384 · in 18 · cache_read 234,894 · cache_create 224,235
- **claude-haiku-5-5**: 19 agent · 53 calls · out 28,235 · in 106 · cache_read 1,261,817 · cache_create 839,875

