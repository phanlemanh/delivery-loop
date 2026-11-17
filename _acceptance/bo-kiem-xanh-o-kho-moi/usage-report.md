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

### S4 round 2 — wf_3e1cdde5-690 (25 agent, 59,912 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 11 | 7,852 | 22 | 622,337 | 115 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,004 | 4 | 50,741 | 40 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 6,034 | 6 | 96,226 | 282 |
| review:conventions | claude-opus-5-5 | 9 | 5,303 | 18 | 461,709 | 87 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,766 | 12 | 182,960 | 855 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,047 | 16 | 273,713 | 1014 |
| review:measurement | claude-opus-5-5 | 7 | 3,695 | 14 | 316,761 | 72 |
| machine:node --test migration/kich-ban/don-nha.t | claude-haiku-5-5 | 2 | 2,069 | 4 | 38,626 | 244 |
| machine:node migration/kich-ban/thuoc-that.mjs | claude-haiku-5-5 | 2 | 1,913 | 4 | 38,546 | 102 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,879 | 4 | 38,538 | 98 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 4 | 1,756 | 8 | 91,041 | 722 |
| machine:node --test migration/kich-ban/don-nha.t | claude-haiku-5-5 | 2 | 1,596 | 4 | 38,546 | 239 |
| triage | claude-sonnet-5-5 | 2 | 1,541 | 4 | 37,356 | 13 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,293 | 4 | 38,538 | 13 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,283 | 4 | 35,247 | 300 |
| machine:node migration/kich-ban/thuoc-that.mjs - | claude-haiku-5-5 | 2 | 1,114 | 4 | 38,554 | 175 |
| machine:node migration/kich-ban/do-san.mjs | claude-haiku-5-5 | 2 | 917 | 4 | 6,600 | 471 |
| machine:node migration/kich-ban/thuoc-that.mjs - | claude-haiku-5-5 | 2 | 898 | 4 | 38,554 | 26 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 858 | 4 | 38,594 | 175 |
| refute:evals.yaml | claude-sonnet-5-5 | 2 | 837 | 4 | 34,361 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 829 | 4 | 38,594 | 108 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 769 | 4 | 38,594 | 114 |
| machine:node scripts/product-map.mjs --root . -- | claude-haiku-5-5 | 2 | 759 | 4 | 38,539 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 533 | 4 | 38,564 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 367 | 4 | 34,036 | 5 |


wall: 3480s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 16,850 | 1,400,807 | 119 | 11:09:16 | 11:11:14 |
| baseline | 1 | 6,034 | 96,226 | 282 | 11:09:16 | 11:13:58 |
| machine | 17 | 27,279 | 1,052,348 | 3414 | 11:09:16 | 12:06:10 |
| triage | 1 | 1,541 | 37,356 | 13 | 12:06:10 | 12:06:23 |
| refute | 1 | 837 | 34,361 | 8 | 12:06:23 | 12:06:31 |
| capture | 1 | 367 | 34,036 | 5 | 12:06:31 | 12:06:36 |
| synthesize | 1 | 7,004 | 50,741 | 40 | 12:06:36 | 12:07:16 |

- **claude-opus-5-5**: 3 agent · 27 calls · out 16,850 · in 54 · cache_read 1,400,807 · cache_create 206,647
- **claude-sonnet-5-5**: 5 agent · 11 calls · out 15,783 · in 22 · cache_read 252,720 · cache_create 259,542
- **claude-haiku-5-5**: 17 agent · 46 calls · out 27,279 · in 92 · cache_read 1,052,348 · cache_create 840,111

