### S4 round 1 — wf_d3eb4442-8fb (23 agent, 93,709 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 31 | 25,537 | 62 | 2,963,542 | 705 |
| review:conventions | claude-opus-5-5 | 27 | 19,166 | 54 | 2,612,470 | 267 |
| review:measurement | claude-opus-5-5 | 10 | 12,002 | 20 | 617,961 | 290 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,337 | 4 | 44,504 | 53 |
| triage | claude-sonnet-5-5 | 2 | 4,948 | 4 | 32,712 | 33 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 4,329 | 6 | 59,937 | 94 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 2,346 | 14 | 139,461 | 916 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,893 | 4 | 25,597 | 93 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 1,756 | 8 | 54,674 | 704 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 1,727 | 10 | 85,261 | 877 |
| machine:node _acceptance/chuyen-gop/rang/dot-bie | claude-haiku-5-5 | 2 | 1,175 | 4 | 25,615 | 142 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,101 | 4 | 25,822 | 80 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,085 | 4 | 25,687 | 21 |
| refute:dot-bien.mjs | claude-sonnet-5-5 | 4 | 932 | 8 | 74,380 | 133 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 857 | 4 | 25,597 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 784 | 4 | 25,653 | 118 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 613 | 4 | 25,653 | 85 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 613 | 4 | 25,653 | 85 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 588 | 4 | 25,623 | 6 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 584 | 4 | 25,613 | 7 |
| refute:dot-bien.mjs | claude-sonnet-5-5 | 2 | 542 | 4 | 24,427 | 125 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 464 | 4 | 25,606 | 163 |
| capture:provenance | claude-sonnet-5-5 | 2 | 330 | 4 | 24,176 | 5 |


wall: 3296s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 4,329 | 59,937 | 94 | 08:29:35 | 08:31:09 |
| review | 3 | 56,705 | 6,193,973 | 710 | 08:29:35 | 08:41:25 |
| machine | 14 | 15,586 | 561,515 | 3070 | 08:29:35 | 09:20:45 |
| triage | 1 | 4,948 | 32,712 | 33 | 09:20:45 | 09:21:18 |
| refute | 2 | 1,474 | 98,807 | 134 | 09:21:18 | 09:23:33 |
| capture | 1 | 330 | 24,176 | 5 | 09:23:33 | 09:23:38 |
| synthesize | 1 | 10,337 | 44,504 | 53 | 09:23:39 | 09:24:31 |

- **claude-opus-5-5**: 3 agent · 68 calls · out 56,705 · in 136 · cache_read 6,193,973 · cache_create 513,180
- **claude-sonnet-5-5**: 6 agent · 15 calls · out 21,418 · in 30 · cache_read 260,136 · cache_create 178,452
- **claude-haiku-5-5**: 14 agent · 38 calls · out 15,586 · in 76 · cache_read 561,515 · cache_create 381,298

