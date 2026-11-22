### S4 round 1 — wf_05cc9883-64d (21 agent, 80,488 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 16 | 11,590 | 32 | 1,048,935 | 216 |
| review:conventions | claude-opus-5-5 | 15 | 11,091 | 30 | 1,006,886 | 181 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 10,462 | 6 | 44,858 | 542 |
| review:measurement | claude-opus-5-5 | 8 | 10,381 | 16 | 397,913 | 133 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,003 | 4 | 48,934 | 38 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 6,139 | 16 | 257,881 | 1008 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,063 | 16 | 260,465 | 920 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 3,051 | 12 | 168,930 | 957 |
| triage | claude-sonnet-5-5 | 2 | 2,742 | 4 | 38,024 | 20 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 2,660 | 6 | 83,121 | 103 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,963 | 4 | 37,695 | 98 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,891 | 4 | 37,695 | 15 |
| machine:bash -c 'set -o pipefail; node --test -- | claude-haiku-5-5 | 2 | 1,651 | 4 | 6,762 | 414 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,329 | 4 | 3,381 | 390 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 761 | 4 | 37,751 | 165 |
| machine:bash _acceptance/va-chu-ky-giu-cho-lenh- | claude-haiku-5-5 | 2 | 749 | 4 | 37,740 | 85 |
| machine:bash _acceptance/va-chu-ky-giu-cho-lenh- | claude-haiku-5-5 | 2 | 668 | 4 | 37,740 | 18 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 646 | 4 | 37,721 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 645 | 4 | 37,751 | 115 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 643 | 4 | 37,711 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 360 | 4 | 33,084 | 5 |


wall: 3848s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 10,462 | 44,858 | 542 | 10:07:51 | 10:16:53 |
| review | 3 | 33,062 | 2,453,734 | 218 | 10:07:51 | 10:11:29 |
| machine | 14 | 26,859 | 1,082,344 | 3784 | 10:07:51 | 11:10:55 |
| triage | 1 | 2,742 | 38,024 | 20 | 11:10:55 | 11:11:15 |
| capture | 1 | 360 | 33,084 | 5 | 11:11:15 | 11:11:20 |
| synthesize | 1 | 7,003 | 48,934 | 38 | 11:11:21 | 11:11:59 |

- **claude-opus-5-5**: 3 agent · 39 calls · out 33,062 · in 78 · cache_read 2,453,734 · cache_create 259,795
- **claude-sonnet-5-5**: 4 agent · 9 calls · out 20,567 · in 18 · cache_read 164,900 · cache_create 271,014
- **claude-haiku-5-5**: 14 agent · 45 calls · out 26,859 · in 90 · cache_read 1,082,344 · cache_create 711,102

