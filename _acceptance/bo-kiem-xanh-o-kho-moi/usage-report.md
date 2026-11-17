### S4 round 1 — wf_d113ed0c-684 (25 agent, 115,798 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 22 | 25,679 | 44 | 2,336,819 | 412 |
| review:conventions | claude-opus-5-5 | 31 | 21,631 | 62 | 3,291,141 | 554 |
| review:measurement | claude-opus-5-5 | 19 | 19,167 | 38 | 1,820,700 | 257 |
| synthesize:report | claude-sonnet-5-5 | 2 | 9,037 | 4 | 55,547 | 50 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 6,069 | 6 | 95,321 | 259 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 5,809 | 16 | 276,894 | 1029 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 4,293 | 10 | 135,262 | 745 |
| triage | claude-sonnet-5-5 | 2 | 4,168 | 4 | 41,098 | 30 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,675 | 12 | 178,734 | 844 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,821 | 4 | 38,081 | 98 |
| machine:node migration/kich-ban/thuoc-that.mjs | claude-haiku-5-5 | 2 | 1,695 | 4 | 38,089 | 183 |
| machine:node --test migration/kich-ban/don-nha.t | claude-haiku-5-5 | 2 | 1,685 | 4 | 38,169 | 276 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,550 | 4 | 38,081 | 14 |
| machine:node --test migration/kich-ban/don-nha.t | claude-haiku-5-5 | 2 | 1,542 | 4 | 38,089 | 276 |
| refute:phan-lop.py | claude-sonnet-5-5 | 4 | 1,225 | 8 | 134,146 | 14 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,175 | 4 | 3,300 | 343 |
| machine:node migration/kich-ban/thuoc-that.mjs - | claude-haiku-5-5 | 2 | 909 | 4 | 38,097 | 77 |
| machine:node migration/kich-ban/do-san.mjs | claude-haiku-5-5 | 2 | 849 | 4 | 6,600 | 520 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 809 | 4 | 38,137 | 106 |
| machine:node migration/kich-ban/thuoc-that.mjs - | claude-haiku-5-5 | 2 | 778 | 4 | 38,097 | 93 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 763 | 4 | 38,137 | 167 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 723 | 4 | 38,137 | 119 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 657 | 4 | 38,107 | 6 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 634 | 4 | 38,082 | 7 |
| capture:provenance | claude-sonnet-5-5 | 2 | 455 | 4 | 33,579 | 7 |


wall: 3580s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 66,477 | 7,448,660 | 555 | 09:47:30 | 09:56:45 |
| baseline | 1 | 6,069 | 95,321 | 259 | 09:47:30 | 09:51:49 |
| machine | 17 | 28,367 | 1,058,093 | 3478 | 09:47:30 | 10:45:29 |
| triage | 1 | 4,168 | 41,098 | 30 | 10:45:29 | 10:45:59 |
| refute | 1 | 1,225 | 134,146 | 14 | 10:45:59 | 10:46:13 |
| capture | 1 | 455 | 33,579 | 8 | 10:46:13 | 10:46:21 |
| synthesize | 1 | 9,037 | 55,547 | 50 | 10:46:21 | 10:47:10 |

- **claude-opus-5-5**: 3 agent · 72 calls · out 66,477 · in 144 · cache_read 7,448,660 · cache_create 480,774
- **claude-sonnet-5-5**: 5 agent · 13 calls · out 20,954 · in 26 · cache_read 359,691 · cache_create 276,719
- **claude-haiku-5-5**: 17 agent · 47 calls · out 28,367 · in 94 · cache_read 1,058,093 · cache_create 865,338

