### S4 round 1 — wf_4bc8ee5b-a7a (31 agent, 99,362 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 27 | 14,146 | 54 | 2,369,997 | 253 |
| review:measurement | claude-opus-5-5 | 10 | 11,907 | 20 | 712,227 | 145 |
| review:bugs | claude-opus-5-5 | 13 | 11,902 | 26 | 878,624 | 190 |
| synthesize:report | claude-sonnet-5-5 | 2 | 10,070 | 4 | 56,538 | 58 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 8,642 | 6 | 99,638 | 46 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 5,214 | 14 | 214,826 | 958 |
| judge:E11:operational-feasibility | claude-sonnet-5-5 | 3 | 4,302 | 6 | 118,435 | 33 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 3,923 | 12 | 171,225 | 875 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 3,778 | 8 | 85,691 | 806 |
| triage | claude-sonnet-5-5 | 2 | 3,428 | 4 | 39,392 | 25 |
| judge:E11:domain-correctness | claude-sonnet-5-5 | 3 | 3,421 | 6 | 114,815 | 25 |
| judge:E11:spec-alignment | claude-sonnet-5-5 | 3 | 2,610 | 6 | 115,632 | 21 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,852 | 4 | 37,988 | 112 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,529 | 4 | 37,988 | 13 |
| machine:bash _acceptance/giam-sat-doc-ban-uy-quy | claude-haiku-5-5 | 2 | 1,138 | 4 | 38,020 | 12 |
| machine:bash _acceptance/giam-sat-doc-ban-uy-quy | claude-haiku-5-5 | 2 | 989 | 4 | 38,020 | 13 |
| machine:bash _acceptance/giam-sat-doc-ban-uy-quy | claude-haiku-5-5 | 2 | 976 | 4 | 38,020 | 13 |
| machine:bash _acceptance/giam-sat-doc-ban-uy-quy | claude-haiku-5-5 | 2 | 922 | 4 | 38,020 | 13 |
| machine:bash _acceptance/giam-sat-doc-ban-uy-quy | claude-haiku-5-5 | 2 | 885 | 4 | 38,020 | 15 |
| machine:bash _acceptance/giam-sat-doc-ban-uy-quy | claude-haiku-5-5 | 2 | 842 | 4 | 38,020 | 8 |
| machine:bash _acceptance/giam-sat-doc-ban-uy-quy | claude-haiku-5-5 | 2 | 837 | 4 | 38,020 | 8 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 778 | 4 | 34,616 | 235 |
| machine:bash _acceptance/giam-sat-doc-ban-uy-quy | claude-haiku-5-5 | 2 | 755 | 4 | 38,020 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 688 | 4 | 38,044 | 111 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 651 | 4 | 38,004 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 646 | 4 | 38,044 | 106 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 634 | 4 | 38,044 | 162 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 541 | 4 | 38,014 | 6 |
| machine:bash _acceptance/giam-sat-doc-ban-uy-quy | claude-haiku-5-5 | 2 | 498 | 4 | 38,020 | 18 |
| machine:bash _acceptance/giam-sat-doc-ban-uy-quy | claude-haiku-5-5 | 2 | 486 | 4 | 38,020 | 13 |
| capture:provenance | claude-sonnet-5-5 | 2 | 372 | 4 | 33,381 | 6 |


wall: 3484s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 8,642 | 99,638 | 46 | 09:36:41 | 09:37:27 |
| machine | 21 | 28,562 | 1,152,684 | 3393 | 09:36:41 | 10:33:14 |
| judge | 3 | 10,333 | 348,882 | 34 | 09:36:50 | 09:37:24 |
| review | 3 | 37,955 | 3,960,848 | 253 | 09:36:54 | 09:41:07 |
| triage | 1 | 3,428 | 39,392 | 25 | 10:33:15 | 10:33:40 |
| capture | 1 | 372 | 33,381 | 6 | 10:33:40 | 10:33:46 |
| synthesize | 1 | 10,070 | 56,538 | 58 | 10:33:47 | 10:34:45 |

- **claude-opus-5-5**: 3 agent · 50 calls · out 37,955 · in 100 · cache_read 3,960,848 · cache_create 320,764
- **claude-sonnet-5-5**: 7 agent · 18 calls · out 32,845 · in 36 · cache_read 577,831 · cache_create 475,615
- **claude-haiku-5-5**: 21 agent · 53 calls · out 28,562 · in 106 · cache_read 1,152,684 · cache_create 908,620

