### S4 round 1 — wf_b073b9d7-9f2 (23 agent, 64,725 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 8 | 7,871 | 16 | 407,751 | 252 |
| review:measurement | claude-opus-5-5 | 5 | 7,700 | 10 | 225,861 | 87 |
| review:conventions | claude-opus-5-5 | 11 | 7,580 | 22 | 618,526 | 121 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,415 | 4 | 50,611 | 42 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 5,618 | 6 | 90,451 | 35 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,380 | 14 | 225,419 | 903 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,169 | 12 | 176,463 | 902 |
| triage | claude-sonnet-5-5 | 2 | 3,965 | 4 | 39,329 | 29 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 3,822 | 16 | 255,476 | 1054 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,943 | 4 | 37,625 | 100 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,069 | 4 | 34,253 | 289 |
| machine:bash _acceptance/tcg1-ghim-moc-truoc-von | claude-haiku-5-5 | 2 | 935 | 4 | 37,655 | 23 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 833 | 4 | 37,625 | 20 |
| machine:bash _acceptance/tcg1-ghim-moc-truoc-von | claude-haiku-5-5 | 2 | 808 | 4 | 37,654 | 126 |
| machine:bash _acceptance/tcg1-ghim-moc-truoc-von | claude-haiku-5-5 | 2 | 786 | 4 | 37,657 | 21 |
| machine:bash _acceptance/tcg1-ghim-moc-truoc-von | claude-haiku-5-5 | 2 | 782 | 4 | 37,654 | 14 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 754 | 4 | 37,681 | 176 |
| machine:bash _acceptance/tcg1-ghim-moc-truoc-von | claude-haiku-5-5 | 2 | 660 | 4 | 37,657 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 629 | 4 | 37,681 | 106 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 549 | 4 | 37,681 | 145 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 548 | 4 | 37,651 | 6 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 460 | 4 | 37,641 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 449 | 4 | 33,017 | 9 |


wall: 3786s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 23,151 | 1,252,138 | 254 | 07:33:03 | 07:37:18 |
| baseline | 1 | 5,618 | 90,451 | 35 | 07:33:03 | 07:33:38 |
| machine | 16 | 24,127 | 1,143,473 | 3706 | 07:33:03 | 08:34:49 |
| triage | 1 | 3,965 | 39,329 | 29 | 08:34:49 | 08:35:18 |
| capture | 1 | 449 | 33,017 | 10 | 08:35:18 | 08:35:28 |
| synthesize | 1 | 7,415 | 50,611 | 42 | 08:35:28 | 08:36:10 |

- **claude-opus-5-5**: 3 agent · 24 calls · out 23,151 · in 48 · cache_read 1,252,138 · cache_create 213,964
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 17,447 · in 18 · cache_read 213,408 · cache_create 203,322
- **claude-haiku-5-5**: 16 agent · 47 calls · out 24,127 · in 94 · cache_read 1,143,473 · cache_create 723,300

